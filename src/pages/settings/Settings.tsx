
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import SettingsLayout from "@/components/settings/SettingsLayout";

const Settings = () => {
  return (
    <SettingsLayout>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Genel Ayarlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-white">E-posta Bildirimleri</div>
              <div className="text-sm text-gray-400">
                Yeni maç ve etkinlikler hakkında bildirim al
              </div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-white">
                Konum Servisleri
              </div>
              <div className="text-sm text-gray-400">
                Yakınınızdaki sahaları görmek için konum servislerini kullanın
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default Settings;
