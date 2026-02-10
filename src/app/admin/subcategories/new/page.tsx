import SubCategoryForm from "@/components/admin/forms/SubCategoryForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewSubCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/subcategories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Yeni Alt Kategori</h2>
          <p className="text-muted-foreground">
            Yeni bir alt kategori oluşturun
          </p>
        </div>
      </div>

      <SubCategoryForm />
    </div>
  );
}
