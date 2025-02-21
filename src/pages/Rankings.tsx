
import UserLayout from "@/components/ui/user-layout";
import { Card } from "@/components/ui/card";
import { Medal, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Rankings = () => {
  const rankings = [
    { rank: 1, name: "Ahmet Yılmaz", matches: 45, ktp: 4.8, mvp: 12, level: 8 },
    { rank: 2, name: "Mehmet Demir", matches: 42, ktp: 4.7, mvp: 10, level: 7 },
    { rank: 3, name: "Ali Kaya", matches: 38, ktp: 4.6, mvp: 8, level: 7 },
    { rank: 4, name: "Can Şahin", matches: 36, ktp: 4.5, mvp: 7, level: 6 },
    { rank: 5, name: "Burak Öz", matches: 33, ktp: 4.4, mvp: 6, level: 6 },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Sezon Sıralaması</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Select>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Yaşa Göre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-24">18-24</SelectItem>
                <SelectItem value="25-30">25-30</SelectItem>
                <SelectItem value="31+">31+</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Seviyeye Göre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">Seviye 1-3</SelectItem>
                <SelectItem value="4-6">Seviye 4-6</SelectItem>
                <SelectItem value="7+">Seviye 7+</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Sahaya Göre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="halisaha">Halı Saha</SelectItem>
                <SelectItem value="acik">Açık Saha</SelectItem>
                <SelectItem value="kapali">Kapalı Saha</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Pozisyona Göre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forvet">Forvet</SelectItem>
                <SelectItem value="ortasaha">Orta Saha</SelectItem>
                <SelectItem value="defans">Defans</SelectItem>
                <SelectItem value="kaleci">Kaleci</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10">
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="pb-4">Sıra</th>
                  <th className="pb-4">Oyuncu</th>
                  <th className="pb-4">Maç</th>
                  <th className="pb-4">KTP</th>
                  <th className="pb-4">MVP</th>
                  <th className="pb-4">Seviye</th>
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
                    <td className="py-4">{player.ktp}</td>
                    <td className="py-4">{player.mvp}</td>
                    <td className="py-4">{player.level}</td>
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
