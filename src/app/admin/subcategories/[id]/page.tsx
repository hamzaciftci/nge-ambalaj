import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SubCategoryForm from "@/components/admin/forms/SubCategoryForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function getSubCategory(id: string) {
  return prisma.subCategory.findUnique({
    where: { id },
  });
}

export default async function EditSubCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const subCategory = await getSubCategory(params.id);

  if (!subCategory) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/subcategories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alt Kategori Düzenle</h2>
          <p className="text-muted-foreground">{subCategory.name}</p>
        </div>
      </div>

      <SubCategoryForm initialData={subCategory} />
    </div>
  );
}
