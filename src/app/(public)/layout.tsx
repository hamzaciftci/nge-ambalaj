import { prisma } from "@/lib/prisma";
import Header from "@/components/public/layout/Header";
import Footer from "@/components/public/layout/Footer";

export const dynamic = "force-dynamic";

async function getLayoutData() {
  const [categories, rawSettings, menuItems] = await Promise.all([
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
    prisma.menuItem.findMany({
      where: {
        menuType: "header",
        parentId: null,
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    }),
  ]);

  // Transform settings to match component interface
  const settings = rawSettings ? {
    phone: rawSettings.phone,
    email: rawSettings.email,
    address: rawSettings.address,
    footerText: rawSettings.footerText,
    footerTextEn: rawSettings.footerTextEn,
    socialLinks: rawSettings.socialLinks as {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
      youtube?: string;
    } | null,
  } : null;

  return { categories, settings, menuItems };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, settings, menuItems } = await getLayoutData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} settings={settings} menuItems={menuItems} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} settings={settings} />
    </div>
  );
}
