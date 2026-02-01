"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/public/ContactForm";

interface ContactInfo {
  icon: typeof Phone;
  title: string;
  value: string;
  href: string | null;
}

interface Settings {
  phone?: string;
  phone2?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  mapEmbedUrl?: string;
}

export default function ContactPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();
        setSettings(data || {});
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  if (!mounted || loading) {
    return null;
  }

  // Get contact info from settings or use defaults
  const contactInfo: ContactInfo[] = [
    {
      icon: Phone,
      title: t("contact.info.phone"),
      value: settings?.phone || "0532 643 5501",
      href: `tel:${settings?.phone?.replace(/\s/g, "") || "+905326435501"}`,
    },
  ];

  // Add second phone if exists
  if (settings?.phone2) {
    contactInfo.push({
      icon: Phone,
      title: t("contact.info.phone") + " 2",
      value: settings.phone2,
      href: `tel:${settings.phone2.replace(/\s/g, "")}`,
    });
  }

  contactInfo.push(
    {
      icon: Mail,
      title: t("contact.info.email"),
      value: settings?.email || "info@ngeltd.net",
      href: `mailto:${settings?.email || "info@ngeltd.net"}`,
    },
    {
      icon: MapPin,
      title: t("contact.info.address"),
      value: settings?.address || "Adana Organize Sanayi Bölgesi T.Özal Blv. No:6 Z:14 Sarıçam / ADANA",
      href: "https://maps.google.com/?q=Adana+Organize+Sanayi+Bölgesi",
    },
    {
      icon: Clock,
      title: t("contact.info.workingHours"),
      value: settings?.workingHours || "Pazartesi - Cumartesi: 08:00 - 18:00",
      href: null,
    }
  );

  const mapEmbedUrl = settings?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.8876!2d35.3833!3d37.0167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15288f8b6c0e1c1d%3A0x7e8b8b8b8b8b8b8b!2sAdana%20Organize%20Sanayi%20B%C3%B6lgesi!5e0!3m2!1str!2str!4v1704067200000!5m2!1str!2str";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("contact.title")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t("contact.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("contact.subtitle")}
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{info.title}</h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          target={info.href.startsWith("http") ? "_blank" : undefined}
                          rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">{t("contact.info.address")}</h2>
            <p className="text-muted-foreground">
              Adana Organize Sanayi Bölgesi'nde hizmetinizdeyiz.
            </p>
          </div>
          <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-border">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
