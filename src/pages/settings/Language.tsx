
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingsLayout from "@/components/settings/SettingsLayout";

const Language = () => {
  return (
    <SettingsLayout>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Dil ve Bölge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Dil</label>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Türkçe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Saat Dilimi</label>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="(GMT+03:00) Istanbul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ist">(GMT+03:00) Istanbul</SelectItem>
                <SelectItem value="lon">(GMT+00:00) London</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default Language;
