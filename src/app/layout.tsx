import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import I18nProvider from "@/components/providers/I18nProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nge-ambalaj.vercel.app"),
  title: {
    default: "NGE Ambalaj | Endüstriyel Ambalaj Çözümleri - Adana",
    template: "%s | NGE Ambalaj",
  },
  description:
    "NGE Ambalaj - Çemberleme makineleri, PET & çelik çemberler, streç filmler ve endüstriyel ambalaj malzemeleri. Adana OSB'de 10+ yıllık tecrübe.",
  keywords: [
    "ambalaj",
    "çemberleme makinesi",
    "PET çember",
    "çelik çember",
    "streç film",
    "endüstriyel ambalaj",
    "Adana ambalaj",
    "NGE Ambalaj",
  ],
  authors: [{ name: "NGE Ambalaj" }],
  creator: "NGE Ambalaj",
  publisher: "NGE Ambalaj",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "NGE Ambalaj",
    title: "NGE Ambalaj | Endüstriyel Ambalaj Çözümleri",
    description:
      "Çemberleme makineleri, PET & çelik çemberler, streç filmler ve endüstriyel ambalaj malzemeleri. 10+ yıllık tecrübe.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NGE Ambalaj | Endüstriyel Ambalaj Çözümleri",
    description:
      "Çemberleme makineleri, PET & çelik çemberler, streç filmler ve endüstriyel ambalaj malzemeleri.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
