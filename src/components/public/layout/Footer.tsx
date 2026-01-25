"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
}

interface SiteSettings {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  addressEn?: string | null;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  } | null;
}

interface FooterProps {
  categories: Category[];
  settings?: SiteSettings | null;
}

const translations = {
  tr: {
    home: "Ana Sayfa",
    products: "Ürünler",
    about: "Hakkımızda",
    contact: "İletişim",
    companyDescription:
      "1990'dan bu yana endüstriyel ambalaj sektöründe güvenilir çözüm ortağınız. Kaliteli ürünler ve profesyonel hizmet anlayışı ile sektörün lider firmalarından biriyiz.",
    productCategories: "Ürün Kategorileri",
    quickLinks: "Hızlı Linkler",
    contactInfo: "İletişim Bilgileri",
    copyright: `© ${new Date().getFullYear()} NG Ambalaj. Tüm hakları saklıdır.`,
    tagline: "Endüstriyel Ambalaj Çözümleri",
  },
  en: {
    home: "Home",
    products: "Products",
    about: "About Us",
    contact: "Contact",
    companyDescription:
      "Your trusted partner in industrial packaging since 1990. We are one of the leading companies in the sector with quality products and professional service approach.",
    productCategories: "Product Categories",
    quickLinks: "Quick Links",
    contactInfo: "Contact Information",
    copyright: `© ${new Date().getFullYear()} NG Ambalaj. All rights reserved.`,
    tagline: "Industrial Packaging Solutions",
  },
};

export default function Footer({ categories, settings }: FooterProps) {
  const { i18n } = useTranslation();
  const locale = (i18n.language as "tr" | "en") || "tr";
  const t = translations[locale] || translations.tr;

  const quickLinks = [
    { name: t.home, href: "/" },
    { name: t.about, href: "/hakkimizda" },
    { name: t.products, href: "/urunler" },
    { name: t.contact, href: "/iletisim" },
  ];

  const phone = settings?.phone || "0532 643 5501";
  const email = settings?.email || "info@ngeltd.net";
  const address = locale === "en"
    ? (settings?.addressEn || settings?.address || "Adana Organized Industrial Zone T.Özal Blv. No:6 Z:14 Sarıçam / ADANA")
    : (settings?.address || "Adana Organize Sanayi Bölgesi T.Özal Blv. No:6 Z:14 Sarıçam / ADANA");
  const socialLinks = settings?.socialLinks || {};

  return (
    <footer className="bg-gradient-to-br from-foreground to-foreground/95 text-background">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Image
              src="/logo-yatay.png"
              alt="NG Ambalaj"
              width={192}
              height={48}
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-background/80 text-sm leading-relaxed">
              {t.companyDescription}
            </p>
            <div className="flex gap-3">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-background/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-background/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-background/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {!socialLinks.facebook && !socialLinks.instagram && !socialLinks.linkedin && (
                <>
                  <a
                    href="#"
                    className="p-2.5 bg-background/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2.5 bg-background/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2.5 bg-background/10 rounded-full hover:bg-primary hover:scale-110 transition-all duration-300"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-background">
              {t.productCategories}
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/urunler/${cat.slug}`}
                    className="text-background/80 hover:text-primary hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    {locale === "en" ? cat.nameEn || cat.name : cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-background">
              {t.quickLinks}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-background/80 hover:text-primary hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-background">
              {t.contactInfo}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-background/80 text-sm leading-relaxed whitespace-pre-line">
                  {address}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-background/80 hover:text-primary hover:translate-x-1 transition-all text-sm"
                >
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-background/80 hover:text-primary hover:translate-x-1 transition-all text-sm"
                >
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container-custom py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">{t.copyright}</p>
          <p className="text-background/60 text-sm">{t.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
