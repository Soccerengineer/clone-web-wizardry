
import { Tag, Play, QrCode, LineChart } from "lucide-react";
import { Card } from "./ui/card";

const HowItWorks = () => {
  const steps = [
    {
      title: "Etiketi Tak",
      icon: <Tag className="w-12 h-12 text-primary mb-4" />,
      description: "Süper Saha üyesi spor tesisimizde, maç saatinizden hemen önce yetkiliden yüksek teknolojili performans etiketinizi talep edin. İstatistiklerinizi kaydedecek cihazı formanızın ense kısmına iliştirdikten sonra artık maça hazırsınız."
    },
    {
      title: "Performansını Sergile",
      icon: <Play className="w-12 h-12 text-primary mb-4" />,
      description: "Maç içerisinde tüm performansınızı sergilemekten geri durmayın. Cihazı maç esnasında asla çıkarmayın veya ayarlarını değiştirmeyin."
    },
    {
      title: "Paneline Git",
      icon: <LineChart className="w-12 h-12 text-primary mb-4" />,
      description: "Müsabakanın hemen ardından formanıza takmış olduğunuz etiketi görevliye geri teslim ederek performans istatistiklerinizi, saha içi, bölgesel, ülke içindeki sıralamanızı ve çok daha fazlasına erişmek üzere www.supersaha.com web sitemizi ziyaret edin, heyecana ortak olun."
    },
    {
      title: "İstatistiklerini Gör",
      icon: <QrCode className="w-12 h-12 text-primary mb-4" />,
      description: "Mobil telefonunun kamerasından QR kodunu okutabilir veya web tarayıcınla doğrudan sitemize erişebilirsin. Ancak unutma! Tüm özelliklerden yararlanmak için www.supersaha.com'a ÜCRETSİZ üye"
    }
  ];

  return (
    <section className="py-16 px-4">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Nasıl <span className="text-primary">Çalışır</span>?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <Card key={index} className="p-6 bg-white/5 backdrop-blur-lg border-white/20">
            <div className="flex flex-col items-center text-center">
              {step.icon}
              <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300 text-sm">{step.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
