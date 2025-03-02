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
    firstName: "",
    lastName: "",
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
        
        // Metadata veya profil veritabanından isim bilgilerini alın
        let firstName = "";
        let lastName = "";
        let nickname = "";
        
        try {
          // Önce profil tablosundan deneyin
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData) {
            firstName = profileData.first_name || "";
            lastName = profileData.last_name || "";
            nickname = profileData.nickname || "";
          } else {
            // Metadata'dan alın
            const metadata = session.user.user_metadata;
            if (metadata) {
              firstName = metadata.first_name || "";
              lastName = metadata.last_name || "";
              nickname = metadata.nickname || "";
            }
          }
        } catch (error) {
          console.error("Profil verileri yüklenirken hata oluştu:", error);
          // Hata durumunda metadata'dan almayı deneyin
          const metadata = session.user.user_metadata;
          if (metadata) {
            firstName = metadata.first_name || "";
            lastName = metadata.last_name || "";
            nickname = metadata.nickname || "";
          }
        }
        
        // Form verilerini ayarla
        setFormData({
          nickname: nickname || firstName.toLowerCase() || "superoyuncu",
          firstName,
          lastName,
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
      
      // User metadata'yı güncelle
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          nickname: formData.nickname,
          full_name: `${formData.firstName} ${formData.lastName}`.trim()
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
          // Profil tablosu varsa upsert yap (insert veya update)
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              nickname: formData.nickname,
              updated_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.warn("Profil güncellenemedi, muhtemelen tablo yok:", profileError.message);
            // Profil güncellenemedi ama metadata güncellendi, o yüzden başarılı sayalım
          }
        } catch (error) {
          console.warn("Profil tablosu erişimi başarısız, devam ediliyor:", error);
          // Profiles tablosu yoksa veya erişilemiyorsa, sadece metadata ile devam et
        }
      } else {
        // Profil tablosunu güncelle
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            nickname: formData.nickname,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);
        
        if (profileUpdateError) {
          console.warn("Profil güncellenemedi:", profileUpdateError.message);
        }
      }
      
      // Auth state değişikliğini zorlayarak UI'nin hemen güncellenmesini sağla
      const currentSession = await supabase.auth.getSession();
      if (currentSession.data.session) {
        // Session refresh et
        await supabase.auth.refreshSession();
        
        // Auth state değişikliği eventi tetikle
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'USER_UPDATED') {
            console.log('Kullanıcı güncellendi, UI yenileniyor');
          }
        });
      }
      
      toast({
        title: "Başarılı",
        description: "Profil bilgileriniz güncellendi."
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
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Ad</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Soyad</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                  disabled={loading}
                />
              </div>
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
