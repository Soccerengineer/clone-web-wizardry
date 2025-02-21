
import { Card } from "@/components/ui/card";
import { Target, Trophy, Medal } from "lucide-react";

interface StatisticCardsProps {
  totalMatches: number;
  mvpCount: number;
  medals: number;
  favoriteVenue: string;
}

const StatisticCards = ({ totalMatches, mvpCount, medals, favoriteVenue }: StatisticCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Toplam Maç</h3>
            <p className="text-2xl font-bold text-white">{totalMatches}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm text-gray-400">MVP</h3>
            <p className="text-2xl font-bold text-white">{mvpCount}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Medal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Madalya</h3>
            <p className="text-2xl font-bold text-white">{medals}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Favori Tesis</h3>
            <p className="text-lg font-bold text-white">{favoriteVenue}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatisticCards;
