import { Star } from "lucide-react";
import { User } from "@/models/auth.model";
import { Player } from "@/models/player.model";
import { formatDate } from "@/utils/formatters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileProps {
  user?: User | null;
  player?: Player | null;
  rating?: number;
  isLoading?: boolean;
}

const UserProfile = ({ user, player, rating = 3.7, isLoading = false }: UserProfileProps) => {
  // Kullanıcı adını belirle
  const displayName = player?.display_name || user?.user_metadata?.full_name || 'Süper Oyuncu';
  const avatarUrl = player?.avatar_url || user?.user_metadata?.avatar_url || '/placeholder.svg';
  
  // Hesap oluşturma tarihini formatla (varsa)
  const creationDate = user?.created_at 
    ? `Üyelik: ${formatDate(user.created_at, { year: 'numeric', month: 'long' })}`
    : '';

  // Yükleniyor durumu için azaltılmış opasite
  const opacityClass = isLoading ? 'opacity-70' : '';

  return (
    <div className={`flex items-center justify-center gap-4 max-w-2xl mx-auto ${opacityClass}`}>
      <Avatar className="w-24 h-24 border-4 border-primary">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
          {displayName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div>
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
  );
};

export default UserProfile;

