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
import { Plus, Pencil, Star } from "lucide-react";
import DeleteProductButton from "@/components/admin/shared/DeleteProductButton";

async function getProducts() {
  return prisma.product.findMany({
    include: {
      subCategory: {
        include: {
          mainCategory: true,
        },
      },
    },
    orderBy: [{ subCategory: { mainCategory: { order: "asc" } } }, { order: "asc" }],
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ürünler</h2>
          <p className="text-muted-foreground">
            Tüm ürünlerinizi yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ürün
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ürünler ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Henüz ürün eklenmemiş.
              </p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Ürününüzü Ekleyin
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Görsel</TableHead>
                  <TableHead>İsim</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-center">Öne Çıkan</TableHead>
                  <TableHead className="text-center">Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.nameEn && (
                          <p className="text-sm text-muted-foreground">
                            {product.nameEn}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{product.subCategory.mainCategory.name}</p>
                        <p className="text-muted-foreground">
                          {product.subCategory.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {product.isFeatured && (
                        <Star className="h-4 w-4 text-yellow-500 mx-auto fill-current" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteProductButton
                          id={product.id}
                          name={product.name}
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
