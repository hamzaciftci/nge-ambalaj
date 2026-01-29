"use client";

import { useEffect, useState, useCallback } from "react";
import i18n from "@/i18n/config";

/**
 * I18nProvider - Handles i18n initialization for SSR/hydration compatibility
 *
 * Key features:
 * - Shows children immediately (no null return causing blank flash)
 * - Updates html lang attribute dynamically when language changes
 * - Gracefully handles hydration mismatch
 */
export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Update html lang attribute when language changes
  const updateHtmlLang = useCallback((lang: string) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Set initial language on html element
    updateHtmlLang(i18n.language || "tr");

    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      updateHtmlLang(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [updateHtmlLang]);

  // Always render children - avoid blank flash during SSR
  // The suppressHydrationWarning on <html> handles any mismatch
  return (
    <div
      suppressHydrationWarning
      style={{ visibility: mounted ? "visible" : "visible" }}
    >
      {children}
    </div>
  );
}
