import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Kullanıcı işlemleri
export const authService = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },
  
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  }
};

// Oyuncu işlemleri
export const playerService = {
  getPlayerProfile: async (playerId: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', playerId)
      .single();
  },
  
  getPlayerStats: async (playerId: string) => {
    return await supabase
      .from('player_stats')
      .select('*')
      .eq('player_id', playerId);
  },
  
  getPlayerAchievements: async (playerId: string) => {
    return await supabase
      .from('achievements')
      .select('*')
      .eq('player_id', playerId);
  },
  
  updatePlayerProfile: async (playerId: string, data: any) => {
    return await supabase
      .from('profiles')
      .update(data)
      .eq('id', playerId);
  }
};

// Maç işlemleri
export const matchService = {
  getRecentMatches: async (playerId: string, limit: number = 10) => {
    return await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
  },
  
  getMatchDetails: async (matchId: string) => {
    return await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();
  }
};

// Turnuva işlemleri
export const tournamentService = {
  getActiveTournaments: async () => {
    try {
      return await supabase
        .from('tournaments')
        .select('*')
        .eq('status', 'active');
    } catch (error) {
      console.error('Tablo bulunamadı:', error);
      return { data: [], error };
    }
  },
  
  registerForTournament: async (tournamentId: string, playerId: string) => {
    try {
      return await supabase
        .from('tournament_participants')
        .insert([{ tournament_id: tournamentId, player_id: playerId }]);
    } catch (error) {
      console.error('Tablo bulunamadı:', error);
      return { data: null, error };
    }
  }
};

// Sıralama işlemleri
export const rankingService = {
  getGlobalRankings: async (limit: number = 50) => {
    try {
      return await supabase
        .from('player_rankings')
        .select('*')
        .order('rank', { ascending: true })
        .limit(limit);
    } catch (error) {
      console.error('Tablo bulunamadı:', error);
      return { data: [], error };
    }
  },
  
  getPlayerRank: async (playerId: string) => {
    try {
      return await supabase
        .from('player_rankings')
        .select('*')
        .eq('player_id', playerId)
        .single();
    } catch (error) {
      console.error('Tablo bulunamadı:', error);
      return { data: null, error };
    }
  }
};

// Challenge işlemleri
export const challengeService = {
  getActiveChallenges: async (playerId: string) => {
    try {
      return await supabase
        .from('challenges')
        .select('*')
        .or(`challenger_id.eq.${playerId},challenged_id.eq.${playerId}`)
        .eq('status', 'active');
    } catch (error) {
      console.error('Tablo bulunamadı:', error);
      return { data: [], error };
    }
  },
  
  createChallenge: async (challengerId: string, challengedId: string) => {
    try {
      return await supabase
        .from('challenges')
        .insert([{ 
          challenger_id: challengerId, 
          challenged_id: challengedId,
          status: 'pending'
        }]);
    } catch (error) {
      console.error('Tablo bulunamadı:', error);
      return { data: null, error };
    }
  }
}; 