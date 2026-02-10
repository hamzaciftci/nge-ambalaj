"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Product {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  description: string;
  descriptionEn?: string | null;
  image: string;
  isFeatured: boolean;
}

interface SubCategory {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  description: string;
  descriptionEn?: string | null;
  image?: string | null;
  mainCategory: {
    name: string;
    nameEn?: string | null;
    slug: string;
  };
  products: Product[];
}

export default function SubCategoryPage({
  params,
}: {
  params: { mainCategory: string; subCategory: string };
}) {
  const { t, i18n } = useTranslation();
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);

  const isEn = i18n.language === "en";

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/subcategories/by-slug?mainCategory=${params.mainCategory}&subCategory=${params.subCategory}`);
        if (res.ok) {
          const data = await res.json();
          setSubCategory(data);
        }
      } catch {
        // Error handling
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("common.notFound")}</h1>
          <Link href="/urunler" className="text-primary hover:underline">
            {t("productDetail.backToProducts")}
          </Link>
        </div>
      </div>
    );
  }

  // Get localized content
  const subCategoryName = isEn && subCategory.nameEn ? subCategory.nameEn : subCategory.name;
  const subCategoryDescription = isEn && subCategory.descriptionEn ? subCategory.descriptionEn : subCategory.description;
  const mainCategoryName = isEn && subCategory.mainCategory.nameEn ? subCategory.mainCategory.nameEn : subCategory.mainCategory.name;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-muted-foreground text-sm mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              {t("common.home")}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/urunler" className="hover:text-primary transition-colors">
              {t("common.products")}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/urunler/${subCategory.mainCategory.slug}`}
              className="hover:text-primary transition-colors"
            >
              {mainCategoryName}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{subCategoryName}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{subCategoryName}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {subCategoryDescription}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {t("common.products")} ({subCategory.products.length})
            </h2>
          </div>

          {subCategory.products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {t("products.noProducts")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subCategory.products.map((product) => {
                const productName = isEn && product.nameEn ? product.nameEn : product.name;
                const productDescription = isEn && product.descriptionEn ? product.descriptionEn : product.description;

                return (
                  <Link
                    key={product.id}
                    href={`/urunler/${subCategory.mainCategory.slug}/${subCategory.slug}/${product.slug}`}
                    className="group block bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={productName}
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
                        {productName}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                        {productDescription}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
