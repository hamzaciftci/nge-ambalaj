import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

// GET single category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.mainCategory.findUnique({
      where: { id: params.id },
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
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Kategori yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT update category
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
    const { name, nameEn, slug, description, descriptionEn, image, order, isActive } = body;

    // Check if slug exists for other category
    if (slug) {
      const existing = await prisma.mainCategory.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.mainCategory.update({
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
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Kategori güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await prisma.mainCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Kategori silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
