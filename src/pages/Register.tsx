import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  // E-posta ile kayıt formu
  const [emailFormData, setEmailFormData] = useState({
    display_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Telefon ile kayıt formu
  const [phoneFormData, setPhoneFormData] = useState({
    display_name: "",
    phone: ""
  });

  // Telefon numarasını formatla
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
      phoneNumber = `+90${phoneNumber}`;
    }
    
    return phoneNumber;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Şifre kontrolü
      if (emailFormData.password !== emailFormData.confirmPassword) {
        toast({
          title: "Hata",
          description: "Şifreler eşleşmiyor.",
          variant: "destructive"
        });
        return;
      }

      // Kayıt işlemi
      const { data, error } = await supabase.auth.signUp({
        email: emailFormData.email,
        password: emailFormData.password,
        options: {
          data: {
            display_name: emailFormData.display_name
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Başarılı!",
        description: "Kayıt işlemi tamamlandı. Lütfen e-posta adresinizi doğrulayın.",
      });

      // Ana sayfaya yönlendir
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Kayıt Hatası",
        description: error.message || "Kayıt olurken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isCodeSent) {
        // Telefon doğrulama kodu gönder
        const formattedPhone = formatPhoneNumber(phoneFormData.phone);
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: {
            shouldCreateUser: true,
            data: {
              display_name: phoneFormData.display_name
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
        const formattedPhone = formatPhoneNumber(phoneFormData.phone);
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: verificationCode,
          type: 'sms'
        });
        
        if (error) throw error;
        
        toast({
          title: "Başarılı!",
          description: "Kayıt işlemi tamamlandı.",
        });
        
        // Ana sayfaya yönlendir
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Kayıt Hatası",
        description: error.message || "Kayıt olurken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPhoneVerification = () => {
    setIsCodeSent(false);
    setVerificationCode("");
  };

  return (
    <div className="min-h-screen bg-[#0A1120] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full mx-auto mb-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">Süper Saha'ya Katılın</h1>
          <p className="text-gray-400 text-center mb-8">Hesabınızı oluşturarak tüm özelliklere erişin</p>
        </div>

        <Card className="bg-white/5 border-white/10 w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Hesap Oluştur</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">E-posta ile Kayıt</TabsTrigger>
                <TabsTrigger value="phone">Telefon ile Kayıt</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Kullanıcı Adı</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Kullanıcı adınız"
                        value={emailFormData.display_name}
                        onChange={(e) => setEmailFormData({ ...emailFormData, display_name: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        required
                      />
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">E-posta</label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="E-posta adresiniz"
                        value={emailFormData.email}
                        onChange={(e) => setEmailFormData({ ...emailFormData, email: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        required
                      />
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Şifre</label>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={emailFormData.password}
                        onChange={(e) => setEmailFormData({ ...emailFormData, password: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        required
                      />
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Şifre Tekrar</label>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={emailFormData.confirmPassword}
                        onChange={(e) => setEmailFormData({ ...emailFormData, confirmPassword: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        required
                      />
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Kullanıcı Adı</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Kullanıcı adınız"
                        value={phoneFormData.display_name}
                        onChange={(e) => setPhoneFormData({ ...phoneFormData, display_name: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        required
                      />
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {!isCodeSent ? (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Telefon Numarası</label>
                      <div className="relative">
                        <Input
                          type="tel"
                          placeholder="Telefon numaranız"
                          value={phoneFormData.phone}
                          onChange={(e) => setPhoneFormData({ ...phoneFormData, phone: e.target.value })}
                          className="pl-10 bg-white/5 border-white/10 text-white"
                          required
                        />
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      </div>
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
                          <span className="font-medium text-white">{formatPhoneNumber(phoneFormData.phone)}</span> numarasına doğrulama kodu gönderildi
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Doğrulama Kodu</label>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Doğrulama kodunu girin"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white"
                            required
                          />
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? "İşleniyor..." : isCodeSent ? "Doğrula ve Kayıt Ol" : "Kod Gönder"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register; 