import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import SettingsLayout from "@/components/settings/SettingsLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Kullanıcı oturumunu kontrol et
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Oturum bulunamadı",
            description: "Lütfen giriş yapın.",
            variant: "destructive"
          });
          return;
        }
        
        // Kullanıcı e-posta adresini ve telefonunu alın
        const email = session.user.email || "";
        const phone = session.user.phone || "";
        
        // Nickname bilgilerini al
        let nickname = "";
        
        try {
          // Önce profil tablosundan deneyin
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('id', session.user.id)
            .single();
          
          if (profileData) {
            nickname = profileData.nickname || "";
          } else {
            // Metadata'dan alın
            const metadata = session.user.user_metadata;
            if (metadata) {
              nickname = metadata.nickname || "";
            }
          }
        } catch (error) {
          console.error("Profil verileri yüklenirken hata oluştu:", error);
          // Hata durumunda metadata'dan almayı deneyin
          const metadata = session.user.user_metadata;
          if (metadata) {
            nickname = metadata.nickname || "";
          }
        }
        
        // Form verilerini ayarla
        setFormData({
          nickname: nickname || session.user.id.substring(0, 8),
          email,
          phone,
        });
      } catch (error) {
        console.error("Kullanıcı verileri yüklenirken hata oluştu:", error);
        toast({
          title: "Hata",
          description: "Profil bilgileri yüklenirken bir sorun oluştu.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Oturum kontrolü
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Oturum bulunamadı",
          description: "Lütfen giriş yapın.",
          variant: "destructive"
        });
        return;
      }
      
      // User metadata'yı güncelle - sadece nickname değişiyor
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          nickname: formData.nickname
        }
      });
      
      if (metadataError) throw metadataError;
      
      // Profil tablosunda kayıt var mı kontrol et
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();
      
      // Eğer profiles tablosu varsa ve kullanıcı kaydı yoksa, yeni kayıt oluştur
      if (!existingProfile) {
        try {
          // Profil tablosu varsa nickname'i ekle
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              nickname: formData.nickname,
              updated_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.warn("Profil güncellenemedi, muhtemelen tablo yok:", profileError.message);
          }
        } catch (error) {
          console.warn("Profil tablosu erişimi başarısız, devam ediliyor:", error);
        }
      } else {
        // Profil tablosunu güncelle - sadece nickname değişiyor
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            nickname: formData.nickname,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);
        
        if (profileUpdateError) {
          console.warn("Profil güncellenemedi:", profileUpdateError.message);
        }
      }
      
      // Auth state değişikliğini zorla
      await supabase.auth.refreshSession();
      
      toast({
        title: "Başarılı",
        description: "Kullanıcı adınız güncellendi."
      });
      
      // Sayfayı yenileme - UI'ın hemen güncellenmesi için
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error("Profil güncellenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: error.message || "Profil bilgileri güncellenirken bir sorun oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsLayout>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Kullanıcı Adı</label>
              <Input
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                className="bg-white/5 border-white/10"
                disabled={loading}
                placeholder="Tercih ettiğiniz kullanıcı adını girin"
              />
              <p className="text-xs text-gray-500">Kullanıcı adınız tüm sistemde görünecektir</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">E-posta</label>
              <Input
                type="email"
                value={formData.email}
                disabled={true}
                className="bg-white/5 border-white/10 opacity-70"
              />
              <p className="text-xs text-gray-500">E-posta adresi değiştirilemez</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Telefon</label>
              <Input
                type="tel"
                value={formData.phone}
                disabled={true}
                className="bg-white/5 border-white/10 opacity-70"
              />
              <p className="text-xs text-gray-500">Telefon numarası değiştirilemez</p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default Profile;
