import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playerService } from '@/services/supabase.service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { PlayerProfile } from '@/models/player.model';

export const usePlayerStats = (playerId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Kullanıcı ID'sini al (parametre verilmediyse oturum açmış kullanıcıyı kullan)
  const targetPlayerId = playerId || user?.id;

  // Oyuncu profilini getir
  const { 
    data: playerProfile, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useQuery({
    queryKey: ['playerProfile', targetPlayerId],
    queryFn: async () => {
      if (!targetPlayerId) return null;
      
      const { data, error } = await playerService.getPlayerProfile(targetPlayerId);
      if (error) throw error;
      return data as PlayerProfile;
    },
    enabled: !!targetPlayerId,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  // Oyuncu istatistiklerini getir
  const { 
    data: playerStats, 
    isLoading: isStatsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['playerStats', targetPlayerId],
    queryFn: async () => {
      if (!targetPlayerId) return null;
      
      const { data, error } = await playerService.getPlayerStats(targetPlayerId);
      if (error) throw error;
      return data;
    },
    enabled: !!targetPlayerId,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  // Oyuncu başarılarını getir
  const { 
    data: playerAchievements, 
    isLoading: isAchievementsLoading, 
    error: achievementsError 
  } = useQuery({
    queryKey: ['playerAchievements', targetPlayerId],
    queryFn: async () => {
      if (!targetPlayerId) return null;
      
      const { data, error } = await playerService.getPlayerAchievements(targetPlayerId);
      if (error) throw error;
      return data;
    },
    enabled: !!targetPlayerId,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  // Profil güncelleme mutasyonu
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      if (!targetPlayerId) throw new Error('Kullanıcı ID bulunamadı');
      
      const { data, error } = await playerService.updatePlayerProfile(targetPlayerId, profileData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Profil Güncellendi',
        description: 'Profiliniz başarıyla güncellendi!',
        variant: 'success',
      });
      
      // İlgili verileri yeniden getir
      queryClient.invalidateQueries({ queryKey: ['playerProfile', targetPlayerId] });
      queryClient.invalidateQueries({ queryKey: ['playerStats', targetPlayerId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Profil güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  return {
    playerProfile,
    playerStats,
    playerAchievements,
    isLoading: isProfileLoading || isStatsLoading || isAchievementsLoading,
    error: profileError || statsError || achievementsError,
    updateProfile: updateProfileMutation.mutate
  };
}; 