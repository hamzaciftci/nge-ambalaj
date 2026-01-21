import { prisma } from "@/lib/prisma";
import Header from "@/components/public/layout/Header";
import Footer from "@/components/public/layout/Footer";

export const dynamic = "force-dynamic";

async function getLayoutData() {
  const [categories, rawSettings] = await Promise.all([
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

  // Transform settings to match component interface
  const settings = rawSettings ? {
    phone: rawSettings.phone,
    email: rawSettings.email,
    address: rawSettings.address,
    socialLinks: rawSettings.socialLinks as { facebook?: string; instagram?: string; linkedin?: string } | null,
  } : null;

  return { categories, settings };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, settings } = await getLayoutData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} settings={settings} />
    </div>
  );
}
