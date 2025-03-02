import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Settings, Shield, Bell, Globe, FileText, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SettingsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Kullanıcı durumunu kontrol et
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
      } else {
        // Giriş yapılmamışsa ana sayfaya yönlendir
        navigate('/');
        toast({
          title: "Erişim Engellendi",
          description: "Bu sayfaya erişmek için giriş yapmanız gerekiyor.",
          variant: "destructive"
        });
      }
    };
    
    checkSession();
  }, [navigate, toast]);
  
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
  
  // Path kontrolü ile aktif link tespiti
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  if (!isAuthenticated) {
    return null; // Giriş yapılmamışsa gösterme
  }
  
  return (
    <div className="min-h-screen bg-[#0A1120] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-8 gap-8">
        {/* Sol menü - Mobilde üstte */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 sticky top-24">
            <div className="space-y-1 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Ayarlar</h2>
              
              <Link to="/settings/profile">
                <Button
                  variant={isActive("/settings/profile") ? "default" : "ghost"}
                  className={`w-full justify-start ${!isActive("/settings/profile") ? "text-gray-300 hover:text-white" : ""}`}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Button>
              </Link>
              
              <Link to="/settings">
                <Button
                  variant={isActive("/settings") ? "default" : "ghost"}
                  className={`w-full justify-start ${!isActive("/settings") ? "text-gray-300 hover:text-white" : ""}`}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Genel
                </Button>
              </Link>
              
              <Link to="/settings/security">
                <Button
                  variant={isActive("/settings/security") ? "default" : "ghost"}
                  className={`w-full justify-start ${!isActive("/settings/security") ? "text-gray-300 hover:text-white" : ""}`}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Güvenlik
                </Button>
              </Link>
              
              <Link to="/settings/notifications">
                <Button
                  variant={isActive("/settings/notifications") ? "default" : "ghost"}
                  className={`w-full justify-start ${!isActive("/settings/notifications") ? "text-gray-300 hover:text-white" : ""}`}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Bildirimler
                </Button>
              </Link>
              
              <Link to="/settings/language">
                <Button
                  variant={isActive("/settings/language") ? "default" : "ghost"}
                  className={`w-full justify-start ${!isActive("/settings/language") ? "text-gray-300 hover:text-white" : ""}`}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Dil
                </Button>
              </Link>
              
              <Link to="/settings/privacy">
                <Button
                  variant={isActive("/settings/privacy") ? "default" : "ghost"}
                  className={`w-full justify-start ${!isActive("/settings/privacy") ? "text-gray-300 hover:text-white" : ""}`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Gizlilik
                </Button>
              </Link>
            </div>
            
            <Button
              variant="destructive"
              className="w-full justify-start mt-10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </Button>
          </div>
        </aside>
        
        {/* Sağ içerik alanı */}
        <main className="flex-1 bg-white/5 border border-white/10 rounded-lg p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout; 