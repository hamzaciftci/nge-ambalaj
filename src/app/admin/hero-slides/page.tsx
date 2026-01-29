"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Loader2, Image as ImageIcon, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface HeroSlide {
  id: string;
  title: string;
  titleEn: string | null;
  subtitle: string | null;
  imageDesktop: string;
  imageMobile: string | null;
  order: number;
  isActive: boolean;
  updatedAt: string;
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchSlides() {
    try {
      const res = await fetch("/api/hero-slides?all=true");
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch {
      // Error already handled by response status check
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu slider'ı silmek istediğinizden emin misiniz?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/hero-slides/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Silme başarısız");

      toast.success("Slider silindi");
      setSlides(slides.filter((s) => s.id !== id));
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setDeleting(null);
    }
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
          <h2 className="text-2xl font-bold tracking-tight">Hero Slider</h2>
          <p className="text-muted-foreground">
            Anasayfa slider görsellerini yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/hero-slides/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Slider
          </Link>
        </Button>
      </div>

      {slides.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Slider bulunamadı</h3>
          <p className="text-muted-foreground">
            Henüz oluşturulmuş slider yok. Yeni bir slider ekleyin.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/hero-slides/new">
              <Plus className="mr-2 h-4 w-4" />
              Slider Ekle
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Sıra</TableHead>
                <TableHead>Görsel</TableHead>
                <TableHead>Başlık</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span>{slide.order + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="relative w-32 h-20 rounded overflow-hidden bg-muted">
                      {slide.imageDesktop ? (
                        <img
                          src={slide.imageDesktop}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{slide.title}</div>
                      {slide.subtitle && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {slide.subtitle}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={slide.isActive ? "default" : "secondary"}>
                      {slide.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/hero-slides/${slide.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(slide.id)}
                        disabled={deleting === slide.id}
                      >
                        {deleting === slide.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
