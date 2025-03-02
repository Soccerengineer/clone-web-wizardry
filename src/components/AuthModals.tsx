import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface AuthModalsProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  onLoginOpenChange: (open: boolean) => void;
  onRegisterOpenChange: (open: boolean) => void;
}

const AuthModals = ({ isLoginOpen, isRegisterOpen, onLoginOpenChange, onRegisterOpenChange }: AuthModalsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginVerificationCode, setLoginVerificationCode] = useState("");
  const [isLoginCodeSent, setIsLoginCodeSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  
  // Register states
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerVerificationCode, setRegisterVerificationCode] = useState("");
  const [isRegCodeSent, setIsRegCodeSent] = useState(false);
  const [registerMethod, setRegisterMethod] = useState<"email" | "phone">("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset all form fields when modals open/close
  useEffect(() => {
    if (!isLoginOpen) {
      setLoginEmail("");
      setLoginPassword("");
      setLoginPhone("");
      setLoginVerificationCode("");
      setIsLoginCodeSent(false);
      setLoginMethod("email");
    }
    
    if (!isRegisterOpen) {
      setRegisterEmail("");
      setRegisterPhone("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setRegisterVerificationCode("");
      setIsRegCodeSent(false);
      setRegisterMethod("email");
    }
  }, [isLoginOpen, isRegisterOpen]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (loginMethod === "email") {
        // Email login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });
        
        if (error) throw error;
        
        toast({
          title: "Başarılı!",
          description: "Giriş yapıldı.",
        });
        
        onLoginOpenChange(false);
      } else {
        // Phone login
        if (!isLoginCodeSent) {
          // Send verification code
          const formattedPhone = formatPhoneNumber(loginPhone);
          const { error } = await supabase.auth.signInWithOtp({
            phone: formattedPhone,
          });
          
          if (error) throw error;
          
          setIsLoginCodeSent(true);
          toast({
            title: "Doğrulama kodu gönderildi",
            description: "Telefonunuza gönderilen kodu girin.",
          });
        } else {
          // Verify code
          const formattedPhone = formatPhoneNumber(loginPhone);
          const { error } = await supabase.auth.verifyOtp({
            phone: formattedPhone,
            token: loginVerificationCode,
            type: "sms",
            options: {
              data: {
                // Telefon ile giriş yapanların adı "Misafir Oyuncu" olsun
                first_name: "Misafir",
                last_name: "Oyuncu"
              }
            }
          });
          
          if (error) throw error;
          
          toast({
            title: "Başarılı!",
            description: "Giriş yapıldı.",
          });
          
          onLoginOpenChange(false);
        }
      }
    } catch (error: any) {
      toast({
        title: "Giriş hatası",
        description: error.message || "Giriş yapılırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (registerMethod === "email") {
        // Email registration
        if (registerPassword !== registerConfirmPassword) {
          toast({
            title: "Şifre hatası",
            description: "Şifreler eşleşmiyor.",
            variant: "destructive",
          });
          return;
        }
        
        const { data, error } = await supabase.auth.signUp({
          email: registerEmail,
          password: registerPassword,
          options: {
            data: {
              // Varsayılan kullanıcı adı: "Süper Oyuncu"
              first_name: "Süper",
              last_name: "Oyuncu"
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Kayıt başarılı!",
          description: "E-posta adresinize gönderilen bağlantıyı takip ederek kaydınızı tamamlayabilirsiniz.",
        });
        
        onRegisterOpenChange(false);
      } else {
        // Phone registration
        if (!isRegCodeSent) {
          // Send verification code for phone registration
          const formattedPhone = formatPhoneNumber(registerPhone);
          const { error } = await supabase.auth.signInWithOtp({
            phone: formattedPhone,
          });
          
          if (error) throw error;
          
          setIsRegCodeSent(true);
          toast({
            title: "Doğrulama kodu gönderildi",
            description: "Telefonunuza gönderilen kodu girin.",
          });
        } else {
          // Verify code and create account
          const formattedPhone = formatPhoneNumber(registerPhone);
          const { data, error } = await supabase.auth.verifyOtp({
            phone: formattedPhone,
            token: registerVerificationCode,
            type: "sms",
            options: {
              data: {
                // Varsayılan kullanıcı adı: "Misafir Oyuncu"
                first_name: "Misafir",
                last_name: "Oyuncu"
              }
            }
          });
          
          if (error) throw error;
          
          toast({
            title: "Kayıt başarılı!",
            description: "Süper Saha'ya hoş geldiniz.",
          });
          
          onRegisterOpenChange(false);
        }
      }
    } catch (error: any) {
      toast({
        title: "Kayıt hatası",
        description: error.message || "Kayıt olurken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetLoginPhoneVerification = () => {
    setIsLoginCodeSent(false);
    setLoginVerificationCode("");
  };
  
  const resetRegisterPhoneVerification = () => {
    setIsRegCodeSent(false);
    setRegisterVerificationCode("");
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={onLoginOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Giriş Yap</DialogTitle>
            <DialogDescription>
              Süper Saha'ya hoş geldiniz. Hesabınıza giriş yapın.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="email" className="w-full mt-4" onValueChange={(value) => setLoginMethod(value as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">E-posta</TabsTrigger>
              <TabsTrigger value="phone">Telefon</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">E-posta</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="loginEmail"
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Şifre</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="loginPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="phone" className="mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                {!isLoginCodeSent ? (
                  <div className="space-y-2">
                    <Label htmlFor="loginPhone">Telefon Numarası</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="loginPhone"
                        type="tel"
                        placeholder="05XX XXX XXXX"
                        className="pl-10"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 mr-2"
                        onClick={resetLoginPhoneVerification}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Geri
                      </Button>
                      <p className="text-sm">
                        <span className="font-medium">{formatPhoneNumber(loginPhone)}</span> numarasına kod gönderildi
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loginVerificationCode">Doğrulama Kodu</Label>
                      <Input
                        id="loginVerificationCode"
                        type="text"
                        placeholder="6 haneli doğrulama kodu"
                        value={loginVerificationCode}
                        onChange={(e) => setLoginVerificationCode(e.target.value)}
                        required
                        maxLength={6}
                      />
                    </div>
                  </>
                )}
                
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting
                      ? "İşleniyor..."
                      : isLoginCodeSent
                      ? "Doğrula ve Giriş Yap"
                      : "Kod Gönder"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Register Modal */}
      <Dialog open={isRegisterOpen} onOpenChange={onRegisterOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hesap Oluştur</DialogTitle>
            <DialogDescription>
              Süper Saha'ya katılmak için kaydolun.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="email" className="w-full mt-4" onValueChange={(value) => setRegisterMethod(value as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">E-posta</TabsTrigger>
              <TabsTrigger value="phone">Telefon</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="mt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">E-posta</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="pl-10"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Şifre</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerConfirmPassword">Şifre Tekrar</Label>
                  <Input
                    id="registerConfirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="phone" className="mt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                {!isRegCodeSent ? (
                  <div className="space-y-2">
                    <Label htmlFor="registerPhone">Telefon Numarası</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="registerPhone"
                        type="tel"
                        placeholder="05XX XXX XXXX"
                        className="pl-10"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 mr-2"
                        onClick={resetRegisterPhoneVerification}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Geri
                      </Button>
                      <p className="text-sm">
                        <span className="font-medium">{formatPhoneNumber(registerPhone)}</span> numarasına kod gönderildi
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="registerVerificationCode">Doğrulama Kodu</Label>
                      <Input
                        id="registerVerificationCode"
                        type="text"
                        placeholder="6 haneli doğrulama kodu"
                        value={registerVerificationCode}
                        onChange={(e) => setRegisterVerificationCode(e.target.value)}
                        required
                        maxLength={6}
                      />
                    </div>
                  </>
                )}
                
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting
                      ? "İşleniyor..."
                      : isRegCodeSent
                      ? "Doğrula ve Kayıt Ol"
                      : "Kod Gönder"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModals;
