
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, LogIn } from "lucide-react";

interface GameStartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameStartModal = ({ isOpen, onClose }: GameStartModalProps) => {
  const handleEmailLogin = () => {
    // Email login logic will be implemented
    console.log("Email login clicked");
  };

  const handlePhoneLogin = () => {
    // Phone login logic will be implemented
    console.log("Phone login clicked");
  };

  const handleUsernameLogin = () => {
    // Username/password login logic will be implemented
    console.log("Username login clicked");
  };

  const handleContinueAsGuest = () => {
    // Guest login logic will be implemented
    console.log("Continue as guest clicked");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#0A1120] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center mb-4">
            Nasıl Devam Etmek İstersiniz?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant="outline"
            className="w-full p-6 text-lg flex gap-3 bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={handleEmailLogin}
          >
            <Mail className="h-6 w-6" />
            Email ile Giriş Yap
          </Button>
          <Button
            variant="outline"
            className="w-full p-6 text-lg flex gap-3 bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={handlePhoneLogin}
          >
            <Phone className="h-6 w-6" />
            Telefon ile Giriş Yap
          </Button>
          <Button
            variant="outline"
            className="w-full p-6 text-lg flex gap-3 bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={handleUsernameLogin}
          >
            <User className="h-6 w-6" />
            Kullanıcı Adı ve Şifre ile Giriş Yap
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
      </DialogContent>
    </Dialog>
  );
};

export default GameStartModal;
