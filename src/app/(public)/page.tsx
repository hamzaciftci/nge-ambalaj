import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/public/home/HeroSection";
import CategoriesSection from "@/components/public/home/CategoriesSection";
import AboutSection from "@/components/public/home/AboutSection";
import CTASection from "@/components/public/home/CTASection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NGE Ambalaj | Endüstriyel Ambalaj Çözümleri - Adana",
  description:
    "NGE Ambalaj - Çemberleme makineleri, PET & çelik çemberler, streç filmler ve endüstriyel ambalaj malzemeleri. Adana OSB'de 10+ yıllık tecrübe ile kaliteli ambalaj çözümleri sunuyoruz.",
  keywords: [
    "ambalaj",
    "çemberleme makinesi",
    "PET çember",
    "çelik çember",
    "streç film",
    "endüstriyel ambalaj",
    "Adana ambalaj",
    "NGE Ambalaj",
  ],
  openGraph: {
    title: "NGE Ambalaj | Endüstriyel Ambalaj Çözümleri",
    description:
      "Çemberleme makineleri, PET & çelik çemberler, streç filmler ve endüstriyel ambalaj malzemeleri. 10+ yıllık tecrübe.",
    type: "website",
    locale: "tr_TR",
    siteName: "NGE Ambalaj",
  },
  twitter: {
    card: "summary_large_image",
    title: "NGE Ambalaj | Endüstriyel Ambalaj Çözümleri",
    description:
      "Çemberleme makineleri, PET & çelik çemberler, streç filmler ve endüstriyel ambalaj malzemeleri.",
  },
  alternates: {
    canonical: "https://nge-ambalaj.vercel.app",
  },
};

async function getHomeData() {
  const [categories, settings] = await Promise.all([
    prisma.mainCategory.findMany({
      where: { isActive: true },
      include: {
        subCategories: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            nameEn: true,
            slug: true,
          },
        },
      },
      orderBy: { order: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
  ]);

  return { categories, settings };
}

export default async function HomePage() {
  const { categories, settings } = await getHomeData();

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <AboutSection />
      <CTASection phone={settings?.phone || undefined} />
    </>
  );
}
