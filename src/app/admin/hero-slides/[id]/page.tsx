"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface SlideFormData {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  buttonText: string;
  buttonTextEn: string;
  buttonLink: string;
  imageDesktop: string;
  imageMobile: string;
  order: number;
  isActive: boolean;
}

export default function EditHeroSlidePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<SlideFormData>({
    defaultValues: {
      title: "",
      titleEn: "",
      subtitle: "",
      subtitleEn: "",
      buttonText: "",
      buttonTextEn: "",
      buttonLink: "",
      imageDesktop: "",
      imageMobile: "",
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    async function fetchSlide() {
      try {
        const res = await fetch(`/api/hero-slides/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          form.reset({
            title: data.title || "",
            titleEn: data.titleEn || "",
            subtitle: data.subtitle || "",
            subtitleEn: data.subtitleEn || "",
            buttonText: data.buttonText || "",
            buttonTextEn: data.buttonTextEn || "",
            buttonLink: data.buttonLink || "",
            imageDesktop: data.imageDesktop || "",
            imageMobile: data.imageMobile || "",
            order: data.order || 0,
            isActive: data.isActive,
          });
        } else if (res.status === 404) {
          toast.error("Slider bulunamadı");
          router.push("/admin/hero-slides");
        }
      } catch (error) {
        console.error("Error fetching slide:", error);
        toast.error("Slider yüklenirken hata oluştu");
      } finally {
        setFetching(false);
      }
    }
    fetchSlide();
  }, [params.id, form, router]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "imageDesktop" | "imageMobile"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      form.setValue(field, data.url);
      toast.success("Görsel yüklendi");
    } catch (error) {
      toast.error("Görsel yüklenirken hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: SlideFormData) => {
    if (!data.imageDesktop) {
      toast.error("Masaüstü görseli zorunludur");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/hero-slides/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Güncelleme başarısız");

      toast.success("Slider güncellendi");
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu slider'ı silmek istediğinizden emin misiniz?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/hero-slides/${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Silme başarısız");

      toast.success("Slider silindi");
      router.push("/admin/hero-slides");
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setDeleting(false);
    }
  };

  const imageDesktop = form.watch("imageDesktop");
  const imageMobile = form.watch("imageMobile");

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/hero-slides">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Slider Düzenle</h2>
            <p className="text-muted-foreground">
              Slider görselini ve içeriğini düzenleyin
            </p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Sil
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Görseller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageDesktop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Masaüstü Görseli *</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {imageDesktop ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                              <img
                                src={imageDesktop}
                                alt="Desktop"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="absolute bottom-2 right-2"
                                onClick={() => form.setValue("imageDesktop", "")}
                              >
                                Kaldır
                              </Button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading ? (
                                  <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                                ) : (
                                  <>
                                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                      Görsel yükle (1920x1080 önerilir)
                                    </p>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "imageDesktop")}
                                disabled={uploading}
                              />
                            </label>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageMobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobil Görseli (Opsiyonel)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {imageMobile ? (
                            <div className="relative aspect-[9/16] max-w-[200px] rounded-lg overflow-hidden bg-muted">
                              <img
                                src={imageMobile}
                                alt="Mobile"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="absolute bottom-2 right-2"
                                onClick={() => form.setValue("imageMobile", "")}
                              >
                                Kaldır
                              </Button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full max-w-[200px] aspect-[9/16] border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading ? (
                                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                                ) : (
                                  <>
                                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-xs text-muted-foreground text-center px-2">
                                      Mobil görsel
                                    </p>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "imageMobile")}
                                disabled={uploading}
                              />
                            </label>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>İçerik (Türkçe)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Başlık zorunludur" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlık *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="NGE Ambalaj" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Başlık</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Çember ve Streç Çözümleri" rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="buttonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buton Metni</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="İncele" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content (English)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="NGE Packaging" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtitleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Strapping & Stretch Solutions" rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="buttonTextEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Explore" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ayarlar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="buttonLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buton Linki</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/urunler" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sıralama</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Aktif</FormLabel>
                          <FormDescription>
                            Slider anasayfada görünsün
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <Button type="submit" disabled={loading || uploading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Kaydet
          </Button>
        </form>
      </Form>
    </div>
  );
}
