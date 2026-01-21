import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/forms/CategoryForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getCategory(id: string) {
  return prisma.mainCategory.findUnique({
    where: { id },
  });
}

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategory(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kategori Düzenle</h2>
          <p className="text-muted-foreground">{category.name}</p>
        </div>
      </div>

      <CategoryForm initialData={category} />
    </div>
  );
}
