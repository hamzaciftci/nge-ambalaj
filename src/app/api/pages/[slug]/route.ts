import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

// GET single page by slug (public)
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: params.slug },
    });

    if (!page) {
      return NextResponse.json(
        { error: "Sayfa bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    logError("Error fetching page", error);
    return NextResponse.json(
      { error: "Sayfa yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT update page (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { title, titleEn, content, contentEn, seoTitle, seoTitleEn, seoDescription, seoDescriptionEn, seoKeywords, seoKeywordsEn, isActive } = body;

    const page = await prisma.page.update({
      where: { slug: params.slug },
      data: {
        title,
        titleEn,
        content,
        contentEn,
        seoTitle,
        seoTitleEn,
        seoDescription,
        seoDescriptionEn,
        seoKeywords,
        seoKeywordsEn,
        isActive,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    logError("Error updating page", error);
    return NextResponse.json(
      { error: "Sayfa güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE page (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await prisma.page.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Error deleting page", error);
    return NextResponse.json(
      { error: "Sayfa silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
