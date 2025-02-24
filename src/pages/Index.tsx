import Navbar from "@/components/Navbar";
import SearchCard from "@/components/SearchCard";
import HowItWorks from "@/components/HowItWorks";
import WhatWeOffer from "@/components/WhatWeOffer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import GameStartModal from "@/components/GameStartModal";

const Index = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isGameStartModalOpen, setIsGameStartModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Çıkış yapıldı",
        description: "Başarıyla çıkış yaptınız."
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return <div className="min-h-screen bg-[#0A1120] relative overflow-hidden">
      <div className="absolute inset-0 bg-repeat opacity-10" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
    }} />
      
      <div className="relative">
        <Navbar />
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-white">Kullanıcı Adı</span>
                  <span className="text-xs text-gray-400">@nickname</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem onClick={() => navigate('/overview')}>
                <User className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Ayarlar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-12 pt-12 md:pt-20">
            <div className="flex-1 animate-fadeIn text-center md:text-left max-w-2xl mx-auto md:mx-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Süper <span className="text-primary">Saha</span> Nedir?
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
                Süper Saha, spor tutkunlarını dijital bir platformda bir araya getiren, 
                maç öncesi takılan etiketlerle istatistikleri, sıralamaları ve rekabeti 
                birleştiren yenilikçi bir spor deneyimidir.
              </p>

              <Button 
                className="w-full sm:w-auto px-8 bg-[#ea384c] hover:bg-[#ea384c]/90 text-white text-lg sm:text-xl py-6 sm:py-8 transform transition-all duration-200 hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                <Play className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />
                MAÇA BAŞLA
              </Button>
            </div>
            
            <div className="flex-1 flex justify-center animate-fadeIn mt-8 md:mt-0" style={{ animationDelay: "0.2s" }}>
              <SearchCard />
            </div>
          </div>
        </div>

        <HowItWorks />
        <WhatWeOffer />
      </main>

      <GameStartModal 
        isOpen={isGameStartModalOpen}
        onClose={() => setIsGameStartModalOpen(false)}
      />
    </div>;
};

export default Index;
