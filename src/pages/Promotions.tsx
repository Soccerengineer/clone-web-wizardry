
import UserLayout from "@/components/ui/user-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Star } from "lucide-react";

const Promotions = () => {
  const promotions = [
    {
      id: 1,
      title: "İlk Maç Ücretsiz",
      description: "Anketi doldur, ilk maçını ücretsiz oyna!",
      code: "ANKET2024",
      expires: "30 Nisan 2024",
    },
    {
      id: 2,
      title: "İkinci Maç %50 İndirimli",
      description: "İkinci maçında otomatik %50 indirim fırsatı!",
      code: "MATCH50",
      expires: "Süresiz",
    },
  ];

  const rewards = [
    {
      id: 1,
      name: "MVP Rozeti",
      points: 1000,
      description: "10 kez MVP seçildiğinizde kazanılır",
      progress: 70,
    },
    {
      id: 2,
      name: "Süper Yıldız",
      points: 2500,
      description: "50 maç oynadığınızda kazanılır",
      progress: 45,
    },
  ];

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Promotions Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Aktif Promosyonlar</h2>
          <div className="grid gap-4">
            {promotions.map((promo) => (
              <Card key={promo.id} className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-white">{promo.title}</h3>
                    </div>
                    <p className="text-gray-400">{promo.description}</p>
                    <div className="text-sm text-gray-500">Son kullanım: {promo.expires}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-mono text-primary">{promo.code}</div>
                    <Button className="bg-primary">Kullan</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Rewards Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Ödül İlerlemesi</h2>
          <div className="grid gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-white">{reward.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400">{reward.description}</p>
                    </div>
                    <div className="text-primary font-bold">{reward.points} XP</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">İlerleme</span>
                      <span className="text-white">{reward.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${reward.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Promotions;
