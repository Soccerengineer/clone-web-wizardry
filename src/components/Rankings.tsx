import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockData = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    age: 25,
    position: "Forvet",
    region: "Manisa",
    matches: 15,
    shots: 45,
    passes: 120,
    distance: 25.5,
    level: 8.5
  },
  {
    id: 2,
    name: "Mehmet Demir",
    age: 28,
    position: "Orta Saha",
    region: "İzmir",
    matches: 18,
    shots: 15,
    passes: 180,
    distance: 28.2,
    level: 7.8
  },
  {
    id: 3,
    name: "Ali Kaya",
    age: 22,
    position: "Defans",
    region: "Manisa",
    matches: 12,
    shots: 8,
    passes: 95,
    distance: 22.8,
    level: 7.2
  },
  {
    id: 4,
    name: "Can Yıldız",
    age: 30,
    position: "Kaleci",
    region: "İzmir",
    matches: 20,
    shots: 0,
    passes: 45,
    distance: 15.3,
    level: 8.9
  },
  {
    id: 5,
    name: "Burak Şahin",
    age: 27,
    position: "Forvet",
    region: "Manisa",
    matches: 16,
    shots: 38,
    passes: 110,
    distance: 26.7,
    level: 8.1
  }
];

const Rankings = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Oyuncu Sıralaması</h2>
      
      <div className="flex gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="Yaş Aralığı" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="18-25">18-25</SelectItem>
            <SelectItem value="26-30">26-30</SelectItem>
            <SelectItem value="31+">31+</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="Bölge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="manisa">Manisa</SelectItem>
            <SelectItem value="izmir">İzmir</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="Mevki" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="forvet">Forvet</SelectItem>
            <SelectItem value="ortasaha">Orta Saha</SelectItem>
            <SelectItem value="defans">Defans</SelectItem>
            <SelectItem value="kaleci">Kaleci</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white/5 border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-white">Sıra</TableHead>
              <TableHead className="text-white">Oyuncu</TableHead>
              <TableHead className="text-white">Yaş</TableHead>
              <TableHead className="text-white">Bölge</TableHead>
              <TableHead className="text-white">Mevki</TableHead>
              <TableHead className="text-white">Maç</TableHead>
              <TableHead className="text-white">Şut</TableHead>
              <TableHead className="text-white">Pas</TableHead>
              <TableHead className="text-white">Mesafe (km)</TableHead>
              <TableHead className="text-white">Seviye</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((player, index) => (
              <TableRow key={player.id} className="border-white/10">
                <TableCell className="text-white">{index + 1}</TableCell>
                <TableCell className="text-white">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar_placeholder.png" alt={player.name} />
                      <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{player.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white">{player.age}</TableCell>
                <TableCell className="text-white">{player.region}</TableCell>
                <TableCell className="text-white">{player.position}</TableCell>
                <TableCell className="text-white">{player.matches}</TableCell>
                <TableCell className="text-white">{player.shots}</TableCell>
                <TableCell className="text-white">{player.passes}</TableCell>
                <TableCell className="text-white">{player.distance}</TableCell>
                <TableCell className="text-white font-bold">{player.level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Rankings; 