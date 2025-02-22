
import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  Trophy, 
  Award,
  CalendarDays,
  Settings,
  LogOut 
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
import { useNavigate, useLocation } from "react-router-dom";
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
  ];

  const settingsItems = [
    { icon: Settings, label: "Ayarlar", href: "/settings" },
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
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                {menuItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors ${
                        location.pathname === item.href ? 'bg-white/5 text-white' : ''
                      }`}
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupContent>
                {settingsItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors ${
                        location.pathname.startsWith(item.href) ? 'bg-white/5 text-white' : ''
                      }`}
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-red-400 hover:text-red-300 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Çıkış Yap</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
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
