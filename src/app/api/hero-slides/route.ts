import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

// GET all hero slides (public - only active, or all for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "true";

    const slides = await prisma.heroSlide.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json(
      { error: "Slider yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST create new hero slide (admin only)
export async function POST(request: Request) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title, titleEn, subtitle, subtitleEn,
      buttonText, buttonTextEn, buttonLink,
      imageDesktop, imageMobile, order, isActive
    } = body;

    if (!title || !imageDesktop) {
      return NextResponse.json(
        { error: "Başlık ve masaüstü görseli zorunludur" },
        { status: 400 }
      );
    }

    // Get the highest order number
    const lastSlide = await prisma.heroSlide.findFirst({
      orderBy: { order: "desc" },
    });
    const newOrder = order ?? (lastSlide ? lastSlide.order + 1 : 0);

    const slide = await prisma.heroSlide.create({
      data: {
        title,
        titleEn,
        subtitle,
        subtitleEn,
        buttonText,
        buttonTextEn,
        buttonLink,
        imageDesktop,
        imageMobile,
        order: newOrder,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error("Error creating hero slide:", error);
    return NextResponse.json(
      { error: "Slider oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
