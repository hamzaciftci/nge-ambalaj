import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";

export const dynamic = "force-dynamic";

async function getSubCategory(mainSlug: string, subSlug: string) {
  const mainCategory = await prisma.mainCategory.findUnique({
    where: { slug: mainSlug, isActive: true },
  });

  if (!mainCategory) return null;

  return prisma.subCategory.findFirst({
    where: {
      slug: subSlug,
      mainCategoryId: mainCategory.id,
      isActive: true,
    },
    include: {
      mainCategory: true,
      products: {
        where: { isActive: true },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { mainCategory: string; subCategory: string };
}): Promise<Metadata> {
  const subCategory = await getSubCategory(params.mainCategory, params.subCategory);

  if (!subCategory) {
    return {
      title: "Kategori Bulunamadı | NGE Ambalaj",
    };
  }

  return {
    title: `${subCategory.name} | ${subCategory.mainCategory.name} | NGE Ambalaj`,
    description: `${subCategory.name} ürünlerini keşfedin. ${subCategory.description.substring(0, 150)}`,
    keywords: [
      subCategory.name,
      subCategory.mainCategory.name,
      "ambalaj",
      "endüstriyel ambalaj",
      "NGE Ambalaj",
      ...subCategory.products.slice(0, 5).map((p) => p.name),
    ],
    openGraph: {
      title: `${subCategory.name} | NGE Ambalaj`,
      description: subCategory.description,
      type: "website",
      locale: "tr_TR",
      siteName: "NGE Ambalaj",
      images: subCategory.image ? [{ url: subCategory.image }] : undefined,
    },
    alternates: {
      canonical: `https://nge-ambalaj.vercel.app/urunler/${subCategory.mainCategory.slug}/${subCategory.slug}`,
    },
  };
}

export default async function SubCategoryPage({
  params,
}: {
  params: { mainCategory: string; subCategory: string };
}) {
  const subCategory = await getSubCategory(params.mainCategory, params.subCategory);

  if (!subCategory) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-muted-foreground text-sm mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/urunler" className="hover:text-primary transition-colors">
              Ürünler
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/urunler/${subCategory.mainCategory.slug}`}
              className="hover:text-primary transition-colors"
            >
              {subCategory.mainCategory.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{subCategory.name}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{subCategory.name}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {subCategory.description}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Ürünler ({subCategory.products.length})
            </h2>
          </div>

          {subCategory.products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Bu kategoride henüz ürün bulunmamaktadır.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subCategory.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/urunler/${subCategory.mainCategory.slug}/${subCategory.slug}/${product.slug}`}
                  className="group block bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-yellow-500 text-white p-1.5 rounded-full">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
