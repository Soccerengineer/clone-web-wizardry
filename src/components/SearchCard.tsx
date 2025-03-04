import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchCard = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/matches');
  };

  return <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border-white/20 mx-[15px] my-[70px]">
      <h2 className="text-2xl font-bold text-white mb-6">Maçını Bul</h2>
      <div className="space-y-4">
        <Select defaultValue="manisa">
          <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="İl" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manisa">Manisa</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="yunusemre">
          <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="İlçe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yunusemre">Yunusemre</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="mavitas">
          <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="Halı Saha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mavitas">Mavitaş Halısaha</SelectItem>
          </SelectContent>
        </Select>

        <Input type="date" className="w-full bg-white/5 border-white/20 text-white" placeholder="Tarih" />

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

        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={handleSearch}
        >
          <Search className="mr-2 h-4 w-4" />
          Karşılaşma Bul
        </Button>

        
      </div>
    </Card>;
};
export default SearchCard;