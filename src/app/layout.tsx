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
  title: "NG Ambalaj | Endüstriyel Ambalaj Çözümleri",
  description: "Çemberleme makineleri, ambalaj malzemeleri ve endüstriyel yağlar. 20+ yıllık deneyim ile profesyonel ambalaj çözümleri.",
  keywords: ["ambalaj", "çemberleme", "endüstriyel", "paketleme", "streç film", "çelik çember"],
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
