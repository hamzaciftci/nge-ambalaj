import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET single subcategory
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: params.id },
      include: {
        mainCategory: true,
        products: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!subCategory) {
      return NextResponse.json(
        { error: "Alt kategori bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(subCategory);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return NextResponse.json(
      { error: "Alt kategori yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT update subcategory
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
    const { name, nameEn, slug, description, descriptionEn, image, order, isActive, mainCategoryId } = body;

    // Check if slug exists for other subcategory in same main category
    if (slug && mainCategoryId) {
      const existing = await prisma.subCategory.findFirst({
        where: {
          mainCategoryId,
          slug,
          id: { not: params.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Bu slug bu kategoride zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    const subCategory = await prisma.subCategory.update({
      where: { id: params.id },
      data: {
        name,
        nameEn,
        slug,
        description,
        descriptionEn,
        image,
        order,
        isActive,
        mainCategoryId,
      },
    });

    return NextResponse.json(subCategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json(
      { error: "Alt kategori güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE subcategory
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await prisma.subCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json(
      { error: "Alt kategori silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
