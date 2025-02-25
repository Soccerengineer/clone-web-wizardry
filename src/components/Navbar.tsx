import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, User, Settings, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthModals from "./AuthModals";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userName, setUserName] = useState("Kullanıcı");
  const [userNickname, setUserNickname] = useState("kullanici");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Kullanıcı durumunu kontrol et
    const checkUser = async () => {
      // Supabase oturumunu kontrol et
      const { data: { session } } = await supabase.auth.getSession();
      
      // localStorage'da misafir durumunu kontrol et
      const guestUserJSON = localStorage.getItem('guestUser');
      const guestUser = guestUserJSON ? JSON.parse(guestUserJSON) : null;
      
      if (session) {
        // Oturum açılmış kullanıcı
        setIsAuthenticated(true);
        setIsGuest(false);
        
        // Kullanıcı bilgilerini çek
        const { data: profiles } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .single();
          
        if (profiles) {
          const fullName = `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim();
          setUserName(fullName || "Kullanıcı");
          setUserNickname(profiles.first_name?.toLowerCase() || "kullanici");
        }
      } else if (guestUser && guestUser.isGuest) {
        // Misafir kullanıcı - Yeni localStorage anahtarını kontrol ediyoruz
        setIsAuthenticated(true);
        setIsGuest(true);
        setUserName("Misafir");
        setUserNickname("misafir");
      } else {
        // Giriş yapmamış kullanıcı
        setIsAuthenticated(false);
        setIsGuest(false);
      }
    };
    
    checkUser();
    
    // Auth durumu dinleyici
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      checkUser();
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (isGuest) {
      // Misafir için sadece localStorage temizle
      localStorage.removeItem('guestUser');
      setIsAuthenticated(false);
      setIsGuest(false);
      toast({
        title: "Çıkış yapıldı",
        description: "Misafir oturumu sonlandırıldı."
      });
      navigate('/');
    } else {
      // Gerçek kullanıcı için supabase oturumunu sonlandır
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
    }
  };

  const handleAuthRedirect = (type: 'login' | 'register') => {
    navigate('/auth');
    // Auth sayfasına yönlendikten sonra gerekli modu belirlemek için localStorage kullanabilirsiniz
    localStorage.setItem('authInitialMode', type);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Sol taraf */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/ae21a6cd-850f-43cd-b08c-4c508c0a9dbe.png" 
                  alt="SS Logo" 
                  className="h-10 w-auto"
                />
                <div className="ml-2 flex items-baseline">
                  <span className="text-2xl font-bold text-white">Süper</span>
                  <span className="text-2xl font-bold text-[#10B981]">Saha</span>
                </div>
              </Link>
            </div>

            {/* Ortalanmış Navigasyon Linkleri */}
            <div className="hidden md:flex flex-1 justify-center items-center space-x-4">
              <Link to="/about">
                <Button variant="ghost" className="text-white hover:text-[#10B981] transition-colors">
                  <span>Hakkımızda</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </Link>
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

            {/* Giriş/Kayıt veya Profil Dropdown - Sağ taraf */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                // Kullanıcı girişi yapılmışsa profil dropdown menüsü göster
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
                        <span className="text-sm font-medium text-white">{userName}</span>
                        <span className="text-xs text-gray-400">@{userNickname}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    {!isGuest && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/overview')}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/settings')}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Ayarlar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Giriş yapılmamışsa login/register butonları göster
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/5 transition-colors"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    Giriş Yap
                  </Button>
                  <Button 
                    variant="default"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setIsRegisterOpen(true)}
                  >
                    <User className="h-5 w-5 mr-1" />
                    Kayıt Ol
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModals 
        isLoginOpen={isLoginOpen}
        isRegisterOpen={isRegisterOpen}
        onLoginClose={() => setIsLoginOpen(false)}
        onRegisterClose={() => setIsRegisterOpen(false)}
      />
    </>
  );
};

export default Navbar;
