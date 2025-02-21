
import { Card } from "@/components/ui/card";
import { Activity, Zap, Timer } from "lucide-react";

interface PhysicalStatsProps {
  stats: {
    distance: string;
    sprint: string;
    avgSprint: string;
    maxSprint: string;
    activityTime: string;
  };
}

const PhysicalStats = ({ stats }: PhysicalStatsProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Fiziksel İstatistikler</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Mesafe</h3>
            <p className="text-2xl font-bold text-white">{stats.distance}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Sprint</h3>
            <p className="text-2xl font-bold text-white">{stats.sprint}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Ortalama Sprint</h3>
            <p className="text-2xl font-bold text-white">{stats.avgSprint}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Maksimum Sprint</h3>
            <p className="text-2xl font-bold text-white">{stats.maxSprint}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Timer className="w-8 h-8 text-primary" />
            <h3 className="text-sm text-gray-400">Aktivite Süresi</h3>
            <p className="text-2xl font-bold text-white">{stats.activityTime}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PhysicalStats;
