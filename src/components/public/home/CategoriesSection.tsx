"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

interface SubCategory {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  description: string;
  descriptionEn?: string | null;
  image: string;
  subCategories: SubCategory[];
}

interface CategoriesSectionProps {
  categories: Category[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const translations = {
  tr: {
    sectionBadge: "Ürün Kategorileri",
    sectionTitle: "Endüstriyel Çözümlerimiz",
    sectionDescription:
      "Geniş ürün yelpazemiz ile endüstriyel ambalaj ihtiyaçlarınıza profesyonel çözümler sunuyoruz",
    viewDetails: "Detayları Gör",
    viewAll: "Tüm Ürünleri Görüntüle",
    subCategoriesCount: "alt kategori",
  },
  en: {
    sectionBadge: "Product Categories",
    sectionTitle: "Our Industrial Solutions",
    sectionDescription:
      "We offer professional solutions for your industrial packaging needs with our wide product range",
    viewDetails: "View Details",
    viewAll: "View All Products",
    subCategoriesCount: "subcategories",
  },
};

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  const { i18n } = useTranslation();
  const locale = (i18n.language as "tr" | "en") || "tr";
  const t = translations[locale] || translations.tr;

  return (
    <section className="section-padding bg-secondary overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
          >
            {t.sectionBadge}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-4"
          >
            {t.sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            {t.sectionDescription}
          </motion.p>

          {/* Animated Line */}
          <motion.div
            className="h-1 w-20 bg-primary mx-auto mt-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((category) => {
            const name =
              locale === "en" ? category.nameEn || category.name : category.name;
            const description =
              locale === "en"
                ? category.descriptionEn || category.description
                : category.description;

            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                className="group relative h-full"
              >
                <Link
                  href={`/urunler/${category.slug}`}
                  className="block h-full bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/5] overflow-hidden bg-secondary relative">
                    <motion.img
                      src={category.image}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />

                    {/* Modern Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Glassmorphism Content Box */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <motion.div
                        initial={false}
                        className="transform transition-transform duration-500 group-hover:-translate-y-2"
                      >
                        <motion.span
                          className="inline-flex px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white uppercase bg-primary/90 backdrop-blur-md rounded-full shadow-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          {category.subCategories.length} {t.subCategoriesCount}
                        </motion.span>

                        <h3 className="text-3xl font-bold text-white mb-3 tracking-tight group-hover:text-primary-light transition-colors">
                          {name}
                        </h3>

                        <p className="text-gray-300 text-base mb-6 line-clamp-2 font-light leading-relaxed group-hover:text-white transition-colors">
                          {description}
                        </p>

                        {/* Subcategories Preview - Glass Effect */}
                        <div className="space-y-2 mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                          {category.subCategories.slice(0, 3).map((sub) => {
                            const subName =
                              locale === "en"
                                ? sub.nameEn || sub.name
                                : sub.name;
                            return (
                              <div
                                key={sub.id}
                                className="flex items-center gap-2.5 text-gray-200 text-sm"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>{subName}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center text-white font-medium group/btn">
                          <span className="border-b border-transparent group-hover/btn:border-primary transition-colors">
                            {t.viewDetails}
                          </span>
                          <div className="ml-3 bg-white/20 p-1.5 rounded-full backdrop-blur-sm group-hover:bg-primary transition-colors duration-300">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
            >
              {t.viewAll}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
