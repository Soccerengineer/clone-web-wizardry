
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthModalsProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  onLoginClose: () => void;
  onRegisterClose: () => void;
}

const AuthModals = ({ isLoginOpen, isRegisterOpen, onLoginClose, onRegisterClose }: AuthModalsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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

  return (
    <>
      <Dialog open={isLoginOpen} onOpenChange={onLoginClose}>
        <DialogContent className="sm:max-w-md bg-[#0A1120] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">Giriş Yap</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div className="relative">
              <Input
                placeholder="E-posta"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
                required
              />
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Şifre"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
                required
              />
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <Button disabled={isLoading} type="submit" className="w-full bg-primary">
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
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
            <div className="relative">
              <Input
                type="email"
                placeholder="E-posta"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
                required
              />
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
            <Button disabled={isLoading} type="submit" className="w-full bg-primary">
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModals;
