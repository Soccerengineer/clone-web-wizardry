-- Cihaz eşleştirme tablosunu oluştur
CREATE TABLE IF NOT EXISTS device_pairings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  selected_time VARCHAR(10) NOT NULL,
  selected_position VARCHAR(50) NOT NULL,
  selected_team VARCHAR(20) NOT NULL,
  device_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expiry_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  is_guest BOOLEAN DEFAULT false,
  guest_identifier VARCHAR(255)
);

-- Unique index oluşturarak aynı saatte aynı cihaz ID'sinin kullanılmasını engelle
CREATE UNIQUE INDEX IF NOT EXISTS device_pairing_time_device_idx ON device_pairings (selected_time, device_id) 
WHERE is_active = true;

-- RLS (Row Level Security) politikaları ekle
ALTER TABLE device_pairings ENABLE ROW LEVEL SECURITY;

-- Herkes kendi eşleştirmelerini görebilir
CREATE POLICY "Kullanıcılar kendi cihaz eşleştirmelerini görebilir" 
ON device_pairings FOR SELECT
USING (auth.uid() = player_id OR is_guest = true);

-- Kullanıcılar sadece kendi eşleştirmelerini ekleyebilir
CREATE POLICY "Kullanıcılar kendi cihaz eşleştirmelerini ekleyebilir" 
ON device_pairings FOR INSERT 
WITH CHECK (auth.uid() = player_id);

-- Kullanıcılar sadece kendi eşleştirmelerini düzenleyebilir (aktif/pasif yapabilir)
CREATE POLICY "Kullanıcılar kendi cihaz eşleştirmelerini güncelleyebilir" 
ON device_pairings FOR UPDATE
USING (auth.uid() = player_id OR is_guest = true);

-- Otomatik süre sonu ayarlamak için fonksiyon oluştur
CREATE OR REPLACE FUNCTION set_expiry_for_device_pairing()
RETURNS TRIGGER AS $$
BEGIN
  -- Seçilen saat formatındadır (örn. "14:00"), bunu bugünün tarihi ile birleştirerek tam tarih oluştur
  NEW.expiry_at := (CURRENT_DATE || ' ' || NEW.selected_time)::timestamp + interval '2 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tetikleyici oluştur: Eşleştirme kaydı eklenirken son kullanma tarihini otomatik ayarla
CREATE TRIGGER set_device_pairing_expiry
BEFORE INSERT ON device_pairings
FOR EACH ROW
EXECUTE FUNCTION set_expiry_for_device_pairing();

-- Aktif eşleştirmeleri gösteren görünümler
-- Tüm aktif cihaz eşleştirmeleri
CREATE OR REPLACE VIEW active_device_pairings AS
SELECT *
FROM device_pairings
WHERE (expiry_at > now() OR expiry_at IS NULL) AND is_active = true;

-- Aktif cihazları gösteren basitleştirilmiş görünüm
CREATE OR REPLACE VIEW active_devices AS
SELECT device_id, selected_time
FROM device_pairings
WHERE (expiry_at > now() OR expiry_at IS NULL) AND is_active = true;

-- Cihaz eşleştirme sorgusuna yardımcı fonksiyon
CREATE OR REPLACE FUNCTION check_device_pairing_exists(
  p_time VARCHAR,
  p_device_id INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM active_device_pairings
    WHERE selected_time = p_time AND device_id = p_device_id
  );
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  nickname TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  email TEXT,
  user_type TEXT DEFAULT 'regular',
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS güvenlik politikaları
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi profillerini görebilir
CREATE POLICY "Kullanıcılar kendi profillerini görebilir" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Kullanıcılar kendi profillerini düzenleyebilir
CREATE POLICY "Kullanıcılar kendi profillerini düzenleyebilir" 
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Kullanıcı oluşturulduğunda otomatik profil ekleme
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    nickname, 
    avatar_url, 
    phone_number, 
    email,
    user_type
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'Süper'),
    COALESCE(new.raw_user_meta_data->>'last_name', 'Oyuncu'),
    COALESCE(new.raw_user_meta_data->>'nickname', NULL),
    new.raw_user_meta_data->>'avatar_url',
    new.phone,
    new.email,
    CASE 
      WHEN new.phone IS NOT NULL THEN 'phone_user'
      WHEN new.email IS NOT NULL THEN 'email_user'
      ELSE 'regular'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Yeni kullanıcı kaydı olduğunda tetikleyici
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 