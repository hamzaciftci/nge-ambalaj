import { CheckCircle2, Users, Award, Target, Clock, Truck, Shield, Headphones, Package, Globe } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Clock,
      title: "10+ Yıllık Tecrübe",
      description: "2012'den bu yana sektörde edindiğimiz deneyim ile yanınızdayız.",
    },
    {
      icon: Users,
      title: "Güvenilir İş Ortağı",
      description: "Müşterilerimizle kurduğumuz ilişkilerde şeffaflık ve süreklilik.",
    },
    {
      icon: Truck,
      title: "Hızlı Teslimat",
      description: "Siparişleriniz en kısa sürede kapınıza ulaştırılır.",
    },
    {
      icon: Shield,
      title: "Kalite Garantisi",
      description: "Tüm ürünlerimiz ulusal ve uluslararası standartlara uygun.",
    },
    {
      icon: Globe,
      title: "İthalat & İhracat",
      description: "Güvenilir lojistik desteği ile ithalat ve ihracat hizmetleri.",
    },
    {
      icon: Package,
      title: "Geniş Ürün Portföyü",
      description: "Her ölçekten işletmeye uygun ambalaj çözümleri.",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Misyonumuz",
      description:
        "İşletmelerin lojistik ve sevkiyat süreçlerini optimize eden endüstriyel streç filmler ve PET çemberler başta olmak üzere kaliteli ambalaj çözümleri sunmak.",
    },
    {
      icon: Award,
      title: "Vizyonumuz",
      description:
        "Türkiye'nin güvenilir endüstriyel ambalaj tedarikçisi olarak, yüksek kalite ve sürdürülebilir iş ortaklığı ilkeleriyle sektöre yön vermek.",
    },
  ];

  const highlights = [
    "İş ortaklarımızın tedarik zincirini güçlendiren kaliteli ambalaj malzemeleri sağlıyoruz",
    "Her ölçekten işletmeye uygun ürün portföyüyle hızlı ve etkili ticari çözümler sunuyoruz",
    "İthalat ve ihracat süreçlerinde güvenilir lojistik desteği sağlıyoruz",
    "Müşteri memnuniyetini her zaman önceliğimiz olarak kabul ediyoruz",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Hakkımızda</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            2012'den bu yana endüstriyel ambalaj sektöründe güvenilir çözüm ortağınız.
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
                Kalite ve Güven ile Örülmüş <span className="text-primary">10+ Yıl</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  NGE Ambalaj, 2012 yılında kurulmuş olup, Türkiye'nin güneyinde Adana Organize
                  Sanayi Bölgesi'nde faaliyet gösteren bir endüstriyel ambalaj malzemeleri ticaret
                  firmasıdır. Sektörün dinamiklerine uygun, yüksek kalite ve sürdürülebilir iş
                  ortaklığı ilkeleriyle çalışıyoruz.
                </p>
                <p>
                  Kuruluşumuzdan bu yana temel misyonumuz, işletmelerin lojistik ve sevkiyat
                  süreçlerini optimize eden endüstriyel streç filmler (ön gerdirilmiş streç) ve
                  PET çemberler başta olmak üzere ambalaj çözümleri sunmaktır. Ürünlerimiz;
                  dayanıklılık, mukavemet ve güvenilir performans kriterleriyle seçilir, ulusal
                  ve uluslararası standartlara uygun şekilde tedarik edilir.
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
                  alt="NGE Ambalaj Ekibi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-xl">
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm opacity-90">Yıllık Tecrübe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NGE Ambalaj olarak biz */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Değerlerimiz
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              NGE Ambalaj Olarak Biz
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-card p-6 rounded-xl border border-border"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Müşterilerimizle kurduğumuz ilişkilerde <strong className="text-foreground">şeffaflık</strong>, <strong className="text-foreground">doğruluk</strong> ve <strong className="text-foreground">süreklilik</strong> temel
              değerlerimizdir. Her yeni siparişte beklentileri karşılamanın ötesine geçmek için çalışırız.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
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
      <section className="py-16 bg-secondary">
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

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            İşletmenizin Ambalaj İhtiyaçları İçin
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            NGE Ambalaj ile işletmenizin ambalaj ihtiyaçlarını profesyonel ve güvenilir bir iş ortağıyla karşılayın.
          </p>
          <a
            href="/iletisim"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            Bizimle İletişime Geçin
          </a>
        </div>
      </section>
    </div>
  );
}
