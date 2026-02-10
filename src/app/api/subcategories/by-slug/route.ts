import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mainCategorySlug = searchParams.get("mainCategory");
    const subCategorySlug = searchParams.get("subCategory");

    if (!mainCategorySlug || !subCategorySlug) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const mainCategory = await prisma.mainCategory.findUnique({
      where: { slug: mainCategorySlug, isActive: true },
    });

    if (!mainCategory) {
      return NextResponse.json({ error: "Main category not found" }, { status: 404 });
    }

    const subCategory = await prisma.subCategory.findFirst({
      where: {
        slug: subCategorySlug,
        mainCategoryId: mainCategory.id,
        isActive: true,
      },
      include: {
        mainCategory: {
          select: {
            name: true,
            nameEn: true,
            slug: true,
          },
        },
        products: {
          where: { isActive: true },
          orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
          select: {
            id: true,
            name: true,
            nameEn: true,
            slug: true,
            description: true,
            descriptionEn: true,
            image: true,
            isFeatured: true,
          },
        },
      },
    });

    if (!subCategory) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }

    return NextResponse.json(subCategory);
  } catch (error) {
    logError("Error fetching subcategory by slug", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
