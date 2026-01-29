import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

// GET all menu items for admin (includes inactive)
export async function GET() {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const menuItems = await prisma.menuItem.findMany({
      include: {
        children: {
          orderBy: { order: "asc" },
        },
        parent: true,
      },
      orderBy: [{ menuType: "asc" }, { order: "asc" }],
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    logError("Error fetching menu items", error);
    return NextResponse.json(
      { error: "Menü öğeleri yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
