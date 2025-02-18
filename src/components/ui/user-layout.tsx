
import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  Trophy, 
  Award,
  CalendarDays 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Genel Bakış", href: "/dashboard" },
    { icon: LineChart, label: "İstatistikler", href: "/statistics" },
    { icon: Users, label: "Karşılaşmalar", href: "/matches" },
    { icon: Trophy, label: "Sıralamalar", href: "/rankings" },
    { icon: Award, label: "Promosyonlar ve Ödüller", href: "/promotions" },
    { icon: CalendarDays, label: "Turnuva ve Etkinlikler", href: "/tournaments" },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-[#0A1120]">
        <Sidebar className="border-r border-white/10">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                {menuItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
