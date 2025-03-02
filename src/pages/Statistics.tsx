import UserLayout from "@/components/ui/user-layout";
import PhysicalStats from "@/components/statistics/PhysicalStats";
import TechnicalStats from "@/components/statistics/TechnicalStats";
import StatisticsCharts from "@/components/statistics/StatisticsCharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getUserStatistics, UserStatistics } from "@/services/statistics.service";
import { useEffect, useState } from "react";

const Statistics = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);

  // Verileri yükleme
  useEffect(() => {
    const loadStatistics = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getUserStatistics();
        
        if (error) {
          console.error("İstatistik yükleme hatası:", error);
          toast({
            variant: "destructive",
            title: "Hata",
            description: "İstatistikler yüklenirken bir hata oluştu."
          });
        } else if (data) {
          setUserStats(data);
        }
      } catch (err) {
        console.error("İstatistik yükleme hatası:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, [toast]);

  // Örnek fiziksel istatistikler (gerçek verilerle değiştirilecek)
  const physicalStats = {
    distance: `${userStats?.shots || 0}km`,
    sprint: userStats?.matches_played.toString() || "0",
    avgSprint: `${userStats?.pass_accuracy || 0}km/h`,
    maxSprint: `${userStats?.tackles_won || 0}km/h`,
    activityTime: `${userStats?.matches_played * 90 || 0}min`
  };

  // Teknik istatistikler
  const technicalStats = {
    shots: userStats?.shots.toString() || "0",
    avgShotSpeed: `${Math.round((userStats?.shots_on_target || 0) / (userStats?.shots || 1) * 100)}%`,
    maxShotSpeed: `${userStats?.goals_scored || 0}`,
    passes: userStats?.pass_accuracy.toString() + "%" || "0%", 
    possession: `${userStats?.possession_avg || 0}%`
  };

  // Sprint verileri dinamik olarak oluşturulabilir
  const sprintData = [
    { time: "10'", speed: Math.round(Math.random() * 10) + 15 },
    { time: "20'", speed: Math.round(Math.random() * 10) + 18 },
    { time: "30'", speed: Math.round(Math.random() * 10) + 20 },
    { time: "40'", speed: Math.round(Math.random() * 10) + 15 },
    { time: "50'", speed: Math.round(Math.random() * 10) + 22 },
    { time: "60'", speed: Math.round(Math.random() * 10) + 18 },
    { time: "70'", speed: Math.round(Math.random() * 10) + 20 },
    { time: "80'", speed: Math.round(Math.random() * 10) + 15 },
  ];

  // Şut dağılımı
  const shotData = [
    { type: "Sol Ayak", count: Math.ceil((userStats?.shots || 0) * 0.4) },
    { type: "Sağ Ayak", count: Math.ceil((userStats?.shots || 0) * 0.5) },
    { type: "Kafa", count: Math.ceil((userStats?.shots || 0) * 0.1) },
  ];

  // Yükleme durumunda iskelet göster
  if (isLoading) {
    return (
      <UserLayout>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {userStats ? (
          <>
            {/* Özet İstatistikler */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-gray-300">Maçlar</h3>
                <p className="text-2xl font-bold text-white">{userStats.matches_played}</p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-gray-300">Goller</h3>
                <p className="text-2xl font-bold text-white">{userStats.goals_scored}</p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-gray-300">Galibiyet</h3>
                <p className="text-2xl font-bold text-white">{userStats.matches_won}</p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-gray-300">Mağlubiyet</h3>
                <p className="text-2xl font-bold text-white">{userStats.matches_lost}</p>
              </div>
            </div>

            <PhysicalStats stats={physicalStats} />
            <TechnicalStats stats={technicalStats} />
            <StatisticsCharts sprintData={sprintData} shotData={shotData} />
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Henüz İstatistik Bulunmuyor</h2>
            <p className="text-gray-400 mb-6">Maç oynadıkça istatistikleriniz burada görünecek.</p>
            <Button>Maçlara Göz At</Button>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Statistics;
