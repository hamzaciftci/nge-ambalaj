import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/public/home/HeroSection";
import CategoriesSection from "@/components/public/home/CategoriesSection";
import AboutSection from "@/components/public/home/AboutSection";
import CTASection from "@/components/public/home/CTASection";

export const dynamic = "force-dynamic";

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
