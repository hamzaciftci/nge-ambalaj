import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

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
          siteName: "NG Ambalaj",
          phone: "+90 212 123 45 67",
          email: "info@ngambalaj.com",
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
      update: body,
      create: {
        id: "default",
        ...body,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Ayarlar güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
