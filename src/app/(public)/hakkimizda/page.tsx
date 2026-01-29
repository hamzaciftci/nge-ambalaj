import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createSafeHtml } from "@/lib/sanitize";
import { notFound } from "next/navigation";
import { CheckCircle2, Users, Award, Target, Clock, Truck, Shield, Package, Globe } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageContent {
  heroTitle?: string;
  heroSubtitle?: string;
  mainContent?: string;
  storyBadge?: string;
  storyTitle?: string;
  storyImage?: string;
  yearsExperience?: string;
  yearsLabel?: string;
  valuesBadge?: string;
  valuesTitle?: string;
  highlights?: string[];
  valuesFooter?: string;
  mission?: string;
  vision?: string;
  whyUsBadge?: string;
  whyUsTitle?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
}

async function getPageData() {
  return prisma.page.findUnique({
    where: { slug: "hakkimizda" },
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData();

  if (!page) {
    return {
      title: "Hakkımızda | NGE Ambalaj",
    };
  }

  return {
    title: page.seoTitle || `${page.title} | NGE Ambalaj`,
    description: page.seoDescription || "NGE Ambalaj hakkında bilgi edinin.",
    keywords: page.seoKeywords?.split(",").map((k) => k.trim()) || [
      "NGE Ambalaj hakkında",
      "endüstriyel ambalaj firması",
      "Adana ambalaj şirketi",
    ],
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || undefined,
      type: "website",
      locale: "tr_TR",
      siteName: "NGE Ambalaj",
    },
    alternates: {
      canonical: "https://nge-ambalaj.vercel.app/hakkimizda",
    },
  };
}

export default async function AboutPage() {
  const page = await getPageData();

  if (!page || !page.isActive) {
    notFound();
  }

  const content = (page.content || {}) as PageContent;

  // Default values with database override
  const heroTitle = content.heroTitle || "Hakkımızda";
  const heroSubtitle = content.heroSubtitle || "2012'den bu yana endüstriyel ambalaj sektöründe güvenilir çözüm ortağınız.";
  const mainContent = content.mainContent || "";
  const storyBadge = content.storyBadge || "Hikayemiz";
  const storyTitle = content.storyTitle || "Kalite ve Güven ile Örülmüş <span class=\"text-primary\">10+ Yıl</span>";
  const storyImage = content.storyImage || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800";
  const yearsExperience = content.yearsExperience || "10+";
  const yearsLabel = content.yearsLabel || "Yıllık Tecrübe";
  const valuesBadge = content.valuesBadge || "Değerlerimiz";
  const valuesTitle = content.valuesTitle || "NGE Ambalaj Olarak Biz";
  const highlights = content.highlights || [
    "İş ortaklarımızın tedarik zincirini güçlendiren kaliteli ambalaj malzemeleri sağlıyoruz",
    "Her ölçekten işletmeye uygun ürün portföyüyle hızlı ve etkili ticari çözümler sunuyoruz",
    "İthalat ve ihracat süreçlerinde güvenilir lojistik desteği sağlıyoruz",
    "Müşteri memnuniyetini her zaman önceliğimiz olarak kabul ediyoruz",
  ];
  const valuesFooter = content.valuesFooter || "Müşterilerimizle kurduğumuz ilişkilerde <strong class=\"text-foreground\">şeffaflık</strong>, <strong class=\"text-foreground\">doğruluk</strong> ve <strong class=\"text-foreground\">süreklilik</strong> temel değerlerimizdir. Her yeni siparişte beklentileri karşılamanın ötesine geçmek için çalışırız.";
  const mission = content.mission || "İşletmelerin lojistik ve sevkiyat süreçlerini optimize eden endüstriyel streç filmler ve PET çemberler başta olmak üzere kaliteli ambalaj çözümleri sunmak.";
  const vision = content.vision || "Türkiye'nin güvenilir endüstriyel ambalaj tedarikçisi olarak, yüksek kalite ve sürdürülebilir iş ortaklığı ilkeleriyle sektöre yön vermek.";
  const whyUsBadge = content.whyUsBadge || "Neden Biz?";
  const whyUsTitle = content.whyUsTitle || "Bizi Tercih Etmeniz İçin Nedenler";
  const ctaTitle = content.ctaTitle || "İşletmenizin Ambalaj İhtiyaçları İçin";
  const ctaSubtitle = content.ctaSubtitle || "NGE Ambalaj ile işletmenizin ambalaj ihtiyaçlarını profesyonel ve güvenilir bir iş ortağıyla karşılayın.";
  const ctaButtonText = content.ctaButtonText || "Bizimle İletişime Geçin";

  // Parse mainContent paragraphs
  const paragraphs = mainContent.split("\n\n").filter((p) => p.trim());

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
      description: mission,
    },
    {
      icon: Award,
      title: "Vizyonumuz",
      description: vision,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{heroTitle}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {storyBadge}
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-foreground mb-6"
                dangerouslySetInnerHTML={createSafeHtml(storyTitle)}
              />
              <div className="space-y-4 text-muted-foreground">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
                <img
                  src={storyImage}
                  alt="NGE Ambalaj Ekibi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-xl">
                <div className="text-4xl font-bold">{yearsExperience}</div>
                <div className="text-sm opacity-90">{yearsLabel}</div>
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
              {valuesBadge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {valuesTitle}
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
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              dangerouslySetInnerHTML={createSafeHtml(valuesFooter)}
            />
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
              {whyUsBadge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {whyUsTitle}
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
            {ctaTitle}
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            {ctaSubtitle}
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            {ctaButtonText}
          </Link>
        </div>
      </section>
    </div>
  );
}
