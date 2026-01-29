import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.mainCategory.findMany({
      include: {
        subCategories: {
          include: {
            _count: {
              select: { products: true },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    logError("Error fetching categories", error);
    return NextResponse.json(
      { error: "Kategoriler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: Request) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { name, nameEn, slug, description, descriptionEn, image, order, isActive } = body;

    if (!name || !slug || !description || !image) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existing = await prisma.mainCategory.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const category = await prisma.mainCategory.create({
      data: {
        name,
        nameEn,
        slug,
        description,
        descriptionEn,
        image,
        order: order || 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    logError("Error creating category", error);
    return NextResponse.json(
      { error: "Kategori oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
