import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlayerAchievement } from "@/models/player.model";
import { formatDate } from "@/utils/formatters";

interface ExperienceLevelProps {
  achievements?: PlayerAchievement[];
  isLoading?: boolean;
}

const ExperienceLevel = ({ achievements = [], isLoading = false }: ExperienceLevelProps) => {
  // Yükleme durumu için azaltılmış opasite
  const opacityClass = isLoading ? 'opacity-70' : '';
  
  // Deneyim seviyesini hesapla (başarı sayısına göre)
  const calculateExperienceLevel = () => {
    if (!achievements.length) return { level: 1, percentage: 10 };
    
    // Her 5 başarım için 1 seviye
    const level = Math.floor(achievements.length / 5) + 1;
    // Sonraki seviyeye kadar olan yüzde
    const percentage = ((achievements.length % 5) / 5) * 100;
    
    return { level, percentage };
  };
  
  const { level, percentage } = calculateExperienceLevel();
  
  // Son 3 başarımı göster
  const recentAchievements = achievements
    .sort((a, b) => new Date(b.awarded_at).getTime() - new Date(a.awarded_at).getTime())
    .slice(0, 3);

  return (
    <div className={opacityClass}>
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Deneyim Seviyesi</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-400">Seviye {level}</span>
            <span className="text-sm text-gray-400">
              {percentage.toFixed(0)}% - Sonraki seviye: {level + 1}
            </span>
          </div>
          <Progress value={percentage} className="h-2 mt-2" />
        </div>

        <div>
          <h4 className="text-md font-medium text-white mb-3">Son Başarımlar</h4>
          
          {recentAchievements.length === 0 ? (
            <div className="text-sm text-gray-400 py-2">
              Henüz başarım yok. Maçlara katılarak başarım kazanabilirsiniz.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="flex items-start p-3 bg-white/5 rounded-lg"
                >
                  {achievement.icon_url ? (
                    <img 
                      src={achievement.icon_url} 
                      alt={achievement.title} 
                      className="h-10 w-10 mr-3"
                    />
                  ) : (
                    <div className="h-10 w-10 mr-3 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                      🏆
                    </div>
                  )}
                  
                  <div>
                    <h5 className="text-sm font-medium text-white">{achievement.title}</h5>
                    <p className="text-xs text-gray-400 mt-0.5">{achievement.description}</p>
                    <p className="text-xs text-primary mt-1">
                      {formatDate(achievement.awarded_at, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExperienceLevel;
