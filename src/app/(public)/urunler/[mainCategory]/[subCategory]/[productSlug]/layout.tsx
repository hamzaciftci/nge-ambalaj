import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

async function getProduct(mainSlug: string, subSlug: string, productSlug: string) {
  const mainCategory = await prisma.mainCategory.findUnique({
    where: { slug: mainSlug, isActive: true },
  });

  if (!mainCategory) return null;

  const subCategory = await prisma.subCategory.findFirst({
    where: {
      slug: subSlug,
      mainCategoryId: mainCategory.id,
      isActive: true,
    },
  });

  if (!subCategory) return null;

  return prisma.product.findFirst({
    where: {
      slug: productSlug,
      subCategoryId: subCategory.id,
      isActive: true,
    },
    include: {
      subCategory: {
        include: {
          mainCategory: true,
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { mainCategory: string; subCategory: string; productSlug: string };
}): Promise<Metadata> {
  const product = await getProduct(
    params.mainCategory,
    params.subCategory,
    params.productSlug
  );

  if (!product) {
    return {
      title: "Ürün Bulunamadı | NGE Ambalaj",
    };
  }

  const categoryPath = `${product.subCategory.mainCategory.name} > ${product.subCategory.name}`;

  return {
    title: `${product.name} | ${product.subCategory.name} | NGE Ambalaj`,
    description: `${product.name} - ${product.description.substring(0, 150)}. NGE Ambalaj'dan ${categoryPath} kategorisinde kaliteli ürünler.`,
    keywords: [
      product.name,
      product.subCategory.name,
      product.subCategory.mainCategory.name,
      "ambalaj",
      "endüstriyel ambalaj",
      "NGE Ambalaj",
    ],
    openGraph: {
      title: `${product.name} | NGE Ambalaj`,
      description: product.description,
      type: "website",
      locale: "tr_TR",
      siteName: "NGE Ambalaj",
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | NGE Ambalaj`,
      description: product.description,
      images: [product.image],
    },
    alternates: {
      canonical: `https://nge-ambalaj.vercel.app/urunler/${product.subCategory.mainCategory.slug}/${product.subCategory.slug}/${product.slug}`,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
