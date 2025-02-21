
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import UserLayout from "@/components/ui/user-layout";
import UserProfile from "@/components/overview/UserProfile";
import StatisticCards from "@/components/overview/StatisticCards";
import PerformanceCharts from "@/components/overview/PerformanceCharts";
import ExperienceLevel from "@/components/overview/ExperienceLevel";

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

  // Calculate statistics
  const totalMatches = stats?.length || 0;
  const mvpCount = achievements?.filter(a => a.type === 'mvp').length || 0;
  const medals = achievements?.length || 0;
  const favoriteVenue = "Fenerbahçe Spor Kulübü";

  return (
    <UserLayout>
      <div className="space-y-8">
        <UserProfile />
        
        <StatisticCards
          totalMatches={totalMatches}
          mvpCount={mvpCount}
          medals={medals}
          favoriteVenue={favoriteVenue}
        />

        <PerformanceCharts />
        
        <ExperienceLevel />
      </div>
    </UserLayout>
  );
};

export default Overview;
