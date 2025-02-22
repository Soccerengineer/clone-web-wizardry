
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Shield,
  Globe,
  Eye,
  Settings,
  LogOut,
} from "lucide-react";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const navigation = [
    {
      title: "Profil Bilgileri",
      href: "/settings/profile",
      icon: User,
    },
    {
      title: "Güvenlik",
      href: "/settings/security",
      icon: Shield,
    },
    {
      title: "Gizlilik",
      href: "/settings/privacy",
      icon: Eye,
    },
    {
      title: "Dil ve Bölge",
      href: "/settings/language",
      icon: Globe,
    },
    {
      title: "Genel Ayarlar",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row gap-8 p-8">
      <aside className="md:w-64 flex-shrink-0">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-primary/10 text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Button>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default SettingsLayout;
