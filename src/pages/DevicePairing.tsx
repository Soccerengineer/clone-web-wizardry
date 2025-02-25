import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2 } from "lucide-react";
import { deviceService } from "@/services/supabase.service";

// Pozisyonlar için tip
type Position = "forvet" | "ikinci_forvet" | "orta_saha" | "sag_bek" | "sol_bek" | "stoper";
// Takım tipi
type Team = "ev_sahibi" | "misafir";

const DevicePairing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Adım takibi
  const [step, setStep] = useState<number>(1);
  
  // Form değerleri
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<Position | "">("");
  const [selectedTeam, setSelectedTeam] = useState<Team | "">("");
  const [suggestedDeviceId, setSuggestedDeviceId] = useState<number | null>(null);
  
  // İşlem durumları
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGuestUser, setIsGuestUser] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Kullanıcı bilgileri için state
  const [userName, setUserName] = useState<string>('Kullanıcı');
  const [identifierLabel, setIdentifierLabel] = useState<string>('Kullanıcı:');
  const [identifierValue, setIdentifierValue] = useState<string>('-');
  
  // Giriş kontrolü
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      // localStorage'da misafir durumunu kontrol et (yeni localStorage anahtarıyla)
      const guestUserJSON = localStorage.getItem('guestUser');
      const guestUser = guestUserJSON ? JSON.parse(guestUserJSON) : null;
      
      // Kullanıcı bilgilerini kaydet
      const isGuest = guestUser && guestUser.isGuest;
      setIsGuestUser(isGuest);
      setUserId(data.session?.user.id || null);
      
      // Kullanıcı tipine göre identifier bilgilerini ayarla
      if (isGuest) {
        setIdentifierLabel('Misafir:');
        setIdentifierValue('Misafir');  // Telefon numarası yerine sadece "Misafir" yazacak
      } else if (data.session?.user.id) {
        setIdentifierLabel('Kullanıcı:');
        fetchUserInfo(data.session.user.id);
      } else {
        setIdentifierLabel('Kullanıcı:');
        setIdentifierValue('-');
      }
      
      // Supabase oturumu yoksa ve misafir değilse yönlendir
      if (!data.session && !guestUser) {
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Kullanıcı bilgilerini getir
  const fetchUserInfo = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();
        
      if (profile) {
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
        setUserName(fullName || 'Kullanıcı');
        setIdentifierValue(fullName || 'Kullanıcı');
      } else {
        setIdentifierValue('Kullanıcı');
      }
    } catch (error) {
      console.error('Profil bilgisi alınamadı:', error);
      setIdentifierValue('Kullanıcı');
    }
  };
  
  // Kullanılabilir saatler (örnek)
  const availableTimes = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];
  
  // Kullanılabilir pozisyonlar
  const positions: { value: Position; label: string }[] = [
    { value: "forvet", label: "Forvet" },
    { value: "ikinci_forvet", label: "İkinci Forvet" },
    { value: "orta_saha", label: "Orta Saha" },
    { value: "sag_bek", label: "Sağ Bek" },
    { value: "sol_bek", label: "Sol Bek" },
    { value: "stoper", label: "Stoper" }
  ];
  
  // Takımlar
  const teams: { value: Team; label: string }[] = [
    { value: "ev_sahibi", label: "Ev Sahibi" },
    { value: "misafir", label: "Misafir" }
  ];
  
  // Takım seçildiğinde Supabase'den boş cihaz numarası al
  useEffect(() => {
    const getAvailableDevice = async () => {
      if (selectedTeam && selectedTime) {
        setIsProcessing(true);
        
        try {
          // Supabase'den müsait cihaz ID'si önerisi al
          const { data: availableDeviceId, error } = await deviceService.suggestAvailableDeviceId(
            selectedTime, 
            selectedTeam
          );
          
          if (error) {
            toast({
              title: "Hata",
              description: error.message,
              variant: "destructive"
            });
            
            // Takım seçimini sıfırla
            setSelectedTeam("");
            return;
          }
          
          // Önerilen cihaz ID'sini kaydet
          setSuggestedDeviceId(availableDeviceId);
          
        } catch (err) {
          console.error("Müsait cihaz alınırken hata:", err);
          toast({
            title: "Hata",
            description: "Müsait cihaz kontrolü sırasında bir hata oluştu.",
            variant: "destructive"
          });
          
          // Takım seçimini sıfırla
          setSelectedTeam("");
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    getAvailableDevice();
  }, [selectedTeam, selectedTime, toast]);
  
  // Sonraki adıma geçme
  const handleNext = () => {
    // Geçerli adımın validasyonu
    if (step === 1 && !selectedTime) {
      toast({ title: "Uyarı", description: "Lütfen bir saat seçin.", variant: "destructive" });
      return;
    } else if (step === 2 && !selectedPosition) {
      toast({ title: "Uyarı", description: "Lütfen bir pozisyon seçin.", variant: "destructive" });
      return;
    } else if (step === 3 && !selectedTeam) {
      toast({ title: "Uyarı", description: "Lütfen bir takım seçin.", variant: "destructive" });
      return;
    }
    
    // Adımı ilerlet
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Eşleştirme işlemini tamamla
      completeDevicePairing();
    }
  };
  
  // Önceki adıma dönme
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Eşleştirmeyi tamamlama
  const completeDevicePairing = async () => {
    setIsProcessing(true);
    
    try {
      // Eğer önerilen bir cihaz ID'si yoksa hata göster
      if (suggestedDeviceId === null) {
        toast({ 
          title: "Hata", 
          description: "Cihaz numarası atanamadı. Lütfen farklı bir saat veya takım seçin.", 
          variant: "destructive" 
        });
        return;
      }
      
      // Cihaz eşleştirme verilerini hazırla
      const pairingData: any = {
        selected_time: selectedTime,
        selected_position: selectedPosition,
        selected_team: selectedTeam,
        device_id: suggestedDeviceId
      };
      
      // Kullanıcı tipine göre veri hazırla
      if (isGuestUser) {
        // Misafir kullanıcı bilgilerini localStorage'dan al
        const guestUserJSON = localStorage.getItem('guestUser');
        const guestUser = guestUserJSON ? JSON.parse(guestUserJSON) : null;
        
        // Telefon numarasını guest_identifier olarak kullan
        if (guestUser && guestUser.phone) {
          // guest_identifier'ı telefon numarası olarak ayarla
          pairingData.is_guest = true;
          pairingData.guest_identifier = guestUser.phone;
        } else {
          // Eğer telefon numarası yoksa rastgele kimlik oluştur
          const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          pairingData.is_guest = true;
          pairingData.guest_identifier = guestId;
        }
        
        // Misafir kullanıcılar için player_id alanını NULL olarak bırakacağız
        // NOT: Supabase migration ile tabloyu güncelleyin veya RLS politikalarınızı düzenleyin
      } else if (userId) {
        // Gerçek kullanıcı için player_id ekle
        pairingData.player_id = userId;
      } else {
        throw new Error("Kullanıcı kimliği bulunamadı");
      }
      
      console.log("Kaydedilecek veri:", pairingData);
      
      // Misafir kullanıcı için direkt SQL sorgusu kullanarak kaydet
      if (isGuestUser) {
        // Misafir kullanıcılar için özel sorgu kullan (player_id olmadan)
        const { data, error } = await supabase.rpc('create_guest_device_pairing', {
          p_selected_time: pairingData.selected_time,
          p_selected_position: pairingData.selected_position,
          p_selected_team: pairingData.selected_team,
          p_device_id: pairingData.device_id,
          p_is_guest: true,
          p_guest_identifier: pairingData.guest_identifier
        });
        
        if (error) {
          console.error("RPC hatası:", error);
          throw error;
        }
      } else {
        // Normal kullanıcılar için standart insert kullan
        const { data, error } = await deviceService.createDevicePairing(pairingData);
        
        if (error) {
          // Eğer cihaz zaten alınmışsa yeni bir cihaz öner
          if (error.code === '23505') { // Unique constraint violation
            toast({ 
              title: "Uyarı", 
              description: "Bu cihaz başkası tarafından alındı. Yeni bir cihaz öneriliyor...",
              variant: "destructive" 
            });
            
            // Takım seçimini sıfırla ve tekrar cihaz önerisi al
            setSelectedTeam("");
            return;
          } else {
            console.error("Supabase hatası:", error);
            throw error;
          }
        }
      }
      
      // Başarılı mesajı göster
      toast({ 
        title: "Başarılı", 
        description: `Rezervasyonunuz tamamlandı! Cihaz #${suggestedDeviceId} atandı.` 
      });
      
      // Tamamlandı durumunu güncelle
      setIsCompleted(true);
      
    } catch (error: any) {
      console.error("Eşleştirme tamamlanırken hata:", error);
      toast({
        title: "Hata",
        description: error.message || "Eşleştirme sırasında bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Ana sayfaya dönme
  const handleGoHome = () => {
    navigate('/');
  };
  
  // İlerleme durumu
  const renderProgress = () => {
    return (
      <div className="flex mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div 
              className={`rounded-full h-10 w-10 flex items-center justify-center
                        ${s === step ? 'bg-primary text-white' : 
                          s < step ? 'bg-primary/80 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {s}
            </div>
            {s < 4 && (
              <div 
                className={`h-1 w-10 ${s < step ? 'bg-primary/80' : 'bg-gray-300'}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // Adım içeriği
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardTitle className="text-xl mb-2">Saat Seçimi</CardTitle>
            <CardDescription className="mb-6">Lütfen oynamak istediğiniz saati seçin</CardDescription>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-full bg-white/5 border-white/20">
                <SelectValue placeholder="Saat seçin" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        );
      
      case 2:
        return (
          <>
            <CardTitle className="text-xl mb-2">Pozisyon Seçimi</CardTitle>
            <CardDescription className="mb-6">Oynamak istediğiniz pozisyonu seçin</CardDescription>
            <Select value={selectedPosition} onValueChange={(value) => setSelectedPosition(value as Position)}>
              <SelectTrigger className="w-full bg-white/5 border-white/20">
                <SelectValue placeholder="Pozisyon seçin" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        );
      
      case 3:
        return (
          <>
            <CardTitle className="text-xl mb-2">Takım Seçimi</CardTitle>
            <CardDescription className="mb-6">Hangi takımda oynamak istiyorsunuz?</CardDescription>
            <Select value={selectedTeam} onValueChange={(value) => setSelectedTeam(value as Team)}>
              <SelectTrigger className="w-full bg-white/5 border-white/20" disabled={isProcessing}>
                <SelectValue placeholder="Takım seçin" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.value} value={team.value}>{team.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isProcessing && (
              <div className="flex justify-center mt-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-gray-400">Uygun cihazlar kontrol ediliyor...</span>
              </div>
            )}
          </>
        );
      
      case 4:
        if (isCompleted) {
          return (
            <>
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <CardTitle className="text-xl mb-3">Rezervasyonunuz Tamamlandı!</CardTitle>
                <CardDescription className="mb-8 text-base">
                  Cihazınızı görevliden teslim alıp maça başlayabilirsiniz.
                </CardDescription>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="font-medium">Saat:</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="font-medium">Pozisyon:</span>
                  <span>{positions.find(p => p.value === selectedPosition)?.label}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="font-medium">Takım:</span>
                  <span>{teams.find(t => t.value === selectedTeam)?.label}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="font-medium">{identifierLabel}</span>
                  <span>{identifierValue}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="font-medium">Atanan Cihaz:</span>
                  <span className="font-semibold text-green-400">#{suggestedDeviceId}</span>
                </div>
              </div>
            </>
          );
        } else {
          return (
            <>
              <CardTitle className="text-xl mb-2">Cihaz Bilgileri</CardTitle>
              <CardDescription className="mb-6">
                {selectedTeam === "ev_sahibi" 
                  ? "Ev sahibi takım için size atanan cihaz:" 
                  : "Misafir takım için size atanan cihaz:"}
              </CardDescription>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
                <div className="flex justify-between border-b border-white/10 pb-2 mb-2">
                  <span className="font-medium">{identifierLabel}</span>
                  <span>{identifierValue}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center my-6">
                <div className="bg-primary/10 border border-primary/30 rounded-lg px-10 py-6 text-center">
                  <div className="text-lg text-gray-300 mb-2">Cihaz Numarası</div>
                  <div className="text-4xl font-bold text-primary">#{suggestedDeviceId}</div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-400 mt-4">
                Bu cihaz numarası, seçimleriniz ile ilişkilendirilmiştir.
              </div>
            </>
          );
        }
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0A1120]">
      <div className="border-b border-white/10">
        <Navbar />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">Cihaz Eşleştirme</h1>
        
        <Card className="max-w-xl mx-auto bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="pb-0">
            {!isCompleted && renderProgress()}
          </CardHeader>
          
          <CardContent className="pt-6">
            {renderStepContent()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {isCompleted ? (
              <Button 
                className="w-full"
                onClick={handleGoHome}
              >
                Ana Sayfaya Dön
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1 || isProcessing}
                  className="bg-white/5 border-white/20 text-white"
                >
                  Geri
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    step < 4 ? "İleri" : "Tamamla"
                  )}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DevicePairing;
