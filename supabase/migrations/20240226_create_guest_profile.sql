-- Misafir kullanıcılar için basitleştirilmiş sabit profil oluştur
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000000') THEN
        -- profiles tablosunda misafir profili oluştur (gerçek sütun adlarıyla)
        INSERT INTO profiles (
            id, 
            first_name,
            lastname,
            email, 
            created_at,
            username
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            'Misafir',
            'Kullanıcı',
            'guest@supersaha.com',
            now(),
            'misafir'
        );
        
        -- Eğer player_stats tablosu varsa misafir için temel istatistikler ekle
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'player_stats') THEN
            INSERT INTO player_stats (
                player_id,
                goals,
                assists,
                matches_played,
                created_at
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                0,
                0,
                0,
                now()
            );
        END IF;
    END IF;
END
$$; 