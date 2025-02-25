
import { useState } from "react";
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
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  
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
  
  // Cihaz numaraları
  const getAvailableDevices = (): number[] => {
    if (selectedTeam === "ev_sahibi") {
      return [1, 2, 3, 4, 5, 6, 7];
    } else if (selectedTeam === "misafir") {
      return [8, 9, 10, 11, 12, 13, 14];
    }
    return [];
  };
  
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
    } else if (step === 4 && !selectedDevice) {
      toast({ title: "Uyarı", description: "Lütfen bir cihaz numarası seçin.", variant: "destructive" });
      return;
    }
    
    // Adımı ilerlet
    if (step < 5) {
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
        description: `Eşleştirme tamamlandı! Cihaz #${selectedDevice} seçildi.` 
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
            <CardTitle className="text-xl mb-2">Cihaz Seçimi</CardTitle>
            <CardDescription className="mb-6">
              {selectedTeam === "ev_sahibi" 
                ? "Ev sahibi takım için 1-7 arası cihazlar kullanılabilir." 
                : "Misafir takım için 8-14 arası cihazlar kullanılabilir."}
            </CardDescription>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getAvailableDevices().map((device) => (
                <Button
                  key={device}
                  variant={selectedDevice === device ? "default" : "outline"}
                  className={`h-16 text-lg ${selectedDevice === device ? "" : "bg-white/5 border-white/20"}`}
                  onClick={() => setSelectedDevice(device)}
                >
                  {device}
                </Button>
              ))}
            </div>
          </>
        );
      
      case 5:
        return (
          <>
            <CardTitle className="text-xl mb-6">Eşleştirme Özeti</CardTitle>
            <div className="space-y-3">
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
                <span className="font-medium">Cihaz Numarası:</span>
                <span>#{selectedDevice}</span>
              </div>
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
              {step < 5 ? "İleri" : "Tamamla"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DevicePairing;
