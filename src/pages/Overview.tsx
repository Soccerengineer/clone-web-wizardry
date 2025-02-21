
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import UserLayout from "@/components/ui/user-layout";
import { Star, Trophy, Medal, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PlayerStats {
  condition_rating: number;
  technical_rating: number;
  position_rating: number;
  position: string;
  match_date: string;
}

interface Achievement {
  type: string;
  title: string;
  awarded_at: string;
}

const Overview = () => {
  const { data: stats } = useQuery({
    queryKey: ['player-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select(`
          condition_rating,
          technical_rating,
          position_rating,
          position,
          matches(match_date)
        `)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data;
    }
  });

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('awarded_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Calculate averages
  const averages = stats?.reduce(
    (acc, stat) => {
      acc.condition += stat.condition_rating || 0;
      acc.technical += stat.technical_rating || 0;
      acc.position += stat.position_rating || 0;
      return acc;
    },
    { condition: 0, technical: 0, position: 0 }
  );

  if (averages) {
    const total = stats?.length || 1;
    averages.condition = Math.round(averages.condition / total);
    averages.technical = Math.round(averages.technical / total);
    averages.position = Math.round(averages.position / total);
  }

  // Calculate statistics from Statistics page
  const totalMatches = stats?.length || 0;
  const mvpCount = stats?.filter(stat => stat.mvp).length || 0;
  const medals = achievements?.length || 0;

  // Calculate position statistics
  const positionStats = stats?.reduce((acc, stat) => {
    if (stat.position) {
      acc[stat.position] = (acc[stat.position] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Find most played positions
  const sortedPositions = Object.entries(positionStats || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  // Sample data for win/loss rate chart
  const winLossData = [
    { name: 'Kazanılan', value: 65 },
    { name: 'Kaybedilen', value: 35 },
  ];

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <img
            src="/lovable-uploads/31dd6418-1a95-4b8e-8af1-81058a36855d.png"
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-primary"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Süper Oyuncu</h1>
            <div className="text-lg text-gray-300">Ali Nazik</div>
            <div className="flex items-center gap-1 text-primary mt-1">
              <span>3.7</span>
              <div className="flex">
                {[1, 2, 3].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-primary" />
                ))}
                <Star className="w-4 h-4 fill-primary/50" />
                <Star className="w-4 h-4 fill-transparent stroke-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Combined Stats Overview */}
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
              <div className="p-4 rounded-full bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Kondisyon</h3>
                <p className="text-2xl font-bold text-white">{averages?.condition || 0}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Position Stats and Win/Loss Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Pozisyon İstatistikleri</h3>
            <div className="space-y-4">
              {sortedPositions.map(([position, count], index) => (
                <div key={position} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {index === 0 ? "En çok" : "İkinci en çok"}
                    </span>
                    <span className="text-white">{position}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(count / totalMatches) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Kazanma/Kaybetme Oranı</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={winLossData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#ffffff40" />
                  <YAxis stroke="#ffffff40" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a2332',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Experience and Level */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Seviye İlerlemesi</h3>
            <span className="text-2xl font-bold text-primary">Lvl 7</span>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Deneyim</span>
                <span className="text-white">750/1000 XP</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Başarılar</h3>
          <div className="space-y-4">
            {achievements?.map((achievement, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                <div className="p-3 rounded-full bg-primary/10">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{achievement.title}</h4>
                  <p className="text-sm text-gray-400">
                    {new Date(achievement.awarded_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </UserLayout>
  );
};

export default Overview;
