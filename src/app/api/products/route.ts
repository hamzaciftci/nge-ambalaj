import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

// GET all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subCategoryId = searchParams.get("subCategoryId");
    const mainCategoryId = searchParams.get("mainCategoryId");
    const featured = searchParams.get("featured");

    const where: any = {};
    if (subCategoryId) where.subCategoryId = subCategoryId;
    if (mainCategoryId) where.subCategory = { mainCategoryId };
    if (featured === "true") where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      include: {
        subCategory: {
          include: {
            mainCategory: true,
          },
        },
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Ürünler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: Request) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      nameEn,
      slug,
      description,
      descriptionEn,
      longDescription,
      longDescriptionEn,
      image,
      images,
      order,
      isActive,
      isFeatured,
      subCategoryId,
    } = body;

    if (!name || !slug || !description || !image || !subCategoryId) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    // Check if slug exists for this subcategory
    const existing = await prisma.product.findFirst({
      where: {
        subCategoryId,
        slug,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu slug bu alt kategoride zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        nameEn,
        slug,
        description,
        descriptionEn,
        longDescription,
        longDescriptionEn,
        image,
        order: order || 0,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        subCategoryId,
        images: images?.length
          ? {
              create: images.map((img: { url: string; alt?: string }, index: number) => ({
                url: img.url,
                alt: img.alt,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Ürün oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
