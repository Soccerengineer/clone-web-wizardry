
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import UserLayout from "@/components/ui/user-layout";
import { Trophy, Medal, Target } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Statistics = () => {
  const { data: stats } = useQuery({
    queryKey: ['player-stats-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select(`
          id,
          position,
          mvp,
          matches(
            id,
            match_date,
            venues(
              name
            )
          )
        `);

      if (error) throw error;
      return data;
    }
  });

  const { data: achievements } = useQuery({
    queryKey: ['player-achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('type', 'medal');

      if (error) throw error;
      return data;
    }
  });

  // Calculate statistics
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

  // Find favorite venue
  const venueStats = stats?.reduce((acc, stat) => {
    const venueName = stat.matches?.venues?.name;
    if (venueName) {
      acc[venueName] = (acc[venueName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const favoriteVenue = Object.entries(venueStats || {})
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  // Sample data for win/loss rate chart
  const winLossData = [
    { name: 'Kazanılan', value: 65 },
    { name: 'Kaybedilen', value: 35 },
  ];

  // Sample data for experience progress
  const expData = [
    { name: 'Deneyim', current: 750, total: 1000 }
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div>
              <h3 className="text-sm text-gray-400">Favori Tesis</h3>
              <p className="text-xl font-bold text-white mt-2">{favoriteVenue || "Henüz yok"}</p>
            </div>
          </Card>
        </div>

        {/* Position Stats */}
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
      </div>
    </UserLayout>
  );
};

export default Statistics;
