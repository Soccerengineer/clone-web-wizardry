
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, User, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationMethod, setRegistrationMethod] = useState<'email' | 'phone' | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/device-pairing');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/device-pairing');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Registration form state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleEmailRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCodeSent) {
      try {
        setIsCodeSent(true);
        toast({
          title: "Başarılı!",
          description: "Email adresinize doğrulama kodu gönderildi.",
        });
      } catch (error: any) {
        toast({
          title: "Hata",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      try {
        toast({
          title: "Başarılı!",
          description: "Doğrulama başarılı. Yönlendiriliyorsunuz...",
        });
        navigate('/device-pairing');
      } catch (error: any) {
        toast({
          title: "Hata",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handlePhoneRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeSent) {
      try {
        setIsCodeSent(true);
        toast({
          title: "Başarılı!",
          description: "Telefonunuza doğrulama kodu gönderildi.",
        });
      } catch (error: any) {
        toast({
          title: "Hata",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      try {
        toast({
          title: "Başarılı!",
          description: "Doğrulama başarılı. Yönlendiriliyorsunuz...",
        });
        navigate('/device-pairing');
      } catch (error: any) {
        toast({
          title: "Hata",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleContinueAsGuest = () => {
    navigate('/overview');
  };

  return (
    <div className="min-h-screen bg-[#0A1120]">
      <div className="border-b border-white/10">
        <Navbar />
      </div>
      
      <div className="flex items-center justify-center p-4 pt-20">
        {!registrationMethod ? (
          <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h1 className="text-2xl font-bold text-white text-center mb-8">
              Nasıl Devam Etmek İstersiniz?
            </h1>
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full p-6 text-lg flex gap-3 bg-white/5 border-white/20 text-white hover:bg-white/10"
                onClick={() => setRegistrationMethod('email')}
              >
                <Mail className="h-6 w-6" />
                Email ile Devam Et
              </Button>
              <Button
                variant="outline"
                className="w-full p-6 text-lg flex gap-3 bg-white/5 border-white/20 text-white hover:bg-white/10"
                onClick={() => setRegistrationMethod('phone')}
              >
                <Phone className="h-6 w-6" />
                Telefon ile Devam Et
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
                onClick={handleContinueAsGuest}
              >
                <LogIn className="h-6 w-6" />
                Üye Olmadan Devam Et
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <div className="mb-6">
              <Button
                variant="ghost"
                className="text-white mb-4"
                onClick={() => {
                  setRegistrationMethod(null);
                  setIsCodeSent(false);
                  setVerificationCode("");
                }}
              >
                ← Geri
              </Button>
              <h1 className="text-2xl font-bold text-white text-center">
                {registrationMethod === 'email' ? 'Email ile Devam Et' : 'Telefon ile Devam Et'}
              </h1>
            </div>

            <form onSubmit={registrationMethod === 'email' ? handleEmailRegistration : handlePhoneRegistration} className="space-y-4">
              {registrationMethod === 'email' ? (
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email Adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    required
                    disabled={isCodeSent}
                  />
                  {isCodeSent && (
                    <Input
                      type="text"
                      placeholder="Doğrulama Kodu"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      required
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    type="tel"
                    placeholder="Telefon Numarası"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    required
                    disabled={isCodeSent}
                  />
                  {isCodeSent && (
                    <Input
                      type="text"
                      placeholder="Doğrulama Kodu"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      required
                    />
                  )}
                </div>
              )}
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {isCodeSent ? 'Doğrula' : 'Kod Gönder'}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Auth;
