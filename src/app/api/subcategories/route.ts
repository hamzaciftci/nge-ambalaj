import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

// GET all subcategories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mainCategoryId = searchParams.get("mainCategoryId");

    const where = mainCategoryId ? { mainCategoryId } : {};

    const subCategories = await prisma.subCategory.findMany({
      where,
      include: {
        mainCategory: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Alt kategoriler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST create new subcategory
export async function POST(request: Request) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { name, nameEn, slug, description, descriptionEn, image, order, isActive, mainCategoryId } = body;

    if (!name || !slug || !description || !mainCategoryId) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    // Check if slug exists for this main category
    const existing = await prisma.subCategory.findFirst({
      where: {
        mainCategoryId,
        slug,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu slug bu kategoride zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const subCategory = await prisma.subCategory.create({
      data: {
        name,
        nameEn,
        slug,
        description,
        descriptionEn,
        image,
        order: order || 0,
        isActive: isActive ?? true,
        mainCategoryId,
      },
    });

    return NextResponse.json(subCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Alt kategori oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
