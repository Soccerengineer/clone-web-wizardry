
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";

interface AuthModalsProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  onLoginClose: () => void;
  onRegisterClose: () => void;
}

const AuthModals = ({ isLoginOpen, isRegisterOpen, onLoginClose, onRegisterClose }: AuthModalsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Dialog open={isLoginOpen} onOpenChange={onLoginClose}>
        <DialogContent className="sm:max-w-md bg-[#0A1120] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">Giriş Yap</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Input
                placeholder="E-posta"
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Şifre"
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <Button disabled={isLoading} className="w-full bg-primary">
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={onRegisterClose}>
        <DialogContent className="sm:max-w-md bg-[#0A1120] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">Kayıt Ol</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Input
                placeholder="Ad Soyad"
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                placeholder="E-posta"
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Şifre"
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <Button disabled={isLoading} className="w-full bg-primary">
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModals;
