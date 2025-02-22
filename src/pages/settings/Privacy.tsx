
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SettingsLayout from "@/components/settings/SettingsLayout";

const Privacy = () => {
  return (
    <SettingsLayout>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Gizlilik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-white">Profil Görünürlüğü</div>
              <div className="text-sm text-gray-400">
                Profilinizi diğer oyuncular görebilsin
              </div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-white">İstatistik Görünürlüğü</div>
              <div className="text-sm text-gray-400">
                İstatistiklerinizi diğer oyuncular görebilsin
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default Privacy;
