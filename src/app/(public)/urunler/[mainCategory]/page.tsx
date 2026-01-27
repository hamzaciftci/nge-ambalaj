import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCategory(slug: string) {
  return prisma.mainCategory.findUnique({
    where: { slug, isActive: true },
    include: {
      subCategories: {
        where: { isActive: true },
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { mainCategory: string };
}): Promise<Metadata> {
  const category = await getCategory(params.mainCategory);

  if (!category) {
    return {
      title: "Kategori Bulunamadı | NGE Ambalaj",
    };
  }

  return {
    title: `${category.name} | NGE Ambalaj - Endüstriyel Ambalaj`,
    description: `${category.name} kategorisindeki ürünlerimizi keşfedin. ${category.description.substring(0, 150)}`,
    keywords: [
      category.name,
      "ambalaj",
      "endüstriyel ambalaj",
      "NGE Ambalaj",
      ...category.subCategories.map((sub) => sub.name),
    ],
    openGraph: {
      title: `${category.name} | NGE Ambalaj`,
      description: category.description,
      type: "website",
      locale: "tr_TR",
      siteName: "NGE Ambalaj",
      images: category.image ? [{ url: category.image }] : undefined,
    },
    alternates: {
      canonical: `https://nge-ambalaj.vercel.app/urunler/${category.slug}`,
    },
  };
}

export default async function MainCategoryPage({
  params,
}: {
  params: { mainCategory: string };
}) {
  const category = await getCategory(params.mainCategory);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/urunler" className="hover:text-primary transition-colors">
              Ürünler
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{category.name}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Alt Kategoriler ({category.subCategories.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.subCategories.map((subCategory) => (
              <Link
                key={subCategory.id}
                href={`/urunler/${category.slug}/${subCategory.slug}`}
                className="group block bg-card rounded-xl border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {subCategory.image ? (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={subCategory.image}
                      alt={subCategory.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/30">
                      {subCategory.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {subCategory.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {subCategory.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {subCategory._count.products} Ürün
                    </span>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                      Ürünleri Gör
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
