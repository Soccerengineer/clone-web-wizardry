import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Aktif oturumu kontrol et
    const checkSession = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          setAuthState({
            user: session.user as User,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Oturum kontrolü hatası:', error);
        setAuthState({
          user: null,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    // İlk oturum kontrolü
    checkSession();

    // Auth durumu değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user as User || null,
        isLoading: false,
        error: null,
      });
    });

    // Aboneliği temizle
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Çıkış hatası:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    signOut,
  };
}; 