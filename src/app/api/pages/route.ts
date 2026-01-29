import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

// GET all pages (admin only)
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(pages);
  } catch (error) {
    logError("Error fetching pages", error);
    return NextResponse.json(
      { error: "Sayfalar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST create new page (admin only)
export async function POST(request: Request) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, titleEn, content, contentEn, seoTitle, seoTitleEn, seoDescription, seoDescriptionEn, seoKeywords, seoKeywordsEn, isActive } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug ve başlık zorunludur" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const page = await prisma.page.create({
      data: {
        slug,
        title,
        titleEn,
        content: content || {},
        contentEn,
        seoTitle,
        seoTitleEn,
        seoDescription,
        seoDescriptionEn,
        seoKeywords,
        seoKeywordsEn,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    logError("Error creating page", error);
    return NextResponse.json(
      { error: "Sayfa oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
