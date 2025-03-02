-- 1. Kullanıcı istatistikleri tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.user_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    matches_lost INTEGER DEFAULT 0,
    matches_drawn INTEGER DEFAULT 0,
    goals_scored INTEGER DEFAULT 0,
    goals_conceded INTEGER DEFAULT 0,
    shots INTEGER DEFAULT 0,
    shots_on_target INTEGER DEFAULT 0,
    pass_accuracy FLOAT DEFAULT 0,
    possession_avg FLOAT DEFAULT 0,
    tackles_won INTEGER DEFAULT 0,
    fouls_committed INTEGER DEFAULT 0,
    yellow_cards INTEGER DEFAULT 0,
    red_cards INTEGER DEFAULT 0,
    clean_sheets INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- 2. Kullanıcı özet verileri tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.user_overview (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_match_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    last_match_opponent TEXT DEFAULT NULL,
    last_match_result TEXT DEFAULT NULL,
    last_match_score TEXT DEFAULT NULL,
    current_streak INTEGER DEFAULT 0,
    current_streak_type TEXT DEFAULT NULL, -- "win", "loss", "draw"
    favorite_position TEXT DEFAULT NULL,
    favorite_team TEXT DEFAULT NULL,
    rank_points INTEGER DEFAULT 0,
    rank_level INTEGER DEFAULT 1,
    rank_title TEXT DEFAULT 'Yeni Oyuncu',
    recent_form TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- 3. Kullanıcı maç geçmişi tablosunu oluştur (son 5-10 maç detayı)
CREATE TABLE IF NOT EXISTS public.user_match_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    match_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    opponent TEXT DEFAULT NULL,
    result TEXT DEFAULT NULL, -- "win", "loss", "draw"
    score TEXT DEFAULT NULL,
    goals_scored INTEGER DEFAULT 0,
    goals_conceded INTEGER DEFAULT 0,
    position_played TEXT DEFAULT NULL,
    team_played TEXT DEFAULT NULL,
    match_data JSONB DEFAULT NULL, -- detaylı maç istatistikleri
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. RLS (Row Level Security) politikalarını ayarlayın
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_overview ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_match_history ENABLE ROW LEVEL SECURITY;

-- Kullanıcıların kendi verilerine erişebilmesi için politikalar
CREATE POLICY "Kullanıcılar kendi istatistiklerini görebilir"
  ON public.user_statistics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi istatistiklerini düzenleyebilir"
  ON public.user_statistics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi özet verilerini görebilir"
  ON public.user_overview
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi özet verilerini düzenleyebilir"
  ON public.user_overview
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi maç geçmişlerini görebilir"
  ON public.user_match_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi maç geçmişlerini düzenleyebilir"
  ON public.user_match_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi maç geçmişlerine veri ekleyebilir"
  ON public.user_match_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Yeni kullanıcı kaydedildiğinde ilgili tabloları otomatik olarak oluşturan fonksiyonu tanımla
CREATE OR REPLACE FUNCTION public.create_user_statistics_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Kullanıcı istatistik verileri
  INSERT INTO public.user_statistics (user_id)
  VALUES (NEW.id);
  
  -- Kullanıcı özet verileri
  INSERT INTO public.user_overview (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger'ı oluştur
DROP TRIGGER IF EXISTS create_user_data_on_signup ON auth.users;

CREATE TRIGGER create_user_data_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_user_statistics_on_signup();

-- 7. Gerekli indeksleri oluştur
CREATE INDEX IF NOT EXISTS idx_user_statistics_user_id ON public.user_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_overview_user_id ON public.user_overview(user_id);
CREATE INDEX IF NOT EXISTS idx_user_match_history_user_id ON public.user_match_history(user_id); 