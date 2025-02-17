
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-[#0A1120] relative">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Hakkımızda
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Süper Saha, Türkiye'nin önde gelen halı saha rezervasyon ve karşılaşma organizasyon platformudur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Misyonumuz</h3>
              <p className="text-gray-300">
                Sporseverleri bir araya getirerek, halı saha futbolunu daha erişilebilir ve organize hale getirmek.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Vizyonumuz</h3>
              <p className="text-gray-300">
                Türkiye'nin en büyük halı saha ağını oluşturarak, amatör futbolu dijitalleştirmek ve profesyonelleştirmek.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Değerlerimiz</h3>
              <p className="text-gray-300">
                Şeffaflık, güvenilirlik ve spor sevgisi temel değerlerimizdir.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white/5 p-8 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Neden Süper Saha?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-primary mb-2">Kolay Rezervasyon</h4>
                <p className="text-gray-300">
                  Tek tıkla halı saha rezervasyonu yapabilir, maç organize edebilirsiniz.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-primary mb-2">Geniş Saha Ağı</h4>
                <p className="text-gray-300">
                  Türkiye'nin dört bir yanındaki halı sahalara erişim imkanı.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-primary mb-2">Maç Organizasyonu</h4>
                <p className="text-gray-300">
                  Rakip takım bulma ve maç organizasyonu için ideal platform.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-primary mb-2">İstatistikler</h4>
                <p className="text-gray-300">
                  Detaylı maç ve oyuncu istatistikleri ile performansınızı takip edin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
