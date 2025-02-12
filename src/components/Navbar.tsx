
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Sol taraf */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img 
                src="/lovable-uploads/ae21a6cd-850f-43cd-b08c-4c508c0a9dbe.png" 
                alt="SS Logo" 
                className="h-10 w-auto"
              />
              <div className="ml-2 flex items-baseline">
                <span className="text-2xl font-bold text-white">Süper</span>
                <span className="text-2xl font-bold text-[#10B981]">Saha</span>
              </div>
            </a>
          </div>

          {/* Ortalanmış Navigasyon Linkleri */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-[#10B981] transition-colors">
              <span>Hakkımızda</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="ghost" className="text-white hover:text-[#10B981] transition-colors">
              Duyurular
            </Button>
            <Button variant="ghost" className="text-white hover:text-[#10B981] transition-colors">
              Tesisimi Ekle
            </Button>
            <Button variant="ghost" className="text-white hover:text-[#10B981] transition-colors">
              Karşılaşma Bul
            </Button>
          </div>

          {/* Giriş/Kayıt Butonları - Sağ taraf */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              GİRİŞ YAP
            </Button>
            <Button className="bg-[#10B981] hover:bg-[#10B981]/90 text-white">
              KAYIT OL
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
