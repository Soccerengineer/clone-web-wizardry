/**
 * Maç durumlarını tanımlayan enum
 */
export enum MatchStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
}

/**
 * Maç bilgilerini temsil eden model
 */
export interface Match {
  id: string;
  player1_id: string;
  player2_id: string;
  venue_id?: string;
  status: MatchStatus;
  start_time: string;
  end_time?: string;
  score_player1?: number;
  score_player2?: number;
  tournament_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Maç sonuç detaylarını temsil eden model
 */
export interface MatchResult {
  match_id: string;
  winner_id?: string;
  player1_stats: {
    score: number;
    technical_rating: number;
    condition_rating: number;
    position_rating: number;
  };
  player2_stats: {
    score: number;
    technical_rating: number;
    condition_rating: number;
    position_rating: number;
  };
  highlights?: MatchHighlight[];
  created_at: string;
}

/**
 * Maç önemli anlarını temsil eden model
 */
export interface MatchHighlight {
  id: string;
  match_id: string;
  player_id: string;
  type: 'goal' | 'assist' | 'save' | 'foul' | 'card' | 'other';
  minute: number;
  description: string;
  video_url?: string;
  created_at: string;
}

/**
 * Maç mekan bilgilerini temsil eden model
 */
export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Maç arama/filtreleme seçenekleri
 */
export interface MatchFilters {
  playerId?: string;
  venueId?: string;
  status?: MatchStatus;
  tournamentId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'date' | 'score';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
} 