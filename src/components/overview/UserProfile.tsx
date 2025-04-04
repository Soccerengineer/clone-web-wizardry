import { Star } from "lucide-react";
import { User } from "@/models/auth.model";
import { Player } from "@/models/player.model";
import { formatDate } from "@/utils/formatters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileProps {
  user?: User | null;
  player?: Player | null;
  rating?: number;
  isLoading?: boolean;
}

const UserProfile = ({ user, player, rating = 3.7, isLoading = false }: UserProfileProps) => {
  const [displayName, setDisplayName] = useState<string>('Süper Oyuncu');
  const [avatarUrl, setAvatarUrl] = useState<string>('/placeholder.svg');
  
  // Kullanıcı bilgilerini dinamik olarak güncelle
  useEffect(() => {
    const loadUserProfile = async () => {
      // Başlangıç değerleri - geçici olarak prop'lardan gelen verileri kullan
      let tempName = 
        player?.display_name || 
        user?.user_metadata?.display_name || 
        'Süper Oyuncu';
      
      let tempAvatarUrl = player?.avatar_url || user?.user_metadata?.avatar_url || '/placeholder.svg';
      
      // Eğer user prop'u varsa, en güncel verileri almaya çalış
      if (user?.id) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (profile?.display_name) {
            tempName = profile.display_name;
          }
          
          if (profile?.avatar_url) {
            tempAvatarUrl = profile.avatar_url;
          }
        } catch (error) {
          console.error("Kullanıcı profili yüklenirken hata:", error);
        }
      }
      
      setDisplayName(tempName);
      setAvatarUrl(tempAvatarUrl);
    };
    
    loadUserProfile();
    
    // Auth durumu değişikliklerini dinle
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'USER_UPDATED') {
        loadUserProfile();
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [user, player]);
  
  // Hesap oluşturma tarihini formatla (varsa)
  const creationDate = user?.created_at 
    ? `Üyelik: ${formatDate(user.created_at, { year: 'numeric', month: 'long' })}`
    : '';

  // Yükleniyor durumu için azaltılmış opasite
  const opacityClass = isLoading ? 'opacity-70' : '';

  return (
    <div className={`flex items-center justify-center gap-4 max-w-2xl mx-auto ${opacityClass}`}>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border border-white/20">
          <AvatarImage src="/avatar_placeholder.png" alt={displayName} className="object-cover" />
          <AvatarFallback className="bg-white/5">{displayName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          
          <div className="flex items-center gap-1 text-primary mt-1">
            <span>{rating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i <= Math.floor(rating) 
                      ? 'fill-primary' 
                      : i <= rating 
                        ? 'fill-primary/50' 
                        : 'fill-transparent stroke-primary'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {creationDate && (
            <div className="text-sm text-gray-400 mt-1">
              {creationDate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

