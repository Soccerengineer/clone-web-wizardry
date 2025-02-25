/**
 * Oyuncu bilgilerini temsil eden model
 */
export interface Player {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Oyuncu istatistiklerini temsil eden model
 */
export interface PlayerStatistics {
  id: string;
  player_id: string;
  match_id?: string;
  condition_rating: number;
  technical_rating: number;
  position_rating: number;
  position: string;
  venue?: string;
  result?: 'win' | 'loss' | 'draw';
  created_at: string;
}

/**
 * Oyuncu başarılarını temsil eden model
 */
export interface PlayerAchievement {
  id: string;
  player_id: string;
  type: string;
  title: string;
  description: string;
  icon_url?: string;
  awarded_at: string;
}

/**
 * Oyuncu sıralama bilgilerini temsil eden model
 */
export interface PlayerRanking {
  id: string;
  player_id: string;
  rank: number;
  points: number;
  prev_rank?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Oyuncu profil sayfası için kullanılacak veri modeli
 */
export interface PlayerProfile {
  player: Player;
  statistics: PlayerStatistics[];
  achievements: PlayerAchievement[];
  ranking?: PlayerRanking;
}

/**
 * Oyuncu için filtreleme seçenekleri
 */
export interface PlayerFilters {
  username?: string;
  position?: string;
  minRating?: number;
  maxRating?: number;
  sortBy?: 'rank' | 'rating' | 'matches' | 'achievements';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
} 