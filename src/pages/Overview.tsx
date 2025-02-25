import UserLayout from "@/components/ui/user-layout";
import UserProfile from "@/components/overview/UserProfile";
import StatisticCards from "@/components/overview/StatisticCards";
import PerformanceCharts from "@/components/overview/PerformanceCharts";
import ExperienceLevel from "@/components/overview/ExperienceLevel";
import { usePlayerStats } from "@/controllers/usePlayerStats";
import { useAuth } from "@/controllers/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Overview = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // Auth controller'dan kullanıcı bilgisini al
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Controller'dan veri ve durum bilgilerini al
  const { 
    playerStats, 
    playerAchievements,
    playerProfile,
    isLoading: isStatsLoading, 
    error 
  } = usePlayerStats();

  // Kullanıcı bilgilerinin yüklenmesi için 3 saniyelik bir zaman aşımı ekleyin
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Genel yükleme durumu
  const isLoading = isAuthLoading || isStatsLoading || isPageLoading;

  // Veri durumunu kontrol et
  const hasRealData = !!(playerStats && playerStats.length > 0);

  // Mock veri oluştur - gerçek veriler yoksa bunları kullan
  const mockPlayerStats = playerStats || [
    {
      id: "1",
      player_id: user?.id || "guest",
      matches_played: 12,
      goals: 5,
      assists: 3,
      xg: 4.2,
      created_at: new Date().toISOString(),
      technical_rating: 3.8,
      position_rating: 3.5,
      condition_rating: 4.0,
      venue: "Fenerbahçe Spor Kulübü"
    }
  ];
  
  const mockAchievements = playerAchievements || [
    {
      id: "1",
      player_id: user?.id || "guest",
      achievement_name: "Örnek Başarı",
      achievement_date: new Date().toISOString(),
      type: "regular"
    },
    {
      id: "2",
      player_id: user?.id || "guest",
      achievement_name: "Örnek MVP",
      achievement_date: new Date().toISOString(),
      type: "mvp"
    }
  ];
  
  const mockProfile = playerProfile || {
    player: {
      id: user?.id || "guest",
      name: user?.email?.split('@')[0] || "Misafir Oyuncu",
      avatar_url: null,
      position: "Forvet",
      xp_level: 2
    }
  };

  // İstatistik hesaplamaları
  const totalMatches = mockPlayerStats?.length || 0;
  const mvpCount = mockAchievements?.filter(a => a.type === 'mvp').length || 0;
  const medals = mockAchievements?.length || 0;
  const favoriteVenue = mockPlayerStats?.[0]?.venue || "Fenerbahçe Spor Kulübü";
  
  // Oyuncu derecelendirmesini hesapla
  const calculateRating = () => {
    if (!mockPlayerStats || mockPlayerStats.length === 0) return 3.7;
    
    const sum = mockPlayerStats.reduce((total, stat) => {
      return total + ((stat.technical_rating || 3.5) + (stat.position_rating || 3.5) + (stat.condition_rating || 3.5)) / 3;
    }, 0);
    
    return sum / mockPlayerStats.length;
  };
  
  const playerRating = calculateRating();

  // Hata durumunda
  if (error && !isLoading) {
    return (
      <UserLayout>
        <div className="text-center py-8">
          <div className="text-red-500 text-lg">
            {error instanceof Error ? error.message : "Veriler yüklenirken bir hata oluştu"}
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Yeniden Dene
          </Button>
        </div>
      </UserLayout>
    );
  }

  // Yükleme durumunda
  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Verileriniz yükleniyor...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {!hasRealData && (
          <Alert variant="warning" className="bg-amber-900/20 border-amber-700 mb-4">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <AlertTitle className="text-amber-400">Bilgilendirme</AlertTitle>
            <AlertDescription className="text-amber-300">
              Şu anda demo verileri görüntülüyorsunuz. Gerçek verileriniz Supabase veritabanı bağlantısı kurulduktan sonra görüntülenecektir.
            </AlertDescription>
          </Alert>
        )}
        
        <UserProfile 
          user={user} 
          player={mockProfile?.player}
          rating={playerRating}
          isLoading={false}
        />
        
        <StatisticCards
          totalMatches={totalMatches}
          mvpCount={mvpCount}
          medals={medals}
          favoriteVenue={favoriteVenue}
          isLoading={false}
        />

        <PerformanceCharts performanceData={mockPlayerStats} />
        
        <ExperienceLevel 
          achievements={mockAchievements}
          isLoading={false}
        />
      </div>
    </UserLayout>
  );
};

export default Overview;
