import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

// GET single hero slide
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
    });

    if (!slide) {
      return NextResponse.json(
        { error: "Slider bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(slide);
  } catch (error) {
    logError("Error fetching hero slide", error);
    return NextResponse.json(
      { error: "Slider yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT update hero slide (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
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
        order,
        isActive,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    logError("Error updating hero slide", error);
    return NextResponse.json(
      { error: "Slider güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE hero slide (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await prisma.heroSlide.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Error deleting hero slide", error);
    return NextResponse.json(
      { error: "Slider silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
