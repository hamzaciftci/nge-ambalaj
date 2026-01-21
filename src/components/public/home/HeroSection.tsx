"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const translations = {
  tr: {
    badge: "20+ Yıllık Tecrübe",
    title: "Endüstriyel Ambalaj",
    titleHighlight: "Çözümleri",
    description:
      "Çemberleme makineleri, çemberler ve endüstriyel ambalaj ürünlerinde lider tedarikçiniz. Kaliteli ürünler ve profesyonel hizmet.",
    viewProducts: "Ürünleri Keşfet",
    contact: "Bize Ulaşın",
  },
  en: {
    badge: "20+ Years Experience",
    title: "Industrial Packaging",
    titleHighlight: "Solutions",
    description:
      "Your leading supplier in strapping machines, straps and industrial packaging products. Quality products and professional service.",
    viewProducts: "Explore Products",
    contact: "Contact Us",
  },
};

export default function HeroSection() {
  const { i18n } = useTranslation();
  const locale = i18n.language as "tr" | "en";

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const t = translations[locale] || translations.tr;

  return (
    <section
      ref={sectionRef}
      className="relative h-[600px] flex items-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <img
          src="/hero-bg.jpg"
          alt="NG Ambalaj Endüstriyel Çözümler"
          className="w-full h-[120%] object-cover brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
      </motion.div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 border border-primary/10 rounded-full blur-sm"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          className="absolute bottom-32 right-40 w-64 h-64 border border-primary/20 rounded-full blur-sm opacity-50"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="container-custom relative z-10"
        style={{ y: textY, opacity }}
      >
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.span
            variants={badgeVariants}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-sm font-medium mb-8 shadow-xl"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
            }}
          >
            <motion.span
              className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {t.badge}
          </motion.span>

          {/* Main Heading */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-sm"
            >
              {t.title}{" "}
              <span className="block mt-2">
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-primary inline-block"
                  whileHover={{ scale: 1.02, x: 10 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {t.titleHighlight}
                </motion.span>
              </span>
            </motion.h1>
          </div>

          {/* Animated Line */}
          <motion.div
            className="h-1.5 w-32 bg-primary rounded-full mb-8 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          />

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl font-light"
          >
            {t.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base gap-3 bg-primary hover:bg-primary-light shadow-[0_10px_30px_rgba(59,130,246,0.5)] hover:shadow-[0_15px_35px_rgba(59,130,246,0.6)] border-none"
              >
                <Link href="/urunler">
                  {t.viewProducts}
                  <motion.span
                    className="inline-block bg-white/20 rounded-full p-1"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-md"
              >
                <Link href="/iletisim">{t.contact}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-background/40 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 bg-primary rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
