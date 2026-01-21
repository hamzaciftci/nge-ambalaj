import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getCategories() {
  return prisma.mainCategory.findMany({
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
      _count: {
        select: { subCategories: true },
      },
    },
    orderBy: { order: "asc" },
  });
}

export default async function ProductsPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Ürünlerimiz</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Endüstriyel ambalaj ihtiyaçlarınız için geniş ürün yelpazemizi keşfedin.
            Kaliteli ürünler ve profesyonel hizmet anlayışı ile yanınızdayız.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/urunler/${category.slug}`}
                className="group block bg-card rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-white bg-primary/90 rounded-full">
                      {category._count.subCategories} Alt Kategori
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-light transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Detayları Gör
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <ArrowRight className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
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
