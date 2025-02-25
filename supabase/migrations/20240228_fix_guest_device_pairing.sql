-- Misafir kullanıcıların device_pairings kaydı oluşturabilmesi için fonksiyon
CREATE OR REPLACE FUNCTION public.create_guest_device_pairing(
  p_selected_time TEXT,
  p_selected_position TEXT,
  p_selected_team TEXT,
  p_device_id INTEGER,
  p_is_guest BOOLEAN,
  p_guest_identifier TEXT
) RETURNS VOID AS $$
BEGIN
  -- device_pairings tablosuna direkt SQL insert kullanarak ekle
  -- Bu şekilde foreign key kısıtlamasını atlayabiliriz
  EXECUTE 'INSERT INTO device_pairings (
    selected_time, 
    selected_position, 
    selected_team, 
    device_id, 
    is_guest, 
    guest_identifier,
    created_at,
    is_active
  ) VALUES (
    $1, $2, $3, $4, $5, $6, NOW(), TRUE
  )'
  USING 
    p_selected_time, 
    p_selected_position, 
    p_selected_team, 
    p_device_id, 
    p_is_guest, 
    p_guest_identifier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- device_pairings tablosundaki player_id sütununu NULL olarak izin ver
DO $$ 
BEGIN
  -- Tabloyu değiştir
  ALTER TABLE public.device_pairings 
  ALTER COLUMN player_id DROP NOT NULL;
  
  -- Constraint'i kaldırma (varsa)
  BEGIN
    ALTER TABLE public.device_pairings 
    DROP CONSTRAINT device_pairings_player_id_fkey;
  EXCEPTION
    WHEN undefined_object THEN
      -- Constraint zaten yoksa hiçbir şey yapma
  END;
  
  -- Yeni bir constraint oluştur (NULL değerlere izin ver)
  ALTER TABLE public.device_pairings 
  ADD CONSTRAINT device_pairings_player_id_fkey 
  FOREIGN KEY (player_id) 
  REFERENCES auth.users(id)
  ON DELETE CASCADE
  DEFERRABLE INITIALLY DEFERRED;
  
END $$; 