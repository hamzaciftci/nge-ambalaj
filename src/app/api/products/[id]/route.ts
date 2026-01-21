import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

// GET single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
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
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
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

// PUT update product
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

    // Check if slug exists for other product in same subcategory
    if (slug && subCategoryId) {
      const existing = await prisma.product.findFirst({
        where: {
          subCategoryId,
          slug,
          id: { not: params.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Bu slug bu alt kategoride zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    // Delete existing images if new images provided
    if (images) {
      await prisma.productImage.deleteMany({
        where: { productId: params.id },
      });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        nameEn,
        slug,
        description,
        descriptionEn,
        longDescription,
        longDescriptionEn,
        image,
        order,
        isActive,
        isFeatured,
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

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Ürün güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Ürün silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
