import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree, Layers, Package, MessageSquare } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [categoriesCount, subCategoriesCount, productsCount, messagesCount] = await Promise.all([
    prisma.mainCategory.count(),
    prisma.subCategory.count(),
    prisma.product.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
  ]);

  return { categoriesCount, subCategoriesCount, productsCount, messagesCount };
}

async function getRecentMessages() {
  return prisma.contactSubmission.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentMessages = await getRecentMessages();

  const statCards = [
    {
      title: "Ana Kategoriler",
      value: stats.categoriesCount,
      icon: FolderTree,
      href: "/admin/categories",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Alt Kategoriler",
      value: stats.subCategoriesCount,
      icon: Layers,
      href: "/admin/subcategories",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Ürünler",
      value: stats.productsCount,
      icon: Package,
      href: "/admin/products",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Okunmamış Mesajlar",
      value: stats.messagesCount,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Hoş Geldiniz</h2>
        <p className="text-muted-foreground">
          NG Ambalaj yönetim paneline hoş geldiniz. Buradan tüm içeriklerinizi yönetebilirsiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Son Mesajlar</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMessages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Henüz mesaj bulunmuyor.
            </p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                >
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      message.isRead ? "bg-muted" : "bg-primary"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{message.name}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(message.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {message.email}
                    </p>
                    <p className="text-sm mt-1 line-clamp-2">{message.message}</p>
                  </div>
                </div>
              ))}
              <Link
                href="/admin/messages"
                className="block text-center text-sm text-primary hover:underline pt-2"
              >
                Tüm mesajları görüntüle
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
