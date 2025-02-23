
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  Trophy, 
  Award,
  CalendarDays,
  Settings,
  LogOut,
  User,
  Brain,
  Target,
  Home
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const menuItems = [
    { icon: LayoutDashboard, label: "Genel Bakış", href: "/overview" },
    { icon: LineChart, label: "İstatistikler", href: "/statistics" },
    { icon: Users, label: "Karşılaşmalar", href: "/matches" },
    { icon: Trophy, label: "Sıralamalar", href: "/rankings" },
    { icon: Award, label: "Promosyonlar ve Ödüller", href: "/promotions" },
    { icon: CalendarDays, label: "Turnuva ve Etkinlikler", href: "/tournaments" },
    { icon: Brain, label: "Kadro KUR AI (Beta)", href: "/ai-squad-builder" },
    { icon: Target, label: "İddialar", href: "/challenges" },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Çıkış yapıldı",
        description: "Başarıyla çıkış yaptınız.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#0A1120]">
        <Sidebar className="border-r border-white/10">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-white/10">
              <Button
                variant="ghost"
                className="flex items-center w-full p-0 hover:bg-transparent"
                onClick={() => navigate('/overview')}
              >
                <img 
                  src="/lovable-uploads/ae21a6cd-850f-43cd-b08c-4c508c0a9dbe.png" 
                  alt="SS Logo" 
                  className="h-8 w-auto"
                />
                <div className="ml-2 flex items-baseline">
                  <span className="text-xl font-bold text-white">Süper</span>
                  <span className="text-xl font-bold text-[#10B981]">Saha</span>
                </div>
              </Button>
            </div>

            {/* Main Navigation */}
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent className="flex flex-col items-stretch [&>*]:list-none">
                  {menuItems.map((item, index) => (
                    <SidebarMenuItem key={index} className="list-none">
                      <SidebarMenuButton 
                        className={`flex items-center gap-3 px-4 py-4 hover:bg-white/5 text-gray-300 hover:text-white transition-colors w-full ${
                          location.pathname === item.href ? 'bg-white/5 text-white' : ''
                        }`}
                        onClick={() => navigate(item.href)}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            {/* Footer with Profile and Home Button */}
            <div className="mt-auto border-t border-white/10">
              {/* Profile Dropdown */}
              <div className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full flex items-center gap-2 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start flex-1">
                        <span className="text-sm font-medium text-white">Kullanıcı Adı</span>
                        <span className="text-xs text-gray-400">@nickname</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" side="right">
                    <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
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

              {/* Home Button */}
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 p-4 text-gray-300 hover:text-white hover:bg-white/5"
                onClick={() => navigate('/overview')}
              >
                <Home className="h-5 w-5" />
                <span>Ana Sayfaya Geri Dön</span>
              </Button>
            </div>
          </div>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserLayout;
