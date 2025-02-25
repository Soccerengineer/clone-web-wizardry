import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/supabase.service';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mevcut kullanıcıyı getir
  const { data: currentUser, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data, error } = await authService.getCurrentUser();
        if (error) throw error;
        return data.user;
      } catch (error: any) {
        return null;
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Giriş yapma mutasyonu
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await authService.signIn(email, password);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Başarılı',
        description: 'Giriş yapıldı!',
        variant: 'success',
      });
      refetchUser();
      queryClient.invalidateQueries({queryKey: ['currentUser']});
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Giriş yapılırken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  // Kayıt olma mutasyonu
  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await authService.signUp(email, password);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Başarılı',
        description: 'Kayıt işlemi tamamlandı! E-posta adresinizi doğrulayın.',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Kayıt olurken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  // Çıkış yapma mutasyonu
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authService.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: 'Başarılı',
        description: 'Başarıyla çıkış yapıldı!',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Çıkış yapılırken bir hata oluştu',
        variant: 'destructive',
      });
    }
  });

  // Şifre sıfırlama mutasyonu
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await authService.resetPassword(email);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Başarılı',
        description: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Şifre sıfırlama işlemi başarısız oldu',
        variant: 'destructive',
      });
    }
  });

  return {
    user: currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    refetchUser
  };
}; 