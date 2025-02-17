
import { LightningBolt, Target, Timer, CreditCard } from "lucide-react";
import { Card } from "./ui/card";

const WhatWeOffer = () => {
  const features = [
    {
      title: "Kolay Kullanım",
      highlight: "Kolay",
      description: "Pratik tak çıkar etiketlerimizle maçlarınızı özgürce oynayın ve istatistiklerinizi takip edin",
      icon: <LightningBolt className="w-12 h-12 text-white mb-4" />
    },
    {
      title: "İsabetli Analiz",
      highlight: "İsabetli",
      description: "Son teknoloji donanım ve yazılım çözümlerimizle maçlarınızı isabetli bir şekilde analiz ediyoruz",
      icon: <Target className="w-12 h-12 text-white mb-4" />
    },
    {
      title: "Sıfır Gecikme",
      highlight: "Sıfır",
      description: "Maçlarınızı oynadıktan hemen sonra gecikme olmaksızın istatistiklerinizi görüntüleyin",
      icon: <Timer className="w-12 h-12 text-white mb-4" />
    },
    {
      title: "Uygun Fiyat",
      highlight: "Uygun",
      description: "Her bütçeye uygun fiyatıyla kolay ulaşabilir servisimizin keyfini çıkarın",
      icon: <CreditCard className="w-12 h-12 text-white mb-4" />
    }
  ];

  return (
    <section className="py-16 px-4 bg-[#1a2332]">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Neler <span className="text-primary">Sunuyoruz</span>?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 bg-[#0A1120] border-white/10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#1a2332] p-4 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                <span className="text-primary">{feature.highlight}</span>
                {" " + feature.title.substring(feature.highlight.length)}
              </h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default WhatWeOffer;
