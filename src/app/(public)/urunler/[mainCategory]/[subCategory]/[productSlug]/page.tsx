"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Phone, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Product {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  description: string;
  descriptionEn?: string | null;
  longDescription?: string | null;
  longDescriptionEn?: string | null;
  image: string;
  isFeatured: boolean;
  images: { id: string; url: string; alt?: string | null }[];
  subCategory: {
    name: string;
    nameEn?: string | null;
    slug: string;
    mainCategory: {
      name: string;
      nameEn?: string | null;
      slug: string;
    };
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { mainCategory: string; subCategory: string; productSlug: string };
}) {
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const isEn = i18n.language === "en";

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `/api/public/products/${params.mainCategory}/${params.subCategory}/${params.productSlug}`
        );
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch {
        // Product fetch failed - UI will handle null state
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("productDetail.notFound")}</h1>
          <Link href="/urunler" className="text-primary hover:underline">
            {t("productDetail.backToProducts")}
          </Link>
        </div>
      </div>
    );
  }

  // Get localized content
  const productName = isEn && product.nameEn ? product.nameEn : product.name;
  const productDescription = isEn && product.descriptionEn ? product.descriptionEn : product.description;
  const productLongDescription = isEn && product.longDescriptionEn ? product.longDescriptionEn : product.longDescription;
  const subCategoryName = isEn && product.subCategory.nameEn ? product.subCategory.nameEn : product.subCategory.name;
  const mainCategoryName = isEn && product.subCategory.mainCategory.nameEn ? product.subCategory.mainCategory.nameEn : product.subCategory.mainCategory.name;

  const allImages = [product.image, ...product.images.map((img) => img.url)];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const features = [
    t("productDetail.features.feature1"),
    t("productDetail.features.feature2"),
    t("productDetail.features.feature3"),
    t("productDetail.features.feature4"),
    t("productDetail.features.feature5"),
    t("productDetail.features.feature6"),
  ];

  const usageAreas = [
    t("productDetail.usageAreas.area1"),
    t("productDetail.usageAreas.area2"),
    t("productDetail.usageAreas.area3"),
    t("productDetail.usageAreas.area4"),
    t("productDetail.usageAreas.area5"),
    t("productDetail.usageAreas.area6"),
  ];

  const advantages = [
    t("productDetail.advantages.advantage1"),
    t("productDetail.advantages.advantage2"),
    t("productDetail.advantages.advantage3"),
    t("productDetail.advantages.advantage4"),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <section className="bg-secondary py-6 border-b border-border">
        <div className="container-custom">
          <nav className="text-muted-foreground text-sm flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">{t("common.home")}</Link>
            <span>/</span>
            <Link href="/urunler" className="hover:text-primary transition-colors">{t("common.products")}</Link>
            <span>/</span>
            <Link href={`/urunler/${product.subCategory.mainCategory.slug}`} className="hover:text-primary transition-colors">
              {mainCategoryName}
            </Link>
            <span>/</span>
            <Link href={`/urunler/${product.subCategory.mainCategory.slug}/${product.subCategory.slug}`} className="hover:text-primary transition-colors">
              {subCategoryName}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{productName}</span>
          </nav>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border relative">
                <img
                  src={allImages[selectedImage]}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
                {product.isFeatured && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium">
                      <Star className="h-4 w-4 fill-current" />
                      {t("productDetail.featured")}
                    </div>
                  </div>
                )}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {allImages.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden bg-secondary border transition-colors cursor-pointer",
                      selectedImage === index
                        ? "border-primary border-2"
                        : "border-border hover:border-primary"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${productName} ${t("productDetail.image")} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  {subCategoryName}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {productName}
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  {productDescription}
                </p>
              </div>

              {/* Long Description */}
              {productLongDescription && (
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {productLongDescription}
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{t("productDetail.featuresTitle")}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Areas */}
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t("productDetail.usageAreasTitle")}</h3>
                <div className="flex flex-wrap gap-2">
                  {usageAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-background rounded-full text-sm text-foreground border border-border"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Advantages */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{t("productDetail.advantagesTitle")}</h3>
                <ul className="space-y-2">
                  {advantages.map((advantage, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/iletisim">
                    <Phone className="h-5 w-5" />
                    {t("productDetail.getInfo")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href={`/urunler/${product.subCategory.mainCategory.slug}/${product.subCategory.slug}`}>
                    <ArrowLeft className="h-5 w-5" />
                    {t("productDetail.backToCategory")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
