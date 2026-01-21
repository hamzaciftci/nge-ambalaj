import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/forms/ProductForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });
}

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

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ürün Düzenle</h2>
          <p className="text-muted-foreground">{product.name}</p>
        </div>
      </div>

      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
