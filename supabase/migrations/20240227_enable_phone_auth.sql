-- Telefon doğrulama ve misafir girişi için gerekli yapılandırmalar

-- Supabase auth.users tablosundaki phone_confirmed_at kolonu için trigger ekle
-- Bu trigger, telefon doğrulaması tamamlandığında profil oluşturacak
CREATE OR REPLACE FUNCTION public.handle_phone_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Telefonla doğrulama yapıldığında ve önceden doğrulanmamışsa profil oluştur
  IF NEW.phone_confirmed_at IS NOT NULL AND OLD.phone_confirmed_at IS NULL THEN
    -- profiles tablosuna kullanıcı ekle
    INSERT INTO public.profiles (id, phone, created_at, updated_at)
    VALUES (NEW.id, NEW.phone, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE
    SET phone = NEW.phone, updated_at = NOW();
    
    -- Misafir işaretini ekle
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (NEW.id, 'guest', NOW())
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı auth.users tablosuna bağla
DROP TRIGGER IF EXISTS on_auth_user_phone_confirmed on auth.users;
CREATE TRIGGER on_auth_user_phone_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_phone_confirmation();

-- Misafir rolü için user_roles tablosu kontrol et ve yoksa oluştur
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    CREATE TABLE public.user_roles (
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, role)
    );

    -- RLS politikalarını ayarla
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    
    -- Yöneticilerin tam erişimi olsun
    CREATE POLICY "Admins have full access" ON public.user_roles
      USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
      
    -- Kullanıcılar kendi rollerini okuyabilsin
    CREATE POLICY "Users can read their own roles" ON public.user_roles
      FOR SELECT USING (user_id = auth.uid());
  END IF;
END
$$;

-- profiles tablosunda phone alanını kontrol et ve yoksa ekle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT UNIQUE;
  END IF;
END
$$; 