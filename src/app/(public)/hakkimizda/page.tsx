"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createSafeHtml } from "@/lib/sanitize";
import { CheckCircle2, Users, Award, Target, Clock, Truck, Shield, Package, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const storyImage = "/about-team.jpg";

  const paragraphs = [
    t("aboutPage.mainContentParagraph1"),
    t("aboutPage.mainContentParagraph2"),
    t("aboutPage.mainContentParagraph3"),
  ];

  const highlights = [
    t("aboutPage.highlights.highlight1"),
    t("aboutPage.highlights.highlight2"),
    t("aboutPage.highlights.highlight3"),
    t("aboutPage.highlights.highlight4"),
  ];

  const features = [
    {
      icon: Clock,
      title: t("aboutPage.features.yearsExperience.title"),
      description: t("aboutPage.features.yearsExperience.description"),
    },
    {
      icon: Users,
      title: t("aboutPage.features.reliablePartner.title"),
      description: t("aboutPage.features.reliablePartner.description"),
    },
    {
      icon: Truck,
      title: t("aboutPage.features.fastDelivery.title"),
      description: t("aboutPage.features.fastDelivery.description"),
    },
    {
      icon: Shield,
      title: t("aboutPage.features.qualityGuarantee.title"),
      description: t("aboutPage.features.qualityGuarantee.description"),
    },
    {
      icon: Globe,
      title: t("aboutPage.features.importExport.title"),
      description: t("aboutPage.features.importExport.description"),
    },
    {
      icon: Package,
      title: t("aboutPage.features.wideRange.title"),
      description: t("aboutPage.features.wideRange.description"),
    },
  ];

  const values = [
    {
      icon: Target,
      title: t("about.mission"),
      description: t("aboutPage.mission"),
    },
    {
      icon: Award,
      title: t("about.vision"),
      description: t("aboutPage.vision"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("aboutPage.heroTitle")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t("aboutPage.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {t("aboutPage.storyBadge")}
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-foreground mb-6"
                dangerouslySetInnerHTML={createSafeHtml(t("aboutPage.storyTitle"))}
              />
              <div className="space-y-4 text-muted-foreground">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
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
                <div className="text-4xl font-bold">{t("aboutPage.yearsExperience")}</div>
                <div className="text-sm opacity-90">{t("aboutPage.yearsLabel")}</div>
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
              {t("aboutPage.valuesBadge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("aboutPage.valuesTitle")}
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
              dangerouslySetInnerHTML={createSafeHtml(t("aboutPage.valuesFooter"))}
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
              {t("aboutPage.whyUsBadge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("aboutPage.whyUsTitle")}
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
            {t("aboutPage.ctaTitle")}
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            {t("aboutPage.ctaSubtitle")}
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            {t("aboutPage.ctaButtonText")}
          </Link>
        </div>
      </section>
    </div>
  );
}
