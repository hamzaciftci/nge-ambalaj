import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET settings (public)
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "default",
          siteName: "NGE Ambalaj",
          phone: "0532 643 5501",
          phone2: "0533 357 5292",
          email: "info@ngeltd.net",
          address: "Adana Organize Sanayi Bölgesi T.Özal Blv. No:6 Z:14 Sarıçam / ADANA",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Ayarlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT update settings (admin only)
export async function PUT(request: Request) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        siteName: body.siteName,
        siteNameEn: body.siteNameEn,
        phone: body.phone,
        phone2: body.phone2,
        email: body.email,
        whatsapp: body.whatsapp,
        address: body.address,
        addressEn: body.addressEn,
        workingHours: body.workingHours,
        workingHoursEn: body.workingHoursEn,
        mapEmbedUrl: body.mapEmbedUrl,
        socialLinks: body.socialLinks,
        logoUrl: body.logoUrl,
        faviconUrl: body.faviconUrl,
        footerText: body.footerText,
        footerTextEn: body.footerTextEn,
        defaultSeoTitle: body.defaultSeoTitle,
        defaultSeoTitleEn: body.defaultSeoTitleEn,
        defaultSeoDescription: body.defaultSeoDescription,
        defaultSeoDescriptionEn: body.defaultSeoDescriptionEn,
      },
      create: {
        id: "default",
        siteName: body.siteName || "NGE Ambalaj",
        siteNameEn: body.siteNameEn,
        phone: body.phone,
        phone2: body.phone2,
        email: body.email,
        whatsapp: body.whatsapp,
        address: body.address,
        addressEn: body.addressEn,
        workingHours: body.workingHours,
        workingHoursEn: body.workingHoursEn,
        mapEmbedUrl: body.mapEmbedUrl,
        socialLinks: body.socialLinks,
        logoUrl: body.logoUrl,
        faviconUrl: body.faviconUrl,
        footerText: body.footerText,
        footerTextEn: body.footerTextEn,
        defaultSeoTitle: body.defaultSeoTitle,
        defaultSeoTitleEn: body.defaultSeoTitleEn,
        defaultSeoDescription: body.defaultSeoDescription,
        defaultSeoDescriptionEn: body.defaultSeoDescriptionEn,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Ayarlar güncellenirken bir hata oluştu: ${errorMessage}` },
      { status: 500 }
    );
  }
}
