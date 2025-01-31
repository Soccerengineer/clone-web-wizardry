import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">Süper</span>
              <span className="text-2xl font-bold text-primary">Saha</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-white hover:text-primary transition-colors">
              <span>Hakkımızda</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="ghost" className="text-white hover:text-primary transition-colors">
              Duyurular
            </Button>
            <Button variant="ghost" className="text-white hover:text-primary transition-colors">
              Tesisimi Ekle
            </Button>
            <Button variant="ghost" className="text-white hover:text-primary transition-colors">
              Karşılaşma Bul
            </Button>
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              GİRİŞ YAP
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              KAYIT OL
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;