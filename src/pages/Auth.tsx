import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, User, LogIn, Lock, AlertCircle, Info, KeyRound, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Telefon numarasını Supabase'in beklediği formata çevir
const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Başındaki 0'ı kaldır ve +90 ekle
  if (phoneNumber.startsWith('0')) {
    phoneNumber = phoneNumber.substring(1);
  }
  
  // Boşluk, parantez ve tire gibi karakterleri kaldır
  phoneNumber = phoneNumber.replace(/[\s\(\)\-]/g, '');
  
  // Başında + yoksa ekle
  if (!phoneNumber.startsWith('+')) {
    // Türkiye ülke kodu
    phoneNumber = `+90${phoneNumber}`;
  }
  
  return phoneNumber;
};

// Telefon doğrulama işlemleri için Supabase kullanımı
const startPhoneVerification = async (phone: string): Promise<{success: boolean, error?: string}> => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone
    });
    
    if (error) {
      console.error('Telefon doğrulama hatası:', error.message);
      return {
        success: false,
        error: error.message 
      };
    }
    
    console.log('Doğrulama kodu gönderildi');
    return { success: true };
  } catch (error) {
    console.error('Telefon doğrulama hatası:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

// Doğrulama kodunu kontrol etme
const verifyOtp = async (phone: string, code: string): Promise<{success: boolean, error?: string}> => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: code,
      type: 'sms'
    });
    
    if (error) {
      console.error('Kod doğrulama hatası:', error.message);
      return {
        success: false,
        error: error.message 
      };
    }
    
    console.log('Kod doğrulama başarılı');
    return { success: true };
  } catch (error) {
    console.error('Kod doğrulama hatası:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<'select' | 'login' | 'phone'>('select');

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Başarılı!",
        description: "Giriş yapıldı.",
      });
      
      // Başarılı girişte /device-pairing sayfasına yönlendir
      navigate('/device-pairing');
    } catch (error: any) {
      toast({
        title: "Giriş Hatası",
        description: error.message || "Giriş yapılırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!isCodeSent) {
        // Telefon doğrulama kodu gönder
        const formattedPhone = formatPhoneNumber(phone);
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: {
            shouldCreateUser: true,
            data: {
              // Telefon ile giriş yapanların adı "Misafir Oyuncu" olsun
              first_name: "Misafir",
              last_name: "Oyuncu"
            }
          }
        });
        
        if (error) throw error;
        
        setIsCodeSent(true);
        toast({
          title: "Doğrulama Kodu Gönderildi",
          description: "Telefonunuza gelen kodu giriniz.",
        });
      } else {
        // Doğrulama kodunu kontrol et
        const formattedPhone = formatPhoneNumber(phone);
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: verificationCode,
          type: 'sms'
        });
        
        if (error) throw error;
        
        toast({
          title: "Giriş Başarılı!",
          description: "Süper Saha'ya hoş geldiniz.",
        });
        
        // Başarılı girişte /device-pairing sayfasına yönlendir
        navigate('/device-pairing');
      }
    } catch (error: any) {
      toast({
        title: "Giriş Hatası",
        description: error.message || "Giriş yapılırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const resetPhoneVerification = () => {
    setIsCodeSent(false);
    setVerificationCode("");
  };

  // İki farklı giriş seçeneği sunan seçim ekranı
  const renderAuthSelection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
        <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all transform hover:scale-105 cursor-pointer" onClick={() => setAuthMode('login')}>
          <CardHeader>
            <CardTitle className="text-xl text-center text-white">Üye Girişi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <LogIn className="h-20 w-20 text-primary mb-4" />
            <CardDescription className="text-center text-gray-300">
              E-posta ve şifrenizle giriş yaparak tüm özelliklere erişin.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all transform hover:scale-105 cursor-pointer" onClick={() => setAuthMode('phone')}>
      <CardHeader>
            <CardTitle className="text-xl text-center text-white">Hızlı Giriş</CardTitle>
      </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Phone className="h-20 w-20 text-primary mb-4" />
            <CardDescription className="text-center text-gray-300">
              Telefon numaranızla hızlı giriş yapın ve hemen oynamaya başlayın.
            </CardDescription>
      </CardContent>
    </Card>
      </div>
    );
  };

  // Form render eden fonksiyon
  const renderContent = () => {
    switch (authMode) {
      case 'select':
        return renderAuthSelection();
      
      case 'login':
        return (
          <Card className="bg-white/5 border-white/10 w-full max-w-md mx-auto">
      <CardHeader>
              <div className="flex items-center mb-2">
          <Button
                  type="button" 
            variant="ghost"
                  className="p-0 mr-2" 
            onClick={() => setAuthMode('select')}
          >
                  <ArrowLeft className="h-5 w-5" />
          </Button>
                <CardTitle>E-posta ile Giriş</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="relative">
                <Input
                    placeholder="E-posta"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  required
                />
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
          
                <div className="relative">
                  <Input
                    placeholder="Şifre"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                    required
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Giriş Yap
              </Button>
            </form>
      </CardContent>
    </Card>
  );

      case 'phone':
        return (
          <Card className="bg-white/5 border-white/10 w-full max-w-md mx-auto">
      <CardHeader>
              <div className="flex items-center mb-2">
          <Button
                  type="button" 
            variant="ghost"
                  className="p-0 mr-2" 
            onClick={() => setAuthMode('select')}
          >
                  <ArrowLeft className="h-5 w-5" />
          </Button>
                <CardTitle>{isCodeSent ? "Doğrulama Kodu" : "Telefon ile Hızlı Giriş"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                {!isCodeSent ? (
                  <div className="relative">
            <Input
                      placeholder="Telefon Numarası"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
              required
            />
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
                ) : (
                  <>
                    <div className="flex items-center mb-4">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="p-0 mr-2" 
                        onClick={resetPhoneVerification}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-white">{formatPhoneNumber(phone)}</span> numarasına doğrulama kodu gönderildi
                      </p>
          </div>
          
                    <div className="relative">
            <Input
              placeholder="Doğrulama Kodu"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white"
              required
            />
                      <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </>
          )}
          
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {isCodeSent ? "Doğrula ve Giriş Yap" : "Kod Gönder"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

      default:
        return renderAuthSelection();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1120] flex flex-col">
        <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full mx-auto mb-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">Süper Saha'ya Hoş Geldiniz</h1>
          <p className="text-gray-400 text-center mb-8">Maça başlamak için lütfen giriş yapın veya hızlı giriş seçeneğini kullanın</p>
      </div>
      
        {renderContent()}
      </div>
    </div>
  );
};

export default Auth;
