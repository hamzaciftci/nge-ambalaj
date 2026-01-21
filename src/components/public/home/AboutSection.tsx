"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const statVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const translations = {
  tr: {
    sectionBadge: "Hakkımızda",
    sectionTitle: "Neden ",
    sectionTitleHighlight: "NG Ambalaj",
    sectionTitleQuestion: "?",
    description1:
      "1990 yılından bu yana endüstriyel ambalaj sektöründe faaliyet gösteren firmamız, kalite ve müşteri memnuniyetini ön planda tutarak sektörün lider firmalarından biri haline gelmiştir.",
    description2:
      "Geniş ürün yelpazemiz ve teknik destek ekibimiz ile tüm ambalaj ihtiyaçlarınıza profesyonel çözümler sunuyoruz.",
    feature1: "20+ Yıllık Tecrübe",
    feature2: "500+ Mutlu Müşteri",
    feature3: "Profesyonel Destek",
    feature4: "Hızlı Teslimat",
    feature5: "Kalite Garantisi",
    feature6: "Rekabetçi Fiyatlar",
    learnMore: "Daha Fazla Bilgi",
    stat1Value: "+",
    stat1Label: "Yıllık Tecrübe",
    stat2Value: "+",
    stat2Label: "Mutlu Müşteri",
    stat3Label: "İl Kapsama",
    stat4Value: "+",
    stat4Label: "Ürün Çeşidi",
  },
  en: {
    sectionBadge: "About Us",
    sectionTitle: "Why ",
    sectionTitleHighlight: "NG Ambalaj",
    sectionTitleQuestion: "?",
    description1:
      "Operating in the industrial packaging sector since 1990, our company has become one of the leading companies in the sector by prioritizing quality and customer satisfaction.",
    description2:
      "We offer professional solutions for all your packaging needs with our wide product range and technical support team.",
    feature1: "20+ Years Experience",
    feature2: "500+ Happy Customers",
    feature3: "Professional Support",
    feature4: "Fast Delivery",
    feature5: "Quality Guarantee",
    feature6: "Competitive Prices",
    learnMore: "Learn More",
    stat1Value: "+",
    stat1Label: "Years Experience",
    stat2Value: "+",
    stat2Label: "Happy Customers",
    stat3Label: "Province Coverage",
    stat4Value: "+",
    stat4Label: "Product Types",
  },
};

export default function AboutSection() {
  const { i18n } = useTranslation();
  const locale = (i18n.language as "tr" | "en") || "tr";
  const t = translations[locale] || translations.tr;

  const features = [
    t.feature1,
    t.feature2,
    t.feature3,
    t.feature4,
    t.feature5,
    t.feature6,
  ];

  const stats = [
    { value: 20, suffix: t.stat1Value, label: t.stat1Label },
    { value: 500, suffix: t.stat2Value, label: t.stat2Label },
    { value: 81, suffix: "", label: t.stat3Label },
    { value: 1000, suffix: t.stat4Value, label: t.stat4Label },
  ];

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {t.sectionBadge}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mt-4"
            >
              {t.sectionTitle}
              <span className="text-primary">{t.sectionTitleHighlight}</span>
              {t.sectionTitleQuestion}
            </motion.h2>

            {/* Animated Line */}
            <motion.div
              className="h-1 w-16 bg-primary mt-4 mb-6"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground leading-relaxed"
            >
              {t.description1}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground leading-relaxed mt-4 mb-8"
            >
              {t.description2}
            </motion.p>

            {/* Features Grid */}
            <motion.div
              className="grid sm:grid-cols-2 gap-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  </motion.div>
                  <span className="text-foreground text-sm group-hover:text-primary transition-colors">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button asChild size="lg" className="gap-2 group">
                <Link href="/hakkimizda">
                  {t.learnMore}
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Stats */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={statVariants}
                className="relative bg-primary/5 rounded-2xl p-8 text-center border border-primary/10 overflow-hidden group"
                whileHover={{
                  y: -8,
                  borderColor: "hsl(var(--primary) / 0.3)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Animation */}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner Accent */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                />

                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={2}
                    />
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
