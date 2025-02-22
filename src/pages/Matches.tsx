
import UserLayout from "@/components/ui/user-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Clock, ArrowRight } from "lucide-react";

const Matches = () => {
  const upcomingMatches = [
    {
      id: 1,
      venue: "Mavitaş Halı Saha",
      date: "27 Mart 2024",
      time: "19:00",
      players: "8/10",
      location: "Karşıyaka, İzmir",
      type: "5v5",
    },
    {
      id: 2,
      venue: "Arena Halı Saha",
      date: "29 Mart 2024",
      time: "20:30",
      players: "6/10",
      location: "Bornova, İzmir",
      type: "5v5",
    },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Yaklaşan Karşılaşmalar</h1>
        </div>

        <div className="grid gap-4">
          {upcomingMatches.map((match) => (
            <Card key={match.id} className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">{match.venue}</h3>
                  <div className="flex flex-wrap gap-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>{match.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{match.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{match.players}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{match.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">
                    {match.type}
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <span>Maç Detayları</span>
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

export default Matches;
