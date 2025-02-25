-- Telefon doğrulama kodlarını saklamak için tablo oluştur
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE
);

-- RLS politikalarını ayarla
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Herkesin kayıt yapabilmesi için politika oluştur (anonim dahil)
CREATE POLICY "Herkes SMS doğrulama kodu ekleyebilir" ON public.verification_codes FOR INSERT TO anon, authenticated, service_role WITH CHECK (TRUE);

-- Doğrulama kodlarını sorgulama ve silme için politikalar
CREATE POLICY "Doğrulama kodlarını herkes sorgulayabilir" ON public.verification_codes FOR SELECT TO anon, authenticated, service_role USING (TRUE);
CREATE POLICY "Doğrulama kodlarını herkes silebilir" ON public.verification_codes FOR DELETE TO anon, authenticated, service_role USING (TRUE);

-- Süresi geçmiş doğrulama kodlarını temizlemek için fonksiyon
CREATE OR REPLACE FUNCTION clean_expired_verification_codes()
RETURNS TRIGGER AS $$
BEGIN
  -- Süresi geçmiş kodları temizle
  DELETE FROM public.verification_codes 
  WHERE expires_at < NOW();
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Otomatik temizleme için trigger oluştur (her 5 kod eklendikten sonra)
DROP TRIGGER IF EXISTS trigger_clean_verification_codes ON public.verification_codes;
CREATE TRIGGER trigger_clean_verification_codes
AFTER INSERT ON public.verification_codes
FOR EACH STATEMENT
EXECUTE PROCEDURE clean_expired_verification_codes();

-- verification_codes tablosu için indeks oluştur
CREATE INDEX IF NOT EXISTS verification_codes_phone_idx ON public.verification_codes (phone);
CREATE INDEX IF NOT EXISTS verification_codes_expires_at_idx ON public.verification_codes (expires_at);

