import { supabase } from '@/integrations/supabase/client';

// Kullanıcı istatistikleri için tip tanımı
export interface UserStatistics {
  id: string;
  user_id: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  matches_drawn: number;
  goals_scored: number;
  goals_conceded: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  shots: number;
  shots_on_target: number;
  pass_accuracy: number;
  tackles_won: number;
  possessions_avg: number;
  possession_avg: number;
  created_at: string;
  updated_at: string;
}

// Kullanıcı genel bakış verisi için tip tanımı
export interface UserOverview {
  id: string;
  user_id: string;
  last_match_date: string | null;
  last_match_opponent: string | null;
  last_match_result: string | null;
  current_streak: number;
  favorite_position: string;
  favorite_venue: string;
  level: number;
  xp: number;
  total_distance: number;
  overall_rating: number;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  goals_scored: number;
  mvp_count: number;
  created_at: string;
  updated_at: string;
  achievements?: Achievement[];
}

// Başarılar için tip tanımı
export interface Achievement {
  id: string;
  player_id: string;
  achievement_name: string;
  achievement_date: string;
  type: 'mvp' | 'regular' | 'special';
  description?: string;
}

// Kullanıcı maç geçmişi için tip tanımı
export interface UserMatch {
  id: string;
  user_id: string;
  match_date: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  score: string;
  goals_scored: number;
  goals_conceded: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  technical_rating: number;
  position_rating: number;
  physical_rating: number;
  venue: string;
  match_details?: any;
  created_at: string;
}

/**
 * Kullanıcı istatistiklerini getir
 * @param userId - İsteğe bağlı kullanıcı ID'si (belirtilmezse mevcut kullanıcı kullanılır)
 */
export const getUserStatistics = async (userId?: string) => {
  try {
    console.log("getUserStatistics çağrıldı, userId:", userId);
    
    if (!userId) {
      console.log("Kullanıcı ID'si verilmedi, oturum açmış kullanıcı kontrol ediliyor...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Oturum açmış kullanıcı bulunamadı");
        return { 
          data: null, 
          error: new Error('Kullanıcı oturumu bulunamadı') 
        };
      }
      
      userId = user.id;
      console.log("Oturum açmış kullanıcı ID'si:", userId);
    }

    console.log("user_statistics tablosundan veri çekiliyor, user_id:", userId);
    const { data, error } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Kullanıcı istatistikleri getirme hatası:', error);
      return { data: null, error };
    }

    if (!data) {
      console.warn("Kullanıcı için istatistik verisi bulunamadı:", userId);
      // Veri bulunamadı ama hata da yok - birçok sistemde normal bir durum
      return { data: null, error: null };
    }

    console.log("Kullanıcı istatistikleri başarıyla getirildi:", data);
    return { data, error: null };
  } catch (err) {
    console.error('Kullanıcı istatistikleri getirme hatası (Exception):', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Beklenmeyen bir hata oluştu') 
    };
  }
};

/**
 * Kullanıcı genel bakış verilerini getir
 * @param userId - İsteğe bağlı kullanıcı ID'si (belirtilmezse mevcut kullanıcı kullanılır)
 */
export const getUserOverview = async (userId?: string) => {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { 
          data: null, 
          error: new Error('Kullanıcı oturumu bulunamadı') 
        };
      }
      userId = user.id;
    }

    const { data, error } = await supabase
      .from('user_overview')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Kullanıcı genel bakış getirme hatası:', error);
      return { data: null, error };
    }

    // Başarıları getir
    if (data) {
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('player_id', userId)
        .order('achievement_date', { ascending: false });

      if (!achievementsError && achievements) {
        data.achievements = achievements;
      }
    }

    return { data, error: null };
  } catch (err) {
    console.error('Kullanıcı genel bakış getirme hatası:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Beklenmeyen bir hata oluştu') 
    };
  }
};

/**
 * Kullanıcının son maçlarını getir
 * @param userId - İsteğe bağlı kullanıcı ID'si (belirtilmezse mevcut kullanıcı kullanılır)
 * @param limit - Kaç maç getirileceği (varsayılan: 5)
 */
export const getUserMatchHistory = async (userId?: string, limit = 5) => {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { 
          data: null, 
          error: new Error('Kullanıcı oturumu bulunamadı') 
        };
      }
      userId = user.id;
    }

    const { data, error } = await supabase
      .from('user_match_history')
      .select('*')
      .eq('user_id', userId)
      .order('match_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Kullanıcı maç geçmişi getirme hatası:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Kullanıcı maç geçmişi getirme hatası:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Beklenmeyen bir hata oluştu') 
    };
  }
};

/**
 * Kullanıcı istatistiklerini güncelle
 * @param statistics - Güncellenecek istatistik verileri
 * @param userId - İsteğe bağlı kullanıcı ID'si (belirtilmezse mevcut kullanıcı kullanılır)
 */
export const updateUserStatistics = async (statistics: Partial<UserStatistics>, userId?: string) => {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { 
          data: null, 
          error: new Error('Kullanıcı oturumu bulunamadı') 
        };
      }
      userId = user.id;
    }

    const { data, error } = await supabase
      .from('user_statistics')
      .update(statistics)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Kullanıcı istatistikleri güncelleme hatası:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Kullanıcı istatistikleri güncelleme hatası:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Beklenmeyen bir hata oluştu') 
    };
  }
};

/**
 * Kullanıcı genel bakış verilerini güncelle
 * @param overview - Güncellenecek genel bakış verileri
 * @param userId - İsteğe bağlı kullanıcı ID'si (belirtilmezse mevcut kullanıcı kullanılır)
 */
export const updateUserOverview = async (overview: Partial<UserOverview>, userId?: string) => {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { 
          data: null, 
          error: new Error('Kullanıcı oturumu bulunamadı') 
        };
      }
      userId = user.id;
    }

    const { data, error } = await supabase
      .from('user_overview')
      .update(overview)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Kullanıcı genel bakış güncelleme hatası:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Kullanıcı genel bakış güncelleme hatası:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Beklenmeyen bir hata oluştu') 
    };
  }
};

/**
 * Maç sonucu ekle ve ilgili istatistikleri güncelle
 * @param matchResult - Eklenecek maç sonucu verileri
 */
export const addMatchResult = async (matchResult: Omit<UserMatch, 'id' | 'created_at'>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { 
        data: null, 
        error: new Error('Kullanıcı oturumu bulunamadı') 
      };
    }
    
    const userId = user.id;
    matchResult.user_id = userId;

    // Önce maç sonucunu ekle
    const { data: matchData, error: matchError } = await supabase
      .from('user_match_history')
      .insert(matchResult)
      .select()
      .single();

    if (matchError) {
      console.error('Maç sonucu ekleme hatası:', matchError);
      return { data: null, error: matchError };
    }

    // Kullanıcı istatistiklerini al
    const { data: statsData, error: statsError } = await getUserStatistics(userId);
    if (statsError) {
      console.error('Kullanıcı istatistikleri alınamadı:', statsError);
      return { data: matchData, error: statsError };
    }

    // İstatistikleri güncelle
    const statsUpdate: Partial<UserStatistics> = {
      matches_played: (statsData?.matches_played || 0) + 1,
      goals_scored: (statsData?.goals_scored || 0) + (matchResult.goals_scored || 0),
      goals_conceded: (statsData?.goals_conceded || 0) + (matchResult.goals_conceded || 0),
      assists: (statsData?.assists || 0) + (matchResult.assists || 0),
      yellow_cards: (statsData?.yellow_cards || 0) + (matchResult.yellow_cards || 0),
      red_cards: (statsData?.red_cards || 0) + (matchResult.red_cards || 0),
    };

    // Maç sonucuna göre galibiyet, mağlubiyet veya beraberlik sayısını güncelle
    if (matchResult.result === 'win') {
      statsUpdate.matches_won = (statsData?.matches_won || 0) + 1;
    } else if (matchResult.result === 'loss') {
      statsUpdate.matches_lost = (statsData?.matches_lost || 0) + 1;
    } else {
      statsUpdate.matches_drawn = (statsData?.matches_drawn || 0) + 1;
    }

    // İstatistikleri güncelle
    const { error: updateStatsError } = await updateUserStatistics(statsUpdate, userId);
    if (updateStatsError) {
      console.error('İstatistik güncelleme hatası:', updateStatsError);
      // Hatayı döndürmüyoruz, çünkü maç verisi başarıyla eklendi
    }

    // Genel bakış verilerini güncelle
    const overviewUpdate: Partial<UserOverview> = {
      last_match_date: matchResult.match_date,
      last_match_opponent: matchResult.opponent,
      last_match_result: matchResult.result,
      matches_played: (statsData?.matches_played || 0) + 1,
      matches_won: statsUpdate.matches_won,
      matches_lost: statsUpdate.matches_lost,
      goals_scored: statsUpdate.goals_scored,
    };

    // Eğer oyuncu çok iyi performans gösterdiyse kazanıma ekleyelim (örnek)
    if (matchResult.goals_scored >= 3) {
      const achievement = {
        player_id: userId,
        achievement_name: 'Hat-trick',
        achievement_date: matchResult.match_date,
        type: 'special' as const,
        description: 'Bir maçta 3 veya daha fazla gol atma!'
      };

      await supabase.from('achievements').insert(achievement);
    }

    // Genel bakışı güncelle
    const { error: updateOverviewError } = await updateUserOverview(overviewUpdate, userId);
    if (updateOverviewError) {
      console.error('Genel bakış güncelleme hatası:', updateOverviewError);
      // Hatayı döndürmüyoruz, çünkü maç verisi başarıyla eklendi
    }

    return { data: matchData, error: null };
  } catch (err) {
    console.error('Maç sonucu ekleme hatası:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Beklenmeyen bir hata oluştu') 
    };
  }
}; 