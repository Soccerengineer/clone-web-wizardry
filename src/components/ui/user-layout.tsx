import { ReactNode, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, LineChart, Users, Trophy, Award, CalendarDays, Settings, LogOut, User, Brain, Target, Home } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarSeparator } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  const [userName, setUserName] = useState("Süper Oyuncu");
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg");

  // Kullanıcı bilgilerini yükleme işlevini ayrı bir fonksiyon olarak tanımla
  const loadUserData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      try {
        // Profil tablosundan kullanıcı bilgilerini al - sadece display_name'e bak
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('avatar_url, display_name')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          // Sadece display_name'i kontrol et, yoksa "Süper Oyuncu" kullan
          setUserName(profile.display_name || "Süper Oyuncu");
          
          if (profile.avatar_url) {
            setAvatarUrl(profile.avatar_url);
          }
        } else {
          // Metadata'dan bilgileri al - sadece display_name'e bak
          const metadata = session.user.user_metadata;
          if (metadata && metadata.display_name) {
            setUserName(metadata.display_name);
            
            if (metadata.avatar_url) {
              setAvatarUrl(metadata.avatar_url);
            }
          } else {
            // Her durumda varsayılan "Süper Oyuncu" kullan
            setUserName("Süper Oyuncu");
          }
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri yüklenirken hata:", error);
        // Hata durumunda varsayılan değer
        setUserName("Süper Oyuncu");
      }
    }
  }, []);
  
  // Auth state değişikliğini dinle
  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı bilgilerini yükle
    loadUserData();
    
    // Auth durumu değişikliklerini dinle
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        loadUserData();
      }
    });
    
    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadUserData]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Genel Bakış", href: "/overview" },
    { icon: LineChart, label: "İstatistikler", href: "/statistics" },
    { icon: Users, label: "Karşılaşmalar", href: "/matches" },
    { icon: Trophy, label: "Sıralamalar", href: "/rankings" },
    { icon: Award, label: "Promosyonlar ve Ödüller", href: "/promotions" },
    { icon: CalendarDays, label: "Turnuva ve Etkinlikler", href: "/tournaments" },
    { icon: Brain, label: "Kadro KUR AI (Beta)", href: "/squad-builder" },
    { icon: Target, label: "İddialar", href: "/challenges" }
  ];

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

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#0A1120]">
        <Sidebar className="border-r border-white/10">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-white/10">
              <Button variant="ghost" className="flex items-center w-full p-0 hover:bg-transparent" onClick={() => navigate('/')}>
                <img src="/lovable-uploads/ae21a6cd-850f-43cd-b08c-4c508c0a9dbe.png" alt="SS Logo" className="h-8 w-auto" />
                <div className="ml-2 flex items-baseline">
                  <span className="text-xl font-bold text-white">Süper</span>
                  <span className="text-xl font-bold text-[#10B981]">Saha</span>
                </div>
              </Button>
            </div>

            {/* Main Navigation */}
            <SidebarContent>
              <SidebarGroup className="px-0 py-[85px]">
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
                        <span className="flex-1 font-normal mx-0 my-0 py-0 px-0">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            {/* Footer with Profile */}
            <div className="mt-auto border-t border-white/10">
              {/* Profile Dropdown */}
              <div className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full flex items-center gap-2 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start flex-1">
                        <span className="text-sm font-medium text-white">{userName}</span>
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