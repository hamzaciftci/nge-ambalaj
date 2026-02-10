import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST - Seed default menu items (admin only)
export async function POST() {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Check if menu items already exist
    const existingCount = await prisma.menuItem.count();
    if (existingCount > 0) {
      return NextResponse.json({
        message: "Menü öğeleri zaten mevcut",
        count: existingCount
      });
    }

    // Create header menu items
    const headerMenuItems = [
      {
        title: "Ana Sayfa",
        titleEn: "Home",
        href: "/",
        order: 0,
        menuType: "header",
        isProductsMenu: false,
      },
      {
        title: "Ürünler",
        titleEn: "Products",
        href: "/urunler",
        order: 1,
        menuType: "header",
        isProductsMenu: true,
      },
      {
        title: "Hakkımızda",
        titleEn: "About Us",
        href: "/hakkimizda",
        order: 2,
        menuType: "header",
        isProductsMenu: false,
      },
      {
        title: "İletişim",
        titleEn: "Contact",
        href: "/iletisim",
        order: 3,
        menuType: "header",
        isProductsMenu: false,
      },
    ];

    // Create footer menu items
    const footerMenuItems = [
      {
        title: "Ana Sayfa",
        titleEn: "Home",
        href: "/",
        order: 0,
        menuType: "footer",
        isProductsMenu: false,
      },
      {
        title: "Ürünler",
        titleEn: "Products",
        href: "/urunler",
        order: 1,
        menuType: "footer",
        isProductsMenu: false,
      },
      {
        title: "Hakkımızda",
        titleEn: "About Us",
        href: "/hakkimizda",
        order: 2,
        menuType: "footer",
        isProductsMenu: false,
      },
      {
        title: "İletişim",
        titleEn: "Contact",
        href: "/iletisim",
        order: 3,
        menuType: "footer",
        isProductsMenu: false,
      },
    ];

    // Insert all menu items in a single query (fixes N+1 problem)
    const allMenuItems = [...headerMenuItems, ...footerMenuItems];

    const result = await prisma.menuItem.createMany({
      data: allMenuItems,
    });

    return NextResponse.json({
      success: true,
      message: "Varsayılan menü öğeleri oluşturuldu",
      count: result.count
    });
  } catch {
    return NextResponse.json(
      { error: "Menü oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
}
