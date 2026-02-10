import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Validation schema for social links
const socialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
}).optional();

// Validation schema for settings - whitelist allowed fields
const settingsSchema = z.object({
  siteName: z.string().max(100).optional(),
  siteNameEn: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  phone2: z.string().max(30).optional().nullable(),
  email: z.string().email().max(255).optional().nullable().or(z.literal("")),
  whatsapp: z.string().max(30).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  addressEn: z.string().max(500).optional().nullable(),
  workingHours: z.string().max(500).optional().nullable(),
  workingHoursEn: z.string().max(500).optional().nullable(),
  mapEmbedUrl: z.string().url().max(2000).optional().nullable().or(z.literal("")),
  socialLinks: socialLinksSchema,
  logoUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  faviconUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  footerText: z.string().max(1000).optional().nullable(),
  footerTextEn: z.string().max(1000).optional().nullable(),
  defaultSeoTitle: z.string().max(200).optional().nullable(),
  defaultSeoTitleEn: z.string().max(200).optional().nullable(),
  defaultSeoDescription: z.string().max(500).optional().nullable(),
  defaultSeoDescriptionEn: z.string().max(500).optional().nullable(),
});

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
  } catch {
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

    // Validate and whitelist input
    const validation = settingsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Clean empty strings to null for URL fields
    const cleanData = {
      ...validatedData,
      mapEmbedUrl: validatedData.mapEmbedUrl || null,
      logoUrl: validatedData.logoUrl || null,
      faviconUrl: validatedData.faviconUrl || null,
      email: validatedData.email || null,
    };

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: cleanData,
      create: {
        id: "default",
        siteName: cleanData.siteName || "NGE Ambalaj",
        ...cleanData,
      },
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Ayarlar güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
