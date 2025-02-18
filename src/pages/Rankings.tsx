
import UserLayout from "@/components/ui/user-layout";
import { Card } from "@/components/ui/card";
import { Medal } from "lucide-react";

const Rankings = () => {
  const rankings = [
    { rank: 1, name: "Ahmet Yılmaz", matches: 45, rating: 4.8, mvp: 12 },
    { rank: 2, name: "Mehmet Demir", matches: 42, rating: 4.7, mvp: 10 },
    { rank: 3, name: "Ali Kaya", matches: 38, rating: 4.6, mvp: 8 },
    { rank: 4, name: "Can Şahin", matches: 36, rating: 4.5, mvp: 7 },
    { rank: 5, name: "Burak Öz", matches: 33, rating: 4.4, mvp: 6 },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Sezon Sıralaması</h1>

        <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10">
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="pb-4">Sıra</th>
                  <th className="pb-4">Oyuncu</th>
                  <th className="pb-4">Maç</th>
                  <th className="pb-4">Puan</th>
                  <th className="pb-4">MVP</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {rankings.map((player) => (
                  <tr key={player.rank} className="border-t border-white/10">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {player.rank <= 3 && (
                          <Medal className={`w-5 h-5 ${
                            player.rank === 1 ? "text-yellow-500" :
                            player.rank === 2 ? "text-gray-400" :
                            "text-amber-600"
                          }`} />
                        )}
                        <span>{player.rank}</span>
                      </div>
                    </td>
                    <td className="py-4">{player.name}</td>
                    <td className="py-4">{player.matches}</td>
                    <td className="py-4">{player.rating}</td>
                    <td className="py-4">{player.mvp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </UserLayout>
  );
};

export default Rankings;
