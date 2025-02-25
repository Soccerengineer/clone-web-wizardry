import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, AlertCircle, Phone, ArrowLeft, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AuthModalsProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  onLoginClose: () => void;
  onRegisterClose: () => void;
}

const AuthModals = ({ isLoginOpen, isRegisterOpen, onLoginClose, onRegisterClose }: AuthModalsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [usePhoneLogin, setUsePhoneLogin] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [usePhone, setUsePhone] = useState(false);

  // Telefon güvenlik bilgisi için tooltip içeriği
  const phoneSecurityInfo = "Telefon numaranız 3. kişilerle paylaşılmayacaktır ve SSL güvenlik sertifikası ile korunmaktadır.";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!usePhoneLogin) {
        // E-posta ile giriş
        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (error) throw error;

        toast({
          title: "Giriş başarılı!",
          description: "Süper Saha'ya hoş geldiniz.",
        });
        onLoginClose();
      } else if (!showVerificationInput) {
        // Telefon doğrulama kodu gönder
        const { error } = await supabase.auth.signInWithOtp({
          phone: loginPhone,
        });

        if (error) throw error;

        setShowVerificationInput(true);
        toast({
          title: "Doğrulama kodu gönderildi",
          description: "Telefonunuza gelen doğrulama kodunu giriniz.",
        });
      } else {
        // Gelen kodu doğrula
        const { error } = await supabase.auth.verifyOtp({
          phone: loginPhone,
          token: verificationCode,
          type: 'sms',
        });

        if (error) throw error;

        toast({
          title: "Giriş başarılı!",
          description: "Süper Saha'ya hoş geldiniz.",
        });
        onLoginClose();
      }
    } catch (error: any) {
      toast({
        title: "Giriş başarısız",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Şifre doğrulama kontrolü
    if (registerPassword !== registerPasswordConfirm) {
      toast({
        title: "Kayıt başarısız",
        description: "Şifreler eşleşmiyor. Lütfen kontrol ediniz.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const [firstName, ...lastNameParts] = registerName.split(" ");
    const lastName = lastNameParts.join(" ");

    try {
      const { error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName || "",
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Kayıt başarılı!",
        description: "Lütfen e-posta adresinizi doğrulayın.",
      });
      onRegisterClose();
    } catch (error: any) {
      toast({
        title: "Kayıt başarısız",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPhoneLogin = () => {
    setShowVerificationInput(false);
    setVerificationCode("");
  };

  const renderLoginForm = () => {
    if (usePhoneLogin && showVerificationInput) {
      // Doğrulama kodu girişi
      return (
        <>
          <div className="flex items-center mb-4">
            <Button 
              type="button" 
              variant="ghost" 
              className="p-0 mr-2 text-white hover:text-primary" 
              onClick={resetPhoneLogin}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <p className="text-white text-sm">
              <span className="font-medium">{loginPhone}</span> numaralı telefona doğrulama kodu gönderildi
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
          <Button disabled={isLoading} type="submit" className="w-full bg-primary hover:bg-primary/90">
            {isLoading ? "Doğrulanıyor..." : "Doğrula ve Giriş Yap"}
          </Button>
        </>
      );
    }

    return (
      <>
        <div className="flex flex-wrap sm:flex-nowrap mb-4">
          <select 
            className="bg-white/90 border-r-0 border-white/20 text-black font-medium rounded-l-md px-3 py-2 w-full sm:w-auto"
            value={usePhoneLogin ? "phone" : "email"}
            onChange={(e) => setUsePhoneLogin(e.target.value === "phone")}
          >
            <option value="email" className="text-black font-medium">E-posta</option>
            <option value="phone" className="text-black font-medium">Telefon</option>
          </select>
          
          {!usePhoneLogin ? (
            <div className="relative flex-1 w-full sm:w-auto mt-2 sm:mt-0">
              <Input
                placeholder="E-posta"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white sm:rounded-l-none w-full"
                required={!usePhoneLogin}
              />
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          ) : (
            <div className="relative flex-1 w-full sm:w-auto mt-2 sm:mt-0">
              <Input
                placeholder="Telefon Numarası"
                type="tel"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white sm:rounded-l-none w-full"
                required={usePhoneLogin}
              />
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
        
        {!usePhoneLogin && (
          <div className="relative mb-4">
            <Input
              type="password"
              placeholder="Şifre"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
              required={!usePhoneLogin}
            />
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <Button disabled={isLoading} type="submit" className="w-full bg-primary hover:bg-primary/90">
          {isLoading ? "Giriş yapılıyor..." : usePhoneLogin ? "Kod Gönder" : "Giriş Yap"}
        </Button>
      </>
    );
  };

  return (
    <>
      <Dialog open={isLoginOpen} onOpenChange={onLoginClose}>
        <DialogContent className="sm:max-w-md bg-[#0A1120] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">Giriş Yap</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            {renderLoginForm()}
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={onRegisterClose}>
        <DialogContent className="sm:max-w-md bg-[#0A1120] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">Kayıt Ol</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4 py-4">
            <div className="relative">
              <Input
                placeholder="Ad Soyad"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
                required
              />
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap sm:flex-nowrap">
                <select 
                  className="bg-white/90 border-r-0 border-white/20 text-black font-medium rounded-l-md px-3 py-2 w-full sm:w-auto"
                  value={usePhone ? "phone" : "email"}
                  onChange={(e) => setUsePhone(e.target.value === "phone")}
                >
                  <option value="email" className="text-black font-medium">E-posta</option>
                  <option value="phone" className="text-black font-medium">Telefon</option>
                </select>
                {!usePhone ? (
                  <div className="relative flex-1 w-full sm:w-auto mt-2 sm:mt-0">
                    <Input
                      type="email"
                      placeholder="E-posta adresiniz"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white sm:rounded-l-none w-full"
                      required={!usePhone}
                    />
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                ) : (
                  <div className="relative flex-1 w-full sm:w-auto mt-2 sm:mt-0">
                    <Input
                      type="tel"
                      placeholder="Telefon numaranız"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white sm:rounded-l-none pr-10 w-full"
                      required={usePhone}
                    />
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative">
              <Input
                type="password"
                placeholder="Şifre"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
                required
              />
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="relative">
              <Input
                type="password"
                placeholder="Şifre Tekrarı"
                value={registerPasswordConfirm}
                onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
                required
              />
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            
            <Button disabled={isLoading} type="submit" className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModals;
