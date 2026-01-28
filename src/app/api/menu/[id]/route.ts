import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET single menu item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: {
        children: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menü öğesi bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { error: "Menü öğesi yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT update menu item
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
      title,
      titleEn,
      href,
      target,
      icon,
      order,
      isActive,
      parentId,
      menuType,
      isProductsMenu,
    } = body;

    const menuItem = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        title,
        titleEn,
        href,
        target,
        icon,
        order,
        isActive,
        parentId,
        menuType,
        isProductsMenu,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Menü öğesi güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE menu item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await prisma.menuItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Menü öğesi silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
