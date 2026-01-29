import { Metadata } from "next";
import Link from "next/link";
import { Home, Search, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı (404)",
  description:
    "Aradığınız sayfa bulunamadı. Ana sayfaya dönün veya ürünlerimize göz atın.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="text-[120px] md:text-[160px] font-bold text-primary/10 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Sayfa Bulunamadı
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          Aşağıdaki bağlantılardan devam edebilirsiniz.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Ana Sayfa
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/urunler">
              <Package className="w-4 h-4" />
              Ürünlerimiz
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Yardımcı olabilecek sayfalar:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/"
              className="text-primary hover:underline transition-colors"
            >
              Ana Sayfa
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/urunler"
              className="text-primary hover:underline transition-colors"
            >
              Ürünler
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/hakkimizda"
              className="text-primary hover:underline transition-colors"
            >
              Hakkımızda
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/iletisim"
              className="text-primary hover:underline transition-colors"
            >
              İletişim
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 p-4 bg-card rounded-xl border border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Bir sorun mu var? Bize ulaşın:
          </p>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/iletisim">
              <Phone className="w-4 h-4" />
              İletişime Geç
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
