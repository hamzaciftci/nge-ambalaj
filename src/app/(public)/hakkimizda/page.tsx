import { CheckCircle2, Users, Award, Target, Clock, Truck, Shield, Headphones } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Clock,
      title: "20+ Yıllık Tecrübe",
      description: "1990'dan bu yana sektörde edindiğimiz deneyim ile yanınızdayız.",
    },
    {
      icon: Users,
      title: "500+ Mutlu Müşteri",
      description: "Türkiye genelinde yüzlerce işletmeye hizmet veriyoruz.",
    },
    {
      icon: Truck,
      title: "Hızlı Teslimat",
      description: "Siparişleriniz en kısa sürede kapınıza ulaştırılır.",
    },
    {
      icon: Shield,
      title: "Kalite Garantisi",
      description: "Tüm ürünlerimiz kalite standartlarına uygun olarak test edilir.",
    },
    {
      icon: Headphones,
      title: "7/24 Destek",
      description: "Teknik destek ekibimiz her zaman yanınızda.",
    },
    {
      icon: Award,
      title: "Sertifikalı Ürünler",
      description: "ISO ve CE sertifikalı ürünler ile güvenli çözümler.",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Misyonumuz",
      description:
        "Endüstriyel ambalaj sektöründe kaliteli ürünler ve profesyonel hizmet anlayışı ile müşterilerimizin iş süreçlerini kolaylaştırmak ve verimliliğini artırmak.",
    },
    {
      icon: Award,
      title: "Vizyonumuz",
      description:
        "Türkiye'nin ve bölgenin lider endüstriyel ambalaj tedarikçisi olarak, yenilikçi çözümler ve sürdürülebilir uygulamalar ile sektöre yön vermek.",
    },
  ];

  const milestones = [
    { year: "1990", event: "Şirketimiz İstanbul'da kuruldu" },
    { year: "2000", event: "İlk yurt dışı ihracatımızı gerçekleştirdik" },
    { year: "2010", event: "Yeni üretim tesisimizi açtık" },
    { year: "2015", event: "ISO 9001 kalite sertifikası aldık" },
    { year: "2020", event: "E-ticaret platformumuzu hayata geçirdik" },
    { year: "2024", event: "500+ müşteri sayısına ulaştık" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Hakkımızda</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            1990'dan bu yana endüstriyel ambalaj sektöründe güvenilir çözüm ortağınız.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Hikayemiz
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Kalite ve Güven ile Örülmüş <span className="text-primary">30 Yıl</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  NG Ambalaj, 1990 yılında İstanbul'da küçük bir aile işletmesi olarak faaliyetlerine
                  başlamıştır. Kuruluşundan bugüne kadar geçen sürede, endüstriyel ambalaj
                  sektöründe kendini kanıtlamış ve sektörün lider firmalarından biri haline
                  gelmiştir.
                </p>
                <p>
                  Müşteri memnuniyetini her zaman ön planda tutan şirketimiz, geniş ürün yelpazesi
                  ve profesyonel hizmet anlayışı ile Türkiye genelinde yüzlerce işletmeye hizmet
                  vermektedir.
                </p>
                <p>
                  Çemberleme makineleri, çemberler, endüstriyel yağlar ve ambalaj malzemeleri
                  konusunda uzmanlaşmış ekibimiz, müşterilerimizin ihtiyaçlarına en uygun
                  çözümleri sunmak için çalışmaktadır.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800"
                  alt="NG Ambalaj Ekibi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-xl">
                <div className="text-4xl font-bold">30+</div>
                <div className="text-sm opacity-90">Yıllık Tecrübe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Neden Biz?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Bizi Tercih Etmeniz İçin Nedenler
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Yolculuğumuz
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Kilometre Taşlarımız
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-border hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex-1 ${
                      index % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm inline-block">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {milestone.year}
                      </div>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-background z-10 hidden md:block" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">30+</div>
              <div className="text-primary-foreground/80">Yıllık Tecrübe</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">81</div>
              <div className="text-primary-foreground/80">İl Kapsama</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-primary-foreground/80">Ürün Çeşidi</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
