import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Sabit renk paleti
const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

// Tooltip için ortak stil
const tooltipStyle = {
  backgroundColor: '#1a2332',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
};

// Props tipi tanımlaması
interface PerformanceChartsProps {
  performanceData?: any[]; // API'den gelen veri tipi uygun şekilde belirlenebilir
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ performanceData = [] }) => {
  // Gelen veriyi işle veya örnek veri kullan
  const matchResults = performanceData && performanceData.length > 0
    ? processMatchData(performanceData)
    : [
        { name: 'Kazanılan', value: 65 },
        { name: 'Kaybedilen', value: 25 },
        { name: 'Berabere', value: 10 },
      ];

  // Aylık performans verilerini hazırla
  const monthlyPerformance = performanceData && performanceData.length > 0
    ? processMonthlyData(performanceData)
    : [
        { month: 'Oca', score: 75 },
        { month: 'Şub', score: 82 },
        { month: 'Mar', score: 78 },
        { month: 'Nis', score: 85 },
        { month: 'May', score: 90 },
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Maç Sonuçları</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={matchResults}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {matchResults.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Aylık Performans</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

// Yardımcı fonksiyonlar
function processMatchData(data: any[]) {
  // API'den gelen veriyi maç sonuçları için işleyen fonksiyon
  // Gerçek uygulamada burada maç sonuçları veri işleme mantığı olacak
  const wins = data.filter(match => match.result === 'win').length;
  const losses = data.filter(match => match.result === 'loss').length;
  const draws = data.filter(match => match.result === 'draw').length;
  
  return [
    { name: 'Kazanılan', value: wins || 65 },
    { name: 'Kaybedilen', value: losses || 25 },
    { name: 'Berabere', value: draws || 10 },
  ];
}

function processMonthlyData(data: any[]) {
  // API'den gelen veriyi aylık performans için işleyen fonksiyon
  // Gerçek uygulamada burada aylık performans veri işleme mantığı olacak
  
  // Varsayılan değerler (örnek data)
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const currentMonth = new Date().getMonth();
  
  return months
    .slice(Math.max(0, currentMonth - 4), currentMonth + 1)
    .map((month, index) => {
      // Her ay için puan hesaplaması yapılabilir veya API'den gelen data kullanılabilir
      return {
        month,
        score: Math.floor(Math.random() * 30) + 70, // Örnek değer
      };
    });
}

export default PerformanceCharts;
