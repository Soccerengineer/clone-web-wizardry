
import { Card } from "@/components/ui/card";
import UserLayout from "@/components/ui/user-layout";
import {
  Activity,
  Zap,
  Timer,
  Target,
  Share,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const Statistics = () => {
  // Sample data for physical statistics
  const physicalStats = {
    distance: "8.5km",
    sprint: "32",
    avgSprint: "24km/h",
    maxSprint: "32km/h",
    activityTime: "85min"
  };

  // Sample data for technical statistics
  const technicalStats = {
    shots: "15",
    avgShotSpeed: "85km/h",
    maxShotSpeed: "105km/h",
    passes: "45",
    possession: "65%"
  };

  // Sample data for sprint speed over time
  const sprintData = [
    { time: "10'", speed: 18 },
    { time: "20'", speed: 24 },
    { time: "30'", speed: 28 },
    { time: "40'", speed: 22 },
    { time: "50'", speed: 26 },
    { time: "60'", speed: 20 },
    { time: "70'", speed: 25 },
    { time: "80'", speed: 19 },
  ];

  // Sample data for shot distribution
  const shotData = [
    { type: "Sol Ayak", count: 8 },
    { type: "Sağ Ayak", count: 5 },
    { type: "Kafa", count: 2 },
  ];

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Physical Statistics */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Fiziksel İstatistikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Activity className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Mesafe</h3>
                <p className="text-2xl font-bold text-white">{physicalStats.distance}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Sprint</h3>
                <p className="text-2xl font-bold text-white">{physicalStats.sprint}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Ortalama Sprint</h3>
                <p className="text-2xl font-bold text-white">{physicalStats.avgSprint}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Maksimum Sprint</h3>
                <p className="text-2xl font-bold text-white">{physicalStats.maxSprint}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Timer className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Aktivite Süresi</h3>
                <p className="text-2xl font-bold text-white">{physicalStats.activityTime}</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Technical Statistics */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Teknik İstatistikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Target className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Şutlar</h3>
                <p className="text-2xl font-bold text-white">{technicalStats.shots}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Target className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Ortalama Şut Hızı</h3>
                <p className="text-2xl font-bold text-white">{technicalStats.avgShotSpeed}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Target className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Maksimum Şut Hızı</h3>
                <p className="text-2xl font-bold text-white">{technicalStats.maxShotSpeed}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Share className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Paslar</h3>
                <p className="text-2xl font-bold text-white">{technicalStats.passes}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col items-center gap-2">
                <Activity className="w-8 h-8 text-primary" />
                <h3 className="text-sm text-gray-400">Top Hakimiyeti</h3>
                <p className="text-2xl font-bold text-white">{technicalStats.possession}</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sprint Speed Chart */}
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Sprint Hızı Değişimi</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sprintData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#ffffff40" />
                  <YAxis stroke="#ffffff40" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a2332',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Shot Distribution Chart */}
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Şut Dağılımı</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shotData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="type" stroke="#ffffff40" />
                  <YAxis stroke="#ffffff40" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a2332',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
};

export default Statistics;
