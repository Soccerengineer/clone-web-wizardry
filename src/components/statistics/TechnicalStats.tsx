
import { Card } from "@/components/ui/card";
import { Target, Share, Activity } from "lucide-react";

interface TechnicalStatsProps {
  stats: {
    shots: string;
    avgShotSpeed: string;
    maxShotSpeed: string;
    passes: string;
    possession: string;
  };
}

const TechnicalStats = ({ stats }: TechnicalStatsProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Teknik İstatistikler</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Şutlar</h3>
            <p className="text-2xl font-bold text-white">{stats.shots}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Ortalama Şut Hızı</h3>
            <p className="text-2xl font-bold text-white">{stats.avgShotSpeed}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Maksimum Şut Hızı</h3>
            <p className="text-2xl font-bold text-white">{stats.maxShotSpeed}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Share className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Paslar</h3>
            <p className="text-2xl font-bold text-white">{stats.passes}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Top Hakimiyeti</h3>
            <p className="text-2xl font-bold text-white">{stats.possession}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalStats;
