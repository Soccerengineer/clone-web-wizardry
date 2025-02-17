
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Play } from "lucide-react";

const SearchCard = () => {
  return (
    <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Maçını Bul</h2>
      <div className="space-y-4">
        <Select>
          <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="İl" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="istanbul">İstanbul</SelectItem>
            <SelectItem value="ankara">Ankara</SelectItem>
            <SelectItem value="izmir">İzmir</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="İlçe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kadikoy">Kadıköy</SelectItem>
            <SelectItem value="besiktas">Beşiktaş</SelectItem>
            <SelectItem value="sisli">Şişli</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="Halı Saha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saha1">Süper Saha 1</SelectItem>
            <SelectItem value="saha2">Süper Saha 2</SelectItem>
            <SelectItem value="saha3">Süper Saha 3</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          className="w-full bg-white/5 border-white/20 text-white"
          placeholder="Tarih"
        />

        <Select>
          <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="Saat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="18">18:00</SelectItem>
            <SelectItem value="19">19:00</SelectItem>
            <SelectItem value="20">20:00</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
          <Search className="mr-2 h-4 w-4" />
          Karşılaşma Bul
        </Button>

        <Button 
          className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white text-lg py-6"
        >
          <Play className="mr-2 h-6 w-6" />
          MAÇA BAŞLA
        </Button>
      </div>
    </Card>
  );
};

export default SearchCard;
