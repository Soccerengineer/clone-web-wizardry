
import UserLayout from "@/components/ui/user-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Users, ArrowRight, Sparkles } from "lucide-react";

const AISquadBuilder = () => {
  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-white">Kadro KUR AI (Beta)</h1>
        </div>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-white">AI Destekli Kadro Oluşturucu</h2>
            </div>
            <p className="text-gray-400">
              Yapay zeka teknolojimiz ile oyun stilinize ve tercihlerinize göre en uygun kadroyu oluşturun. 
              Sistem oyuncuların performans verilerini analiz ederek en uyumlu takımı önerir.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4 bg-white/5 border-white/10">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-white">Oyuncu Analizi</h3>
                  <p className="text-sm text-gray-400">Oyuncuların geçmiş performansları ve oyun stilleri analiz edilir</p>
                </div>
              </Card>
              <Card className="p-4 bg-white/5 border-white/10">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-white">Takım Uyumu</h3>
                  <p className="text-sm text-gray-400">Oyuncular arası uyum ve pozisyonel denge hesaplanır</p>
                </div>
              </Card>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Kadro Oluştur
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-white">Son Oluşturulan Kadrolar</h2>
            </div>
            <div className="space-y-4">
              <Card className="p-4 bg-white/5 border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">5v5 Hücum Odaklı</h4>
                    <p className="text-sm text-gray-400">23 Mart 2024</p>
                  </div>
                  <Button variant="ghost" className="text-primary hover:text-primary/90">
                    Detaylar
                  </Button>
                </div>
              </Card>
              <Card className="p-4 bg-white/5 border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">5v5 Dengeli</h4>
                    <p className="text-sm text-gray-400">22 Mart 2024</p>
                  </div>
                  <Button variant="ghost" className="text-primary hover:text-primary/90">
                    Detaylar
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </UserLayout>
  );
};

export default AISquadBuilder;
