"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SubCategory {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  image: string;
  slug: string;
  subCategories: SubCategory[];
  _count: {
    subCategories: number;
  };
}

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (!mounted || loading) {
    return null;
  }

  const locale = i18n.language;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("products.title")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t("products.subtitle")}
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const categoryName = locale === "en" && category.nameEn ? category.nameEn : category.name;
              const categoryDescription = locale === "en" && category.descriptionEn ? category.descriptionEn : category.description;

              return (
                <Link
                  key={category.id}
                  href={`/urunler/${category.slug}`}
                  className="group block bg-card rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={category.image}
                      alt={categoryName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-white bg-primary/90 rounded-full">
                        {category._count.subCategories} {t("products.subCategories")}
                      </span>
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-light transition-colors">
                        {categoryName}
                      </h2>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {categoryDescription}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-card">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("common.viewDetails")}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <ArrowRight className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
