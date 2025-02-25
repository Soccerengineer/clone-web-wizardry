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
WITH CHECK (auth.uid() = player_id OR is_guest = true);

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

-- Görünüm oluştur: Aktif cihaz eşleştirmeleri
CREATE OR REPLACE VIEW active_device_pairings AS
SELECT * FROM device_pairings
WHERE is_active = true AND (expiry_at IS NULL OR expiry_at > now()); 