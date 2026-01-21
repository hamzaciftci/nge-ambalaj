import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Layers } from "lucide-react";
import DeleteCategoryButton from "@/components/admin/shared/DeleteCategoryButton";

async function getCategories() {
  return prisma.mainCategory.findMany({
    include: {
      _count: {
        select: { subCategories: true },
      },
    },
    orderBy: { order: "asc" },
  });
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ana Kategoriler</h2>
          <p className="text-muted-foreground">
            Ürün ana kategorilerinizi yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Kategori
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kategoriler ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Henüz kategori eklenmemiş.
              </p>
              <Button asChild>
                <Link href="/admin/categories/new">
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Kategorinizi Ekleyin
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Görsel</TableHead>
                  <TableHead>İsim</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Alt Kategoriler</TableHead>
                  <TableHead className="text-center">Sıra</TableHead>
                  <TableHead className="text-center">Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        {category.nameEn && (
                          <p className="text-sm text-muted-foreground">
                            {category.nameEn}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`/admin/subcategories?mainCategoryId=${category.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Layers className="h-4 w-4" />
                        {category._count.subCategories}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">{category.order}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/categories/${category.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteCategoryButton
                          id={category.id}
                          name={category.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
