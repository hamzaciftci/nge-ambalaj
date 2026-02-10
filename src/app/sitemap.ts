import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Generate sitemap dynamically at runtime (not during build)
export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ngeltd.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/iletisim`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/urunler`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Get all active categories
  const categories = await prisma.mainCategory.findMany({
    where: { isActive: true },
    include: {
      subCategories: {
        where: { isActive: true },
        include: {
          products: {
            where: { isActive: true },
            select: {
              slug: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/urunler/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Subcategory pages
  const subCategoryPages: MetadataRoute.Sitemap = categories.flatMap((category) =>
    category.subCategories.map((subCategory) => ({
      url: `${BASE_URL}/urunler/${category.slug}/${subCategory.slug}`,
      lastModified: subCategory.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  // Product pages
  const productPages: MetadataRoute.Sitemap = categories.flatMap((category) =>
    category.subCategories.flatMap((subCategory) =>
      subCategory.products.map((product) => ({
        url: `${BASE_URL}/urunler/${category.slug}/${subCategory.slug}/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    )
  );

  return [...staticPages, ...categoryPages, ...subCategoryPages, ...productPages];
}
