"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logError } from "@/lib/logger";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for debugging (only logs in development, suppressed in production)
    logError("Route segment error occurred", error, {
      digest: error.digest,
      name: error.name,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        {/* Error Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Bir Hata Oluştu
        </h1>

        {/* Error Description */}
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenilemeyi deneyin
          veya ana sayfaya dönün.
        </p>

        {/* Error Digest (only in development for debugging) */}
        {process.env.NODE_ENV === "development" && error.digest && (
          <p className="text-xs text-muted-foreground/60 mb-6 font-mono bg-muted/50 p-2 rounded">
            Hata Kodu: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="default"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Ana Sayfa
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <p className="mt-8 text-sm text-muted-foreground">
          Sorun devam ederse{" "}
          <Link href="/iletisim" className="text-primary hover:underline">
            bizimle iletişime geçin
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
