import UserLayout from "@/components/ui/user-layout";
import PhysicalStats from "@/components/statistics/PhysicalStats";
import TechnicalStats from "@/components/statistics/TechnicalStats";
import StatisticsCharts from "@/components/statistics/StatisticsCharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getUserStatistics, UserStatistics } from "@/services/statistics.service";
import { useEffect, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

const Statistics = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);

  // Verileri yükleme
  useEffect(() => {
    const loadStatistics = async () => {
      setIsLoading(true);
      try {
        console.log("İstatistik verileri getiriliyor...");
        const { data, error } = await getUserStatistics();
        
        if (error) {
          console.error("İstatistik yükleme hatası:", error);
          toast({
            variant: "destructive",
            title: "Hata",
            description: "İstatistikler yüklenirken bir hata oluştu."
          });
        } else if (data) {
          console.log("Alınan istatistik verileri:", data);
          setUserStats(data);
        } else {
          console.warn("İstatistik verisi bulunamadı veya boş döndü");
          toast({
            variant: "warning",
            title: "Uyarı",
            description: "İstatistik verisi bulunamadı."
          });
        }
      } catch (err) {
        console.error("İstatistik yükleme hatası (Exception):", err);
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Veriler yüklenirken beklenmeyen bir hata oluştu."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, [toast]);

  // Örnek fiziksel istatistikler (gerçek verilerle değiştirilecek)
  const physicalStats = {
    distance: `${userStats?.shots || 0}km`,
    sprint: userStats?.matches_played ? userStats.matches_played.toString() : "0",
    avgSprint: `${userStats?.pass_accuracy || 0}km/h`,
    maxSprint: `${userStats?.tackles_won || 0}km/h`,
    activityTime: `${userStats?.matches_played ? userStats.matches_played * 90 : 0}min`
  };

  // Teknik istatistikler
  const technicalStats = {
    shots: userStats?.shots ? userStats.shots.toString() : "0",
    avgShotSpeed: `${Math.round(((userStats?.shots_on_target || 0) / (userStats?.shots || 1)) * 100)}%`,
    maxShotSpeed: `${userStats?.goals_scored || 0}`,
    passes: userStats?.pass_accuracy ? userStats.pass_accuracy.toString() + "%" : "0%", 
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
            {/* Özet İstatistikler bölümü kaldırıldı */}
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

const StatisticsPage = () => {
  return (
    <ErrorBoundary>
      <Statistics />
    </ErrorBoundary>
  );
};

export default StatisticsPage;
