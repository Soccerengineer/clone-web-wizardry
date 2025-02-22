
import UserLayout from "@/components/ui/user-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Timer, Award, ArrowRight } from "lucide-react";

const Challenges = () => {
  const challenges = [
    {
      id: 1,
      title: "100 Pas Ustası",
      description: "Bir maçta 100'den fazla başarılı pas yap",
      reward: "500 XP",
      expires: "1 Hafta",
      participants: 24,
    },
    {
      id: 2,
      title: "Gol Kralı",
      description: "3 maç üst üste en az 2 gol at",
      reward: "750 XP",
      expires: "2 Hafta",
      participants: 18,
    },
    {
      id: 3,
      title: "Asist Kralı",
      description: "Bir maçta 5'ten fazla asist yap",
      reward: "600 XP",
      expires: "5 Gün",
      participants: 32,
    }
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-white">İddialar</h1>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            Yeni İddia Oluştur
          </Button>
        </div>

        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                  </div>
                  <p className="text-gray-400">{challenge.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Ödül: {challenge.reward}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4" />
                      <span>Kalan Süre: {challenge.expires}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{challenge.participants} Katılımcı</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button className="bg-primary hover:bg-primary/90">
                    <span>Katıl</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default Challenges;
