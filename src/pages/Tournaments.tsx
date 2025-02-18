
import UserLayout from "@/components/ui/user-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, MapPin } from "lucide-react";

const Tournaments = () => {
  const tournaments = [
    {
      id: 1,
      name: "Süper Saha Kupası",
      startDate: "15 Nisan 2024",
      endDate: "30 Nisan 2024",
      location: "İzmir",
      teams: "8/16",
      prize: "10.000₺",
      status: "registration", // registration, ongoing, completed
    },
    {
      id: 2,
      name: "Yaz Ligi",
      startDate: "1 Haziran 2024",
      endDate: "30 Ağustos 2024",
      location: "İzmir",
      teams: "12/24",
      prize: "25.000₺",
      status: "upcoming",
    },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Turnuvalar ve Etkinlikler</h1>
          <Button className="bg-primary">Turnuva Oluştur</Button>
        </div>

        <div className="grid gap-4">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{tournament.name}</h3>
                      <p className="text-primary font-semibold">Ödül: {tournament.prize}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{tournament.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{tournament.teams} Takım</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{tournament.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                    Detaylar
                  </Button>
                  {tournament.status === "registration" && (
                    <Button className="bg-primary">Kayıt Ol</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default Tournaments;
