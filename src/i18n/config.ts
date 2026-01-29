import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import tr from "./locales/tr.json";
import en from "./locales/en.json";

const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

// Check if running on client side
const isClient = typeof window !== "undefined";

// Initialize i18n with SSR-safe configuration
const initI18n = () => {
  // Only use LanguageDetector on client side
  if (isClient) {
    i18n.use(LanguageDetector);
  }

  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "tr",
    lng: isClient ? undefined : "tr", // Default to "tr" on server
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
    detection: isClient
      ? {
          order: ["localStorage", "navigator"],
          caches: ["localStorage"],
        }
      : undefined,
    // React specific options for better SSR handling
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },
  });
};

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  initI18n();
}

export default i18n;
