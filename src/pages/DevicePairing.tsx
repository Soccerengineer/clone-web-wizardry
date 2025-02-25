
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

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
  
  // Giriş kontrolü
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);
  
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
  
  // Takım seçildiğinde otomatik cihaz numarası atama
  useEffect(() => {
    if (selectedTeam) {
      // Gerçek uygulamada, bu kısım API ile boş cihaz numaralarını sorgulayabilir
      const deviceIdRange = selectedTeam === "ev_sahibi" ? [1, 2, 3, 4, 5, 6, 7] : [8, 9, 10, 11, 12, 13, 14];
      
      // Basit bir örnek - normalde boş olan cihazları kontrol edersiniz
      const randomIndex = Math.floor(Math.random() * deviceIdRange.length);
      setSuggestedDeviceId(deviceIdRange[randomIndex]);
    }
  }, [selectedTeam]);
  
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
    try {
      // Kullanıcı bilgilerini al
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      
      if (!userId) {
        toast({ 
          title: "Hata", 
          description: "Kullanıcı girişi yapılmamış. Lütfen giriş yapın.", 
          variant: "destructive" 
        });
        navigate('/auth');
        return;
      }
      
      // Eşleştirme bilgilerini kaydet
      // Not: Bu kısım gerçek API entegrasyonuna göre düzenlenmelidir
      const { error } = await supabase
        .from('player_stats')
        .insert({
          player_id: userId,
          position: selectedPosition === "ikinci_forvet" ? "forward" : 
                   selectedPosition === "orta_saha" ? "midfielder" :
                   selectedPosition === "sag_bek" || selectedPosition === "sol_bek" || selectedPosition === "stoper" ? "defender" : "forward",
          // Diğer gerekli alanlar burada eklenebilir
        });
      
      if (error) throw error;
      
      toast({ 
        title: "Başarılı", 
        description: `Eşleştirme tamamlandı! Cihaz #${suggestedDeviceId} atandı.` 
      });
      
      // Ana sayfaya yönlendir
      navigate('/overview');
    } catch (error: any) {
      toast({ 
        title: "Hata", 
        description: error.message || "Eşleştirme sırasında bir hata oluştu.", 
        variant: "destructive" 
      });
    }
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
              <SelectTrigger className="w-full bg-white/5 border-white/20">
                <SelectValue placeholder="Takım seçin" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.value} value={team.value}>{team.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        );
      
      case 4:
        return (
          <>
            <CardTitle className="text-xl mb-2">Cihaz Bilgileri</CardTitle>
            <CardDescription className="mb-6">
              {selectedTeam === "ev_sahibi" 
                ? "Ev sahibi takım için size atanan cihaz:" 
                : "Misafir takım için size atanan cihaz:"}
            </CardDescription>
            
            <div className="flex items-center justify-center my-8">
              <div className="bg-primary/10 border border-primary/30 rounded-lg px-10 py-6 text-center">
                <div className="text-lg text-gray-300 mb-2">Cihaz Numarası</div>
                <div className="text-4xl font-bold text-primary">#{suggestedDeviceId}</div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-400 mt-4">
              Bu cihaz numarası otomatik olarak atanmıştır. Lütfen eşleştirme öncesi kontrol ediniz.
            </div>
          </>
        );
      
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
            {renderProgress()}
          </CardHeader>
          
          <CardContent className="pt-6">
            {renderStepContent()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="bg-white/5 border-white/20 text-white"
            >
              Geri
            </Button>
            <Button 
              onClick={handleNext}
            >
              {step < 4 ? "İleri" : "Tamamla"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DevicePairing;
