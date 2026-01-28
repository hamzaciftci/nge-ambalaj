"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Menu,
  GripVertical,
  ExternalLink,
  ChevronRight,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  title: string;
  titleEn: string | null;
  href: string | null;
  target: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  parentId: string | null;
  menuType: string;
  isProductsMenu: boolean;
  parent?: MenuItem | null;
  children?: MenuItem[];
}

interface MenuItemFormData {
  title: string;
  titleEn: string;
  href: string;
  target: string;
  order: number;
  isActive: boolean;
  parentId: string;
  menuType: string;
  isProductsMenu: boolean;
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItemFormData>({
    title: "",
    titleEn: "",
    href: "",
    target: "_self",
    order: 0,
    isActive: true,
    parentId: "",
    menuType: "header",
    isProductsMenu: false,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const res = await fetch("/api/menu/all");
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Menü öğeleri yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  const openNewDialog = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      titleEn: "",
      href: "",
      target: "_self",
      order: menuItems.length,
      isActive: true,
      parentId: "",
      menuType: "header",
      isProductsMenu: false,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      titleEn: item.titleEn || "",
      href: item.href || "",
      target: item.target || "_self",
      order: item.order,
      isActive: item.isActive,
      parentId: item.parentId || "",
      menuType: item.menuType,
      isProductsMenu: item.isProductsMenu,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Başlık zorunludur");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        parentId: formData.parentId || null,
        href: formData.href || null,
      };

      const url = editingItem
        ? `/api/menu/${editingItem.id}`
        : "/api/menu";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("İşlem başarısız");

      toast.success(editingItem ? "Menü öğesi güncellendi" : "Menü öğesi oluşturuldu");
      setDialogOpen(false);
      fetchMenuItems();
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu menü öğesini silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Silme başarısız");

      toast.success("Menü öğesi silindi");
      fetchMenuItems();
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const seedDefaultMenu = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/menu/seed", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "İşlem başarısız");
      }

      toast.success(data.message || "Varsayılan menü oluşturuldu");
      fetchMenuItems();
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setSeeding(false);
    }
  };

  // Group menu items by type and organize hierarchy
  const headerItems = menuItems.filter((item) => item.menuType === "header" && !item.parentId);
  const footerItems = menuItems.filter((item) => item.menuType === "footer" && !item.parentId);

  const getChildItems = (parentId: string) => {
    return menuItems.filter((item) => item.parentId === parentId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Menü Yönetimi</h2>
          <p className="text-muted-foreground">
            Site navigasyonunu ve menüleri yönetin
          </p>
        </div>
        <div className="flex items-center gap-2">
          {menuItems.length === 0 && (
            <Button variant="outline" onClick={seedDefaultMenu} disabled={seeding}>
              {seeding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Varsayılan Menüyü Ekle
            </Button>
          )}
          <Button onClick={openNewDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Menü Öğesi
          </Button>
        </div>
      </div>

      {/* Header Menu */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Menu className="h-5 w-5" />
          Header Menüsü
        </h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Başlık</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Sıra</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {headerItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Header menüsü boş. Yeni öğe ekleyin.
                  </TableCell>
                </TableRow>
              ) : (
                headerItems.map((item) => (
                  <>
                    <TableRow key={item.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.title}</div>
                        {item.titleEn && (
                          <div className="text-sm text-muted-foreground">{item.titleEn}</div>
                        )}
                        {item.isProductsMenu && (
                          <Badge variant="secondary" className="mt-1">
                            Ürün Menüsü
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.href ? (
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {item.href}
                          </code>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{item.order}</TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Child items */}
                    {getChildItems(item.id).map((child) => (
                      <TableRow key={child.id} className="bg-muted/30">
                        <TableCell>
                          <ChevronRight className="h-4 w-4 text-muted-foreground ml-4" />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium pl-4">{child.title}</div>
                          {child.titleEn && (
                            <div className="text-sm text-muted-foreground pl-4">{child.titleEn}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {child.href ? (
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {child.href}
                            </code>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{child.order}</TableCell>
                        <TableCell>
                          <Badge variant={child.isActive ? "default" : "secondary"}>
                            {child.isActive ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(child)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(child.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer Menu */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Menu className="h-5 w-5" />
          Footer Menüsü
        </h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Başlık</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Sıra</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {footerItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Footer menüsü boş. Yeni öğe ekleyin.
                  </TableCell>
                </TableRow>
              ) : (
                footerItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.title}</div>
                      {item.titleEn && (
                        <div className="text-sm text-muted-foreground">{item.titleEn}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.href ? (
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {item.href}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Menü Öğesi Düzenle" : "Yeni Menü Öğesi"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Başlık (Türkçe) *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ana Sayfa"
                />
              </div>
              <div className="space-y-2">
                <Label>Title (English)</Label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEn: e.target.value })
                  }
                  placeholder="Home"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input
                value={formData.href}
                onChange={(e) =>
                  setFormData({ ...formData, href: e.target.value })
                }
                placeholder="/hakkimizda veya https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Menü Tipi</Label>
                <Select
                  value={formData.menuType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, menuType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hedef</Label>
                <Select
                  value={formData.target}
                  onValueChange={(value) =>
                    setFormData({ ...formData, target: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Aynı Sekme</SelectItem>
                    <SelectItem value="_blank">Yeni Sekme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Üst Menü</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Yok (Ana Menü)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Yok (Ana Menü)</SelectItem>
                    {menuItems
                      .filter(
                        (item) =>
                          !item.parentId &&
                          item.menuType === formData.menuType &&
                          item.id !== editingItem?.id
                      )
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sıra</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Aktif</Label>
                <p className="text-sm text-muted-foreground">
                  Bu menü öğesi görünür olsun
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Ürün Kategorileri Menüsü</Label>
                <p className="text-sm text-muted-foreground">
                  Alt menüde ürün kategorileri otomatik gösterilsin
                </p>
              </div>
              <Switch
                checked={formData.isProductsMenu}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isProductsMenu: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingItem ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
