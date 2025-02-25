/**
 * Turnuva durumlarını tanımlayan enum
 */
export enum TournamentStatus {
  UPCOMING = 'upcoming',
  REGISTRATION = 'registration',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Turnuva türlerini tanımlayan enum
 */
export enum TournamentType {
  KNOCKOUT = 'knockout',
  LEAGUE = 'league',
  GROUP_STAGE = 'group_stage',
}

/**
 * Turnuva bilgilerini temsil eden model
 */
export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: TournamentType;
  status: TournamentStatus;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  max_participants?: number;
  prize_pool?: string;
  rules?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Turnuva katılımcısını temsil eden model
 */
export interface TournamentParticipant {
  tournament_id: string;
  player_id: string;
  registration_date: string;
  status: 'registered' | 'confirmed' | 'withdrawn';
  seed?: number;
  group?: string;
}

/**
 * Turnuva maçını temsil eden model
 */
export interface TournamentMatch {
  id: string;
  tournament_id: string;
  round: number;
  match_index: number;
  player1_id?: string;
  player2_id?: string;
  winner_id?: string;
  next_match_id?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  start_time?: string;
  score_player1?: number;
  score_player2?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Turnuva grubu temsil eden model (grup aşamalı turnuvalar için)
 */
export interface TournamentGroup {
  id: string;
  tournament_id: string;
  name: string;
  players: string[]; // player_id listesi
}

/**
 * Grup aşaması puan tablosu satırını temsil eden model
 */
export interface GroupStandingRow {
  tournament_id: string;
  group_id: string;
  player_id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
}

/**
 * Turnuva arama/filtreleme seçenekleri
 */
export interface TournamentFilters {
  status?: TournamentStatus;
  type?: TournamentType;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  sortBy?: 'date' | 'name' | 'participants';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
} 