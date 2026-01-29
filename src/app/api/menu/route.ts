import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

// GET all menu items (public for header/footer)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const menuType = searchParams.get("type") || "header";

    const menuItems = await prisma.menuItem.findMany({
      where: {
        menuType,
        parentId: null, // Only get top-level items
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    logError("Error fetching menu", error);
    return NextResponse.json(
      { error: "Menü yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST create new menu item (admin only)
export async function POST(request: Request) {
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

    if (!title) {
      return NextResponse.json(
        { error: "Başlık zorunludur" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        title,
        titleEn,
        href,
        target,
        icon,
        order: order || 0,
        isActive: isActive ?? true,
        parentId,
        menuType: menuType || "header",
        isProductsMenu: isProductsMenu || false,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    logError("Error creating menu item", error);
    return NextResponse.json(
      { error: "Menü öğesi oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
}
