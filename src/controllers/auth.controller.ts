import { useState, useEffect } from "react";
import { authService } from "@/services/supabase.service";
import { playerService } from "@/services/supabase.service";
import { checkSupabaseConnection } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionOk, setConnectionOk] = useState<boolean | null>(null);

  // Supabase bağlantı durumunu kontrol et
  const checkConnection = async () => {
    const result = await checkSupabaseConnection();
    setConnectionOk(result.ok);
    if (!result.ok) {
      setError(`Supabase bağlantı hatası: ${result.error}`);
      console.error("Supabase bağlantı hatası:", result.error);
    }
    return result.ok;
  };

  useEffect(() => {
    // İlk yükleme sırasında bağlantıyı kontrol et
    checkConnection();

    const getCurrentUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await authService.getCurrentUser();
        
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        
        if (data?.user) {
          setUser(data.user);
          
          // Get user profile
          const { data: profileData, error: profileError } = 
            await playerService.getPlayerProfile(data.user.id);
            
          if (profileError) {
            setError(profileError.message);
          } else if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        console.error("Kullanıcı bilgileri alınırken hata oluştu:", err);
        setError(err instanceof Error ? err.message : "Bilinmeyen hata");
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      if (data?.user) {
        setUser(data.user);
        
        // Get user profile
        const { data: profileData, error: profileError } = 
          await playerService.getPlayerProfile(data.user.id);
          
        if (profileError) {
          setError(profileError.message);
        } else if (profileData) {
          setProfile(profileData);
        }
      }
      
      return { success: true };
    } catch (err) {
      console.error("Giriş sırasında hata oluştu:", err);
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signUp(email, password);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (err) {
      console.error("Kayıt sırasında hata oluştu:", err);
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await authService.signOut();
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      setUser(null);
      setProfile(null);
      return { success: true };
    } catch (err) {
      console.error("Çıkış sırasında hata oluştu:", err);
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    connectionOk,
    signIn,
    signUp,
    signOut,
    checkConnection
  };
}; 