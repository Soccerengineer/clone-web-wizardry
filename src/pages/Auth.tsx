import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, User, LogIn, Lock, AlertCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

// SMS doğrulama servisi için yardımcı fonksiyonlar
const generateOTP = (): string => {
  // 6 haneli rastgele kod oluştur
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Telefon numarasını uluslararası formata çevir
const formatPhoneNumber = (phoneNumber: string): string => {
  // Tüm boşluk ve özel karakterleri kaldır
  let cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  
  // Eğer telefon zaten +90 ile başlıyorsa, olduğu gibi bırak
  if (cleanPhone.startsWith('+90')) {
    return cleanPhone;
  } 
  // Eğer 0 ile başlıyorsa, 0'ı kaldır ve +90 ekle
  else if (cleanPhone.startsWith('0')) {
    return `+90${cleanPhone.substring(1)}`;
  } 
  // Eğer ne + ile ne de 0 ile başlıyorsa, +90 ekle
  else {
    return `+90${cleanPhone}`;
  }
};

// API URL'ini tanımla
const API_URL = 'http://localhost:3000';

// Vonage Verify API ile doğrulama servisi
const startVerification = async (phone: string): Promise<{success: boolean, requestId?: string, error?: string}> => {
  try {
    // Node.js API servisimizi kullan
    const response = await fetch(`${API_URL}/api/verify/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: phone
      })
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      console.error('Doğrulama başlatma hatası:', result.error || 'Bilinmeyen hata');
      return {
        success: false,
        error: result.error || 'Doğrulama başlatılamadı'
      };
    }
    
    console.log('Doğrulama başlatıldı, istek ID:', result.request_id);
    return {
      success: true,
      requestId: result.request_id
    };
  } catch (error) {
    console.error('Doğrulama hatası:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

// Doğrulama kodunu kontrol etme
const checkVerification = async (requestId: string, code: string): Promise<{success: boolean, error?: string}> => {
  try {
    // Node.js API servisimizi kullan
    const response = await fetch(`${API_URL}/api/verify/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        request_id: requestId,
        code: code
      })
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      console.error('Doğrulama kodu kontrolü hatası:', result.error || 'Bilinmeyen hata');
      return {
        success: false,
        error: result.error || 'Doğrulama kodu kontrol edilemedi'
      };
    }
    
    console.log('Doğrulama başarılı');
    return { success: true };
  } catch (error) {
    console.error('Doğrulama kodu kontrolü hatası:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

// Doğrulama isteğini iptal etme
const cancelVerification = async (requestId: string): Promise<{success: boolean, error?: string}> => {
  try {
    // Node.js API servisimizi kullan
    const response = await fetch(`${API_URL}/api/verify/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        request_id: requestId
      })
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      console.error('Doğrulama iptali hatası:', result.error || 'Bilinmeyen hata');
      return {
        success: false,
        error: result.error || 'Doğrulama iptal edilemedi'
      };
    }
    
    console.log('Doğrulama iptal edildi');
    return { success: true };
  } catch (error) {
    console.error('Doğrulama iptali hatası:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<'select' | 'login' | 'register' | 'guest'>('select');

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState("");
  
  // Telefon güvenlik bilgisi için tooltip içeriği
  const phoneSecurityInfo = "Telefon numaranız 3. kişilerle paylaşılmayacaktır ve SSL güvenlik sertifikası ile korunmaktadır.";

  // Son doğrulama isteğinin ID'sini tutacak state
  const [verificationRequestId, setVerificationRequestId] = useState<string>("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Şifre Hatası",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Email veya telefon kontrolü
      if (identifierType === 'email') {
        const { data, error } = await supabase.auth.signUp({
          email: identifier,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Kayıt Başarılı!",
          description: "E-posta adresinize gönderilen bağlantıyı takip ederek kaydınızı tamamlayabilirsiniz.",
        });
      } else {
        // Telefon kaydı için kod gönderme
        // Not: Supabase telefonla kayıt için özel ayarlar gerektirebilir
        setIsCodeSent(true);
        toast({
          title: "Doğrulama Kodu Gönderildi",
          description: "Lütfen telefonunuza gönderilen kodu giriniz.",
        });
        return;
      }
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Kayıt Hatası",
        description: error.message || "Kayıt olurken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCodeSent) {
      try {
        const formattedPhone = formatPhoneNumber(phone);
        
        // Vonage Verify API ile doğrulama başlat
        const verificationResult = await startVerification(formattedPhone);
        
        if (verificationResult.success && verificationResult.requestId) {
          // Doğrulama başarılı, requestId'yi sakla
          setVerificationRequestId(verificationResult.requestId);
          setIsCodeSent(true);
          toast({
            title: "Doğrulama Kodu Gönderildi",
            description: "Telefonunuza gelen kodu girin.",
          });
        } else {
          // Doğrulama başarısız
          toast({
            title: "SMS Gönderimi Başarısız",
            description: verificationResult.error || "Telefon numaranızı doğru formatta girdiğinizden emin olun (+90XXXXXXXXXX veya 05XXXXXXXXX). Numarayı baştan kontrol edip tekrar deneyiniz.",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        toast({
          title: "Hata",
          description: error.message || "Kod gönderilirken bir hata oluştu",
          variant: "destructive"
        });
      }
    } else {
      try {
        if (!verificationRequestId) {
          throw new Error('Geçersiz doğrulama isteği. Lütfen tekrar kod isteyin.');
        }

        // Verify API ile kodu kontrol et
        const checkResult = await checkVerification(verificationRequestId, verificationCode);
        
        if (checkResult.success) {
          // Doğrulama başarılı, kullanıcıyı oturum açmış olarak işaretle
          localStorage.setItem('guestUser', JSON.stringify({
            phone: phone,
            timestamp: new Date().toISOString(),
            isGuest: true
          }));
          
          // Doğrulama başarılı olduğunda
          toast({
            title: "Doğrulama Başarılı",
            description: "Misafir olarak giriş yapıldı.",
          });
          
          // Yönlendirme
          navigate('/device-pairing');
        } else {
          throw new Error(checkResult.error || "Doğrulama kodu eşleşmiyor.");
        }
      } catch (error: any) {
        toast({
          title: "Doğrulama Hatası",
          description: error.message || "Kod doğrulanırken bir hata oluştu",
          variant: "destructive"
        });
      }
    }
  };

  const renderMainOptions = () => (
    <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white text-center">
          Nasıl Devam Etmek İstersiniz?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full p-6 text-lg flex gap-3 bg-primary hover:bg-primary/90 text-white"
          onClick={() => setAuthMode('login')}
        >
          <LogIn className="h-6 w-6" />
          Giriş Yap
        </Button>
        <Button
          variant="outline"
          className="w-full p-6 text-lg flex gap-3 bg-white/5 border-white/20 text-white hover:bg-white/10"
          onClick={() => setAuthMode('register')}
        >
          <User className="h-6 w-6" />
          Kayıt Ol
        </Button>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0A1120] px-2 text-white/60">veya</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full p-6 text-lg flex gap-3 bg-white/5 border-white/20 text-white hover:bg-white/10"
          onClick={() => setAuthMode('guest')}
        >
          <Phone className="h-6 w-6" />
          Üye Olmadan Devam Et
        </Button>
      </CardContent>
    </Card>
  );

  const renderLoginForm = () => (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <Button
            variant="ghost"
            className="text-white p-0 h-auto"
            onClick={() => setAuthMode('select')}
          >
            ← Geri
          </Button>
          <CardTitle className="text-xl font-bold text-white text-center">
            Giriş Yap
          </CardTitle>
          <div className="w-[60px]"></div> {/* Boşluk dengelemek için */}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
            <TabsTrigger 
              value="email" 
              className="data-[state=active]:bg-primary"
              onClick={() => setLoginMethod('email')}
            >
              E-posta
            </TabsTrigger>
            <TabsTrigger 
              value="phone" 
              className="data-[state=active]:bg-primary"
              onClick={() => setLoginMethod('phone')}
            >
              Telefon
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="E-posta"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Giriş Yap
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="phone">
            <form onSubmit={handleVerifyPhone} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={phone}
                    onChange={(e) => {
                      // Sadece rakamları ve + işaretini kabul et
                      const value = e.target.value.replace(/[^\d+]/g, '');
                      setPhone(value);
                    }}
                    className="bg-white/5 border-white/20 text-white pl-10 pr-10"
                    required
                    disabled={isCodeSent}
                  />
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white text-xs p-2 max-w-[200px]">
                        <p>05XX formatında telefon numaranızı girin. Başında 0 olmalı.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {isCodeSent && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Doğrulama Kodu"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      required
                    />
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {isCodeSent ? 'Doğrula' : 'Kod Gönder'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-white/70 text-sm">
          <p>
            Hesabınız yok mu?{' '}
            <button 
              onClick={() => setAuthMode('register')} 
              className="text-primary hover:underline"
            >
              Kayıt Ol
            </button>
          </p>
        </div>
      </CardFooter>
    </Card>
  );

  const renderRegisterForm = () => (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <Button
            variant="ghost"
            className="text-white p-0 h-auto"
            onClick={() => setAuthMode('select')}
          >
            ← Geri
          </Button>
          <CardTitle className="text-xl font-bold text-white text-center">
            Hesap Oluştur
          </CardTitle>
          <div className="w-[60px]"></div> {/* Boşluk dengelemek için */}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Ad"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              required
            />
            <Input
              placeholder="Soyad"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap sm:flex-nowrap">
              <select 
                className="bg-white/5 border-r-0 border-white/20 text-black font-medium rounded-l-md px-3 py-2 w-full sm:w-auto"
                value={identifierType}
                onChange={(e) => setIdentifierType(e.target.value as 'email' | 'phone')}
                style={{backgroundColor: 'rgba(255, 255, 255, 0.9)'}}
              >
                <option value="email" className="text-black">E-posta</option>
                <option value="phone" className="text-black">Telefon</option>
              </select>
              <div className="relative flex-1 w-full sm:w-auto mt-2 sm:mt-0">
                <Input
                  type={identifierType === 'email' ? 'email' : 'tel'}
                  placeholder={identifierType === 'email' ? 'E-posta adresiniz' : 'Telefon numaranız'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-white/5 border-white/20 text-white sm:rounded-l-none pr-10 w-full"
                  required
                />
                {identifierType === 'phone' && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-help">
                          <AlertCircle className="h-4 w-4 text-yellow-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black/80 text-white max-w-xs p-2">
                        <p>{phoneSecurityInfo}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
          
          <Input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border-white/20 text-white"
            required
          />
          <Input
            type="password"
            placeholder="Şifre Tekrar"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white/5 border-white/20 text-white"
            required
          />
          
          {isCodeSent && identifierType === 'phone' && (
            <Input
              type="text"
              placeholder="Doğrulama Kodu"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              required
            />
          )}
          
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            {isCodeSent && identifierType === 'phone' ? 'Doğrula' : 'Kayıt Ol'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-white/70 text-sm">
          <p>
            Zaten bir hesabınız var mı?{' '}
            <button 
              onClick={() => setAuthMode('login')} 
              className="text-primary hover:underline"
            >
              Giriş Yap
            </button>
          </p>
        </div>
      </CardFooter>
    </Card>
  );

  const renderGuestForm = () => (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <Button
            variant="ghost"
            className="text-white p-0 h-auto"
            onClick={() => {
              setAuthMode('select');
              setIsCodeSent(false);
              setVerificationCode("");
            }}
          >
            ← Geri
          </Button>
          <CardTitle className="text-xl font-bold text-white text-center">
            Misafir Girişi
          </CardTitle>
          <div className="w-[60px]"></div> {/* Boşluk dengelemek için */}
        </div>
        <CardDescription className="text-center text-white/70 mt-4">
          {isCodeSent 
            ? "Doğrulama kodunu giriniz" 
            : "Telefon numaranızla misafir olarak devam edebilirsiniz"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyPhone} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <div className={`flex items-center ${isCodeSent ? 'opacity-70' : ''}`}>
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={(e) => {
                    // Sadece rakamları ve + işaretini kabul et
                    const value = e.target.value.replace(/[^\d+]/g, '');
                    setPhone(value);
                  }}
                  className="bg-white/5 border-white/20 text-white pl-10 pr-10"
                  required
                  disabled={isCodeSent}
                />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white text-xs p-2 max-w-[200px]">
                      <p>05XX formatında telefon numaranızı girin. Başında 0 olmalı.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {isCodeSent && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Doğrulama Kodu"
                  value={verificationCode}
                  onChange={(e) => {
                    // Sadece rakamları kabul et
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setVerificationCode(value);
                  }}
                  className="bg-white/5 border-white/20 text-white pl-10"
                  required
                  maxLength={6}
                />
              </div>
            )}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            {isCodeSent ? 'Doğrula' : 'Kod Gönder'}
          </Button>
          
          {isCodeSent && (
            <div className="text-center text-white/70 text-sm mt-2">
              <p>Kod gelmedi mi? <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  // Önceki doğrulama isteğini iptal et
                  if (verificationRequestId) {
                    cancelVerification(verificationRequestId).then(() => {
                      setIsCodeSent(false);
                      setVerificationRequestId("");
                      // Yeni doğrulama isteğini başlat
                      handleVerifyPhone(e as React.FormEvent);
                    });
                  } else {
                    setIsCodeSent(false);
                    // Yeni doğrulama isteğini başlat
                    handleVerifyPhone(e as React.FormEvent);
                  }
                }}
                className="text-primary hover:underline"
              >
                Tekrar Gönder
              </button></p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-white/70 text-sm">
          <p>
            Üye girişi yapmak için{' '}
            <button 
              onClick={() => setAuthMode('login')} 
              className="text-primary hover:underline"
            >
              Giriş Yap
            </button>
          </p>
        </div>
      </CardFooter>
    </Card>
  );

  const renderActiveForm = () => {
    switch (authMode) {
      case 'login':
        return renderLoginForm();
      case 'register':
        return renderRegisterForm();
      case 'guest':
        return renderGuestForm();
      default:
        return renderMainOptions();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1120]">
      <div className="border-b border-white/10">
        <Navbar />
      </div>
      
      <div className="flex items-center justify-center p-4 pt-10 md:pt-20">
        {renderActiveForm()}
      </div>
    </div>
  );
};

export default Auth;
