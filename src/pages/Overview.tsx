import UserLayout from "@/components/ui/user-layout";
import UserProfile from "@/components/overview/UserProfile";
import StatisticCards from "@/components/overview/StatisticCards";
import PerformanceCharts from "@/components/overview/PerformanceCharts";
import ExperienceLevel from "@/components/overview/ExperienceLevel";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { getUserOverview, getUserMatchHistory, UserOverview, UserMatch } from "@/services/statistics.service";
import { supabase } from "@/integrations/supabase/client";

const Overview = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [userOverview, setUserOverview] = useState<UserOverview | null>(null);
  const [matchHistory, setMatchHistory] = useState<UserMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Auth controller'dan kullanıcı bilgisini al
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Kullanıcı oturumunu kontrol et
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Oturum kontrolü hatası:", err);
        setError("Kullanıcı bilgileri alınamadı");
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkSession();
  }, []);

  // Kullanıcı verilerini yükle
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        // Genel bakış verilerini al
        const { data: overviewData, error: overviewError } = await getUserOverview();
        
        if (overviewError) {
          console.error("Genel bakış verisi hatası:", overviewError);
          toast({
            variant: "destructive",
            title: "Hata",
            description: "Genel bakış verileri yüklenirken bir hata oluştu."
          });
          setError(overviewError.message);
        } else if (overviewData) {
          setUserOverview(overviewData);
        }
        
        // Maç geçmişini al
        const { data: matchData, error: matchError } = await getUserMatchHistory();
        
        if (matchError) {
          console.error("Maç geçmişi hatası:", matchError);
        } else if (matchData) {
          setMatchHistory(matchData);
        }
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
        setError("Veriler yüklenirken bir hata oluştu");
      } finally {
        setIsPageLoading(false);
      }
    };

    if (user && !isAuthLoading) {
      loadUserData();
    } else if (!isAuthLoading) {
      setIsPageLoading(false);
    }
  }, [user, isAuthLoading, toast]);

  // Genel yükleme durumu
  const isLoading = isAuthLoading || isPageLoading;

  // Veri durumunu kontrol et
  const hasRealData = !!userOverview;

  // Mock veri oluştur - gerçek veriler yoksa bunları kullan
  const mockPlayerStats = matchHistory.length > 0 
    ? matchHistory.map(match => ({
        id: match.id,
        player_id: user?.id || "guest",
        matches_played: 1,
        goals: match.goals_scored || 0,
        assists: match.assists || 0,
        xg: 1.2,
        created_at: match.match_date,
        technical_rating: match.technical_rating || 3.5,
        position_rating: match.position_rating || 3.5,
        condition_rating: match.physical_rating || 3.5,
        venue: match.venue || "Fenerbahçe Spor Kulübü"
      }))
    : [
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
  
  const mockAchievements = userOverview?.achievements || [
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
  
  const mockProfile = {
    player: {
      id: user?.id || "guest",
      name: user?.email?.split('@')[0] || "Misafir Oyuncu",
      avatar_url: null,
      position: userOverview?.favorite_position || "Forvet",
      xp_level: userOverview?.level || 1
    }
  };

  // İstatistik hesaplamaları
  const totalMatches = userOverview?.matches_played || 0;
  const mvpCount = userOverview?.mvp_count || 0;
  const medals = userOverview?.achievements?.length || 0;
  const favoriteVenue = userOverview?.favorite_venue || "Fenerbahçe Spor Kulübü";
  
  // Oyuncu derecelendirmesini hesapla
  const playerRating = userOverview?.overall_rating || 3.7;

  // Hata durumunda
  if (error && !isLoading) {
    return (
      <UserLayout>
        <div className="text-center py-8">
          <div className="text-red-500 text-lg">
            {error}
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
              Şu anda demo verileri görüntülüyorsunuz. Maç kayıtları oluşturuldukça gerçek verileriniz burada görüntülenecektir.
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
