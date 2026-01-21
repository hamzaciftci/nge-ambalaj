"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  subCategories: {
    id: string;
    name: string;
    nameEn?: string | null;
    slug: string;
  }[];
}

interface SiteSettings {
  phone?: string | null;
  email?: string | null;
}

interface HeaderProps {
  categories: Category[];
  settings?: SiteSettings | null;
  locale?: string;
}

export default function Header({ categories, settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "tr";

  const navigation = [
    { name: t("common.home"), href: "/" },
    {
      name: t("common.products"),
      href: "/urunler",
      submenu: categories.map((cat) => ({
        name: locale === "en" ? cat.nameEn || cat.name : cat.name,
        href: `/urunler/${cat.slug}`,
        subItems: cat.subCategories.map((sub) => ({
          name: locale === "en" ? sub.nameEn || sub.name : sub.name,
          href: `/urunler/${cat.slug}/${sub.slug}`,
        })),
      })),
    },
    { name: t("common.about"), href: "/hakkimizda" },
    { name: t("common.contact"), href: "/iletisim" },
  ];

  const isActive = (href: string) => pathname === href;

  const phone = settings?.phone || "+90 212 123 45 67";
  const email = settings?.email || "info@ngambalaj.com";

  return (
    <header className="relative z-50 bg-white border-b border-gray-200 shadow-sm text-slate-900">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-2.5">
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 py-1 sm:py-0">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105"
            >
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="font-medium">{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105"
            >
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="font-medium">{email}</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm hidden md:block font-medium">{locale === "en" ? "20+ Years Experience" : "20+ Yıllık Tecrübe"}</div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-yatay.png"
              alt="NG Ambalaj"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <div className="relative">
                    <button
                      className={`flex items-center gap-1 font-medium transition-colors hover:text-primary ${
                        pathname.startsWith("/urunler")
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-card rounded-lg border border-border shadow-industrial-lg py-2 min-w-[280px] max-h-[600px] overflow-y-auto">
                        {item.submenu.map((subitem: any) => (
                          <div key={subitem.href} className="relative group/sub">
                            <Link
                              href={subitem.href}
                              className={`block px-4 py-2 text-sm font-medium hover:bg-accent transition-colors ${
                                isActive(subitem.href)
                                  ? "text-primary bg-accent"
                                  : "text-foreground"
                              }`}
                            >
                              {subitem.name}
                            </Link>
                            {subitem.subItems && subitem.subItems.length > 0 && (
                              <div className="pl-4 border-l-2 border-border ml-4">
                                {subitem.subItems.map((subSubItem: any) => (
                                  <Link
                                    key={subSubItem.href}
                                    href={subSubItem.href}
                                    className={`block px-4 py-1.5 text-xs hover:bg-accent transition-colors ${
                                      isActive(subSubItem.href)
                                        ? "text-primary bg-accent"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {subSubItem.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-medium transition-colors hover:text-primary ${
                      isActive(item.href) ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/iletisim">{t("common.getQuote")}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => setProductsOpen(!productsOpen)}
                        className="flex items-center justify-between w-full font-medium text-foreground"
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            productsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {productsOpen && (
                        <div className="mt-2 ml-4 flex flex-col gap-2">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-medium transition-colors hover:text-primary ${
                        isActive(item.href) ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Button asChild className="mt-4">
                <Link href="/iletisim" onClick={() => setMobileMenuOpen(false)}>
                  {t("common.getQuote")}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
