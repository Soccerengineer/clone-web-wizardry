
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import UserLayout from "@/components/ui/user-layout";
import { Star, Trophy, Medal, Target } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

const Statistics = () => {
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

  const performanceData = stats?.map(stat => ({
    date: new Date(stat.matches.match_date).toLocaleDateString('tr-TR'),
    condition: stat.condition_rating,
    technical: stat.technical_rating,
    position: stat.position_rating
  })) || [];

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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Teknik</h3>
                <p className="text-2xl font-bold text-white">{averages?.technical || 0}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 opacity-50">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Medal className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Pozisyon (Beta)</h3>
                <p className="text-2xl font-bold text-white">{averages?.position || 0}%</p>
                <span className="text-xs text-gray-500">Yakında</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Performans Gelişimi</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff40"
                  tick={{ fill: '#ffffff80' }}
                />
                <YAxis 
                  stroke="#ffffff40"
                  tick={{ fill: '#ffffff80' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a2332',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  name="Kondisyon"
                  dataKey="condition"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  name="Teknik"
                  dataKey="technical"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  name="Pozisyon"
                  dataKey="position"
                  stroke="#6B7280"
                  strokeWidth={2}
                  dot={{ fill: '#6B7280', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
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

export default Statistics;
