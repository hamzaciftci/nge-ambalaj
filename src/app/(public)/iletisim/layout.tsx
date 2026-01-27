import { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | NGE Ambalaj - Bize Ulaşın",
  description:
    "NGE Ambalaj ile iletişime geçin. Adana Organize Sanayi Bölgesi'nde yer alan firmamıza telefon, e-posta veya iletişim formu ile ulaşabilirsiniz. Tel: 0532 643 5501",
  keywords: [
    "NGE Ambalaj iletişim",
    "ambalaj firması iletişim",
    "Adana ambalaj telefon",
    "ambalaj teklif al",
    "endüstriyel ambalaj iletişim",
  ],
  openGraph: {
    title: "İletişim | NGE Ambalaj",
    description:
      "NGE Ambalaj ile iletişime geçin. Sorularınız ve talepleriniz için bizimle iletişime geçin.",
    type: "website",
    locale: "tr_TR",
    siteName: "NGE Ambalaj",
  },
  alternates: {
    canonical: "https://nge-ambalaj.vercel.app/iletisim",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
