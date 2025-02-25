import { Trophy, Users, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatisticCardsProps {
  totalMatches: number;
  mvpCount: number;
  medals: number;
  favoriteVenue: string;
  isLoading?: boolean;
}

const StatisticCards = ({ 
  totalMatches, 
  mvpCount, 
  medals, 
  favoriteVenue,
  isLoading = false 
}: StatisticCardsProps) => {
  // Yükleme durumu için azaltılmış opasite
  const opacityClass = isLoading ? 'opacity-70' : '';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${opacityClass}`}>
      <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-primary/20 mr-4">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Toplam Maç</p>
            <p className="text-2xl font-semibold text-white">{totalMatches}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-primary/20 mr-4">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-400">MVP Ödülü</p>
            <p className="text-2xl font-semibold text-white">{mvpCount}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-primary/20 mr-4">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Toplam Madalya</p>
            <p className="text-2xl font-semibold text-white">{medals}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-primary/20 mr-4">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Favori Mekan</p>
            <p className="text-2xl font-semibold text-white" title={favoriteVenue}>
              {favoriteVenue.length > 15 ? `${favoriteVenue.substring(0, 15)}...` : favoriteVenue}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatisticCards;
