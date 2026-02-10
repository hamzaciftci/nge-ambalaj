import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/forms/ProductForm";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getCategories() {
  return prisma.mainCategory.findMany({
    include: {
      subCategories: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Yeni Ürün</h2>
          <p className="text-muted-foreground">Yeni bir ürün oluşturun</p>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
