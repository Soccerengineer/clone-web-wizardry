import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, User, Settings, LogOut, LayoutDashboard, LogIn, Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthModals from "./AuthModals";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Süper Oyuncu");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Kullanıcı durumunu kontrol et
    const checkUser = async () => {
      // Supabase oturumunu kontrol et
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Oturum açılmış kullanıcı
        setIsAuthenticated(true);
        
        try {
          // Kullanıcı bilgilerini çek - sadece nickname alanını sor
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('id', session.user.id)
            .single();
            
          if (profiles && profiles.nickname) {
            setUserName(profiles.nickname);
          } else {
            // Profil tablosu erişimi yoksa ya da profil verisi yoksa metadata'dan al
            const metadata = session.user.user_metadata;
            if (metadata && metadata.nickname) {
              setUserName(metadata.nickname);
            } else {
              // Kullanıcı ID'sinin ilk 8 karakterini kullan
              setUserName(session.user.id.substring(0, 8));
            }
          }
        } catch (error) {
          console.error("Profil verisi çekilemedi:", error);
          // Hata durumunda kullanıcı ID'sinin ilk 8 karakterini kullan
          setUserName(session.user.id.substring(0, 8));
        }
      } else {
        // Giriş yapmamış kullanıcı
        setIsAuthenticated(false);
        setUserName("");
      }
    };
    
    checkUser();
    
    // Auth durumu dinleyici
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'USER_UPDATED' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkUser();
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      // Önce localStorage'daki misafir kullanıcı durumunu kontrol et
      const userType = localStorage.getItem('userType');
      const isGuestUser = userType === 'guest';
      
      if (isGuestUser) {
        // Misafir kullanıcı için sadece localStorage temizle
        localStorage.removeItem('userType');
        toast({
          title: "Çıkış yapıldı",
          description: "Misafir oturumu sonlandırıldı."
        });
      } else {
        // Normal kullanıcı için Supabase oturumunu sonlandır
        await supabase.auth.signOut();
        toast({
          title: "Çıkış yapıldı",
          description: "Başarıyla çıkış yaptınız."
        });
      }
      
      // Çıkış sonrası ana sayfaya yönlendir
      navigate('/');
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir sorun oluştu.",
        variant: "destructive"
      });
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
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
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
        onLoginOpenChange={setIsLoginOpen}
        onRegisterOpenChange={setIsRegisterOpen}
      />
    </>
  );
};

export default Navbar;
