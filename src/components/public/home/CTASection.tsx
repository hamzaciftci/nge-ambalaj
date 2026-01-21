"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, MessageCircle } from "lucide-react";

interface CTASectionProps {
  phone?: string;
}

const translations = {
  tr: {
    title: "Projeleriniz İçin Hemen İletişime Geçin",
    description:
      "Endüstriyel ambalaj ihtiyaçlarınız için size özel çözümler sunalım. Uzman ekibimiz sizinle iletişime geçmek için hazır.",
    getQuote: "Teklif Al",
    callNow: "Hemen Ara",
  },
  en: {
    title: "Contact Us For Your Projects",
    description:
      "Let us offer you custom solutions for your industrial packaging needs. Our expert team is ready to contact you.",
    getQuote: "Get a Quote",
    callNow: "Call Now",
  },
};

export default function CTASection({
  phone = "+90 212 123 45 67",
}: CTASectionProps) {
  const { i18n } = useTranslation();
  const locale = (i18n.language as "tr" | "en") || "tr";
  const t = translations[locale] || translations.tr;

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 right-10 w-32 h-32 border-2 border-primary-foreground/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-24 h-24 border-2 border-primary-foreground/20"
        animate={{
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="container-custom relative">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <MessageCircle className="h-16 w-16 text-primary-foreground/80 mx-auto mb-6" />
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {t.title}
          </motion.h2>

          <motion.p
            className="text-primary-foreground/90 text-lg md:text-xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {t.description}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 shadow-xl"
              >
                <Link href="/iletisim">
                  {t.getQuote}
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 bg-primary-foreground/10 backdrop-blur-sm border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 shadow-lg"
              >
                <a href={`tel:${phone.replace(/\s/g, "")}`}>
                  <Phone className="h-5 w-5" />
                  {t.callNow}
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
