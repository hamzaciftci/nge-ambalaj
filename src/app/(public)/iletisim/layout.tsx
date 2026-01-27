import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPageData() {
  return prisma.page.findUnique({
    where: { slug: "iletisim" },
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData();

  if (!page) {
    return {
      title: "İletişim | NGE Ambalaj - Bize Ulaşın",
    };
  }

  return {
    title: page.seoTitle || `${page.title} | NGE Ambalaj`,
    description: page.seoDescription || "NGE Ambalaj ile iletişime geçin. Sorularınız ve talepleriniz için bizimle iletişime geçin.",
    keywords: page.seoKeywords?.split(",").map((k) => k.trim()) || [
      "NGE Ambalaj iletişim",
      "ambalaj firması iletişim",
      "Adana ambalaj telefon",
    ],
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || undefined,
      type: "website",
      locale: "tr_TR",
      siteName: "NGE Ambalaj",
    },
    alternates: {
      canonical: "https://nge-ambalaj.vercel.app/iletisim",
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
