import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/controllers/auth.controller";
import { Loader2, WifiOff, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function ConnectionError() {
  const { error, checkConnection } = useAuth();
  const [isChecking, setIsChecking] = useState(false);

  // Bağlantıyı yeniden kontrol etme işlevi
  const handleRetry = async () => {
    setIsChecking(true);
    try {
      const isConnected = await checkConnection();
      if (isConnected) {
        // Bağlantı başarılı ise sayfayı yenile
        window.location.reload();
      }
    } catch (err) {
      console.error("Bağlantı yeniden denenirken hata oluştu:", err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <WifiOff className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-xl">Bağlantı Hatası</CardTitle>
          <CardDescription>
            Supabase sunucusuna bağlanırken bir sorun oluştu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            <p className="font-medium">Hata Detayları:</p>
            <p className="text-sm mt-1">{error || "Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin."}</p>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              Bağlantı sorununu çözmek için şunları deneyebilirsiniz:
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>İnternet bağlantınızı kontrol edin</li>
              <li>Tarayıcınızı yeniden başlatın</li>
              <li>Başka bir tarayıcı deneyin</li>
              <li>Sayfayı yenilemek için aşağıdaki yeniden dene butonuna tıklayın</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Geri Dön
          </Button>
          <Button onClick={handleRetry} disabled={isChecking}>
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kontrol Ediliyor
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Yeniden Dene
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 