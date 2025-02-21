
import { Card } from "@/components/ui/card";

const ExperienceLevel = () => {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Seviye İlerlemesi</h3>
        <span className="text-2xl font-bold text-primary">Lvl 7</span>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Deneyim</span>
            <span className="text-white">750/1000 XP</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: '75%' }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExperienceLevel;
