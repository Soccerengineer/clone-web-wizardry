
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SettingsLayout from "@/components/settings/SettingsLayout";

const Security = () => {
  return (
    <SettingsLayout>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Güvenlik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Mevcut Şifre</label>
              <Input type="password" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Yeni Şifre</label>
              <Input type="password" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Yeni Şifre Tekrar</label>
              <Input type="password" className="bg-white/5 border-white/10" />
            </div>
            <Button type="submit">Şifreyi Güncelle</Button>
          </form>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default Security;
