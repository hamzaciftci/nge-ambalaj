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
import { Plus, Pencil, Package } from "lucide-react";
import DeleteSubCategoryButton from "@/components/admin/shared/DeleteSubCategoryButton";

async function getSubCategories(mainCategoryId?: string) {
  return prisma.subCategory.findMany({
    where: mainCategoryId ? { mainCategoryId } : {},
    include: {
      mainCategory: true,
      _count: {
        select: { products: true },
      },
    },
    orderBy: [{ mainCategory: { order: "asc" } }, { order: "asc" }],
  });
}

async function getMainCategories() {
  return prisma.mainCategory.findMany({
    orderBy: { order: "asc" },
  });
}

export default async function SubCategoriesPage({
  searchParams,
}: {
  searchParams: { mainCategoryId?: string };
}) {
  const [subCategories, mainCategories] = await Promise.all([
    getSubCategories(searchParams.mainCategoryId),
    getMainCategories(),
  ]);

  const selectedCategory = searchParams.mainCategoryId
    ? mainCategories.find((c) => c.id === searchParams.mainCategoryId)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alt Kategoriler</h2>
          <p className="text-muted-foreground">
            {selectedCategory
              ? `${selectedCategory.name} kategorisinin alt kategorileri`
              : "Tüm alt kategorileri yönetin"}
          </p>
        </div>
        <Button asChild>
          <Link
            href={
              searchParams.mainCategoryId
                ? `/admin/subcategories/new?mainCategoryId=${searchParams.mainCategoryId}`
                : "/admin/subcategories/new"
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Yeni Alt Kategori
          </Link>
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/subcategories">
              <Badge
                variant={!searchParams.mainCategoryId ? "default" : "outline"}
                className="cursor-pointer"
              >
                Tümü
              </Badge>
            </Link>
            {mainCategories.map((cat) => (
              <Link key={cat.id} href={`/admin/subcategories?mainCategoryId=${cat.id}`}>
                <Badge
                  variant={searchParams.mainCategoryId === cat.id ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alt Kategoriler ({subCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {subCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Henüz alt kategori eklenmemiş.
              </p>
              <Button asChild>
                <Link href="/admin/subcategories/new">
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Alt Kategorinizi Ekleyin
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Görsel</TableHead>
                  <TableHead>İsim</TableHead>
                  <TableHead>Ana Kategori</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Ürünler</TableHead>
                  <TableHead className="text-center">Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subCategories.map((subCategory) => (
                  <TableRow key={subCategory.id}>
                    <TableCell>
                      {subCategory.image ? (
                        <img
                          src={subCategory.image}
                          alt={subCategory.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{subCategory.name}</p>
                        {subCategory.nameEn && (
                          <p className="text-sm text-muted-foreground">
                            {subCategory.nameEn}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{subCategory.mainCategory.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {subCategory.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`/admin/products?subCategoryId=${subCategory.id}`}
                        className="text-primary hover:underline"
                      >
                        {subCategory._count.products}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={subCategory.isActive ? "default" : "secondary"}>
                        {subCategory.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/subcategories/${subCategory.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteSubCategoryButton
                          id={subCategory.id}
                          name={subCategory.name}
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
