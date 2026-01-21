import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { mainCategory: string; subCategory: string; productSlug: string } }
) {
  try {
    // First find the main category
    const mainCategory = await prisma.mainCategory.findUnique({
      where: { slug: params.mainCategory, isActive: true },
    });

    if (!mainCategory) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }

    // Then find the subcategory
    const subCategory = await prisma.subCategory.findFirst({
      where: {
        slug: params.subCategory,
        mainCategoryId: mainCategory.id,
        isActive: true,
      },
    });

    if (!subCategory) {
      return NextResponse.json({ error: "Alt kategori bulunamadı" }, { status: 404 });
    }

    // Finally find the product
    const product = await prisma.product.findFirst({
      where: {
        slug: params.productSlug,
        subCategoryId: subCategory.id,
        isActive: true,
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        subCategory: {
          include: {
            mainCategory: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Ürün yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
