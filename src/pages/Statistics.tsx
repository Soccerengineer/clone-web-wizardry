
import { Card } from "@/components/ui/card";
import UserLayout from "@/components/ui/user-layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Star } from "lucide-react";

const Statistics = () => {
  const performanceData = [
    { hafta: "1. Hafta", mesafe: 3200 },
    { hafta: "2. Hafta", mesafe: 4800 },
    { hafta: "3. Hafta", mesafe: 6700 },
    { hafta: "4. Hafta", mesafe: 6300 },
    { hafta: "5. Hafta", mesafe: 5200 },
    { hafta: "6. Hafta", mesafe: 5800 },
    { hafta: "7. Hafta", mesafe: 6700 },
    { hafta: "8. Hafta", mesafe: 6300 },
    { hafta: "9. Hafta", mesafe: 5200 },
    { hafta: "10. Hafta", mesafe: 4800 },
    { hafta: "11. Hafta", mesafe: 6700 },
    { hafta: "12. Hafta", mesafe: 8300 },
  ];

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <img
            src="/lovable-uploads/31dd6418-1a95-4b8e-8af1-81058a36855d.png"
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-primary"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Süper Oyuncu</h1>
            <div className="text-lg text-gray-300">Ali Nazik</div>
            <div className="flex items-center gap-1 text-primary mt-1">
              <span>3.7</span>
              <div className="flex">
                {[1, 2, 3].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-primary" />
                ))}
                <Star className="w-4 h-4 fill-primary/50" />
                <Star className="w-4 h-4 fill-transparent stroke-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">3 Aylık Performansım</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="hafta" 
                  stroke="#ffffff40"
                  tick={{ fill: '#ffffff80' }}
                />
                <YAxis 
                  stroke="#ffffff40"
                  tick={{ fill: '#ffffff80' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a2332',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="mesafe"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 5L21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M13 12L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M13 19L21 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6 5C6 5.55228 5.55228 6 5 6C4.44772 6 4 5.55228 4 5C4 4.44772 4.44772 4 5 4C5.55228 4 6 4.44772 6 5Z" fill="currentColor"/>
                  <path d="M6 12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12Z" fill="currentColor"/>
                  <path d="M6 19C6 19.5523 5.55228 20 5 20C4.44772 20 4 19.5523 4 19C4 18.4477 4.44772 18 5 18C5.55228 18 6 18.4477 6 19Z" fill="currentColor"/>
                  <path d="M8 5H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 19H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">En yüksek koşu hızı</h3>
                <p className="text-2xl font-bold text-white">32.4 km/s</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Kat edilen toplam mesafe</h3>
                <p className="text-2xl font-bold text-white">142.7 km</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Toplam koşu süresi</h3>
                <p className="text-2xl font-bold text-white">16s 42dk</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
};

export default Statistics;
