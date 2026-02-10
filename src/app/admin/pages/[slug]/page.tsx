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
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PageFormData {
  title: string;
  titleEn: string;
  seoTitle: string;
  seoTitleEn: string;
  seoDescription: string;
  seoDescriptionEn: string;
  seoKeywords: string;
  seoKeywordsEn: string;
  isActive: boolean;
  // Content sections
  heroTitle: string;
  heroTitleEn: string;
  heroSubtitle: string;
  heroSubtitleEn: string;
  mainContent: string;
  mainContentEn: string;
}

export default function EditPagePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<PageFormData>({
    defaultValues: {
      title: "",
      titleEn: "",
      seoTitle: "",
      seoTitleEn: "",
      seoDescription: "",
      seoDescriptionEn: "",
      seoKeywords: "",
      seoKeywordsEn: "",
      isActive: true,
      heroTitle: "",
      heroTitleEn: "",
      heroSubtitle: "",
      heroSubtitleEn: "",
      mainContent: "",
      mainContentEn: "",
    },
  });

  // Fetch page data when slug changes - form.reset and router.push are stable
  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/pages/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          const content = data.content || {};
          const contentEn = data.contentEn || {};

          form.reset({
            title: data.title || "",
            titleEn: data.titleEn || "",
            seoTitle: data.seoTitle || "",
            seoTitleEn: data.seoTitleEn || "",
            seoDescription: data.seoDescription || "",
            seoDescriptionEn: data.seoDescriptionEn || "",
            seoKeywords: data.seoKeywords || "",
            seoKeywordsEn: data.seoKeywordsEn || "",
            isActive: data.isActive,
            heroTitle: content.heroTitle || "",
            heroTitleEn: contentEn.heroTitle || "",
            heroSubtitle: content.heroSubtitle || "",
            heroSubtitleEn: contentEn.heroSubtitle || "",
            mainContent: content.mainContent || "",
            mainContentEn: contentEn.mainContent || "",
          });
        } else if (res.status === 404) {
          toast.error("Sayfa bulunamadı");
          router.push("/admin/pages");
        }
      } catch {
        toast.error("Sayfa yüklenirken hata oluştu");
      } finally {
        setFetching(false);
      }
    }
    fetchPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  const onSubmit = async (data: PageFormData) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        titleEn: data.titleEn,
        seoTitle: data.seoTitle,
        seoTitleEn: data.seoTitleEn,
        seoDescription: data.seoDescription,
        seoDescriptionEn: data.seoDescriptionEn,
        seoKeywords: data.seoKeywords,
        seoKeywordsEn: data.seoKeywordsEn,
        isActive: data.isActive,
        content: {
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          mainContent: data.mainContent,
        },
        contentEn: {
          heroTitle: data.heroTitleEn,
          heroSubtitle: data.heroSubtitleEn,
          mainContent: data.mainContentEn,
        },
      };

      const res = await fetch(`/api/pages/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Güncelleme başarısız");

      toast.success("Sayfa güncellendi");
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu sayfayı silmek istediğinizden emin misiniz?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/pages/${params.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Silme başarısız");

      toast.success("Sayfa silindi");
      router.push("/admin/pages");
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setDeleting(false);
    }
  };

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
            <Link href="/admin/pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sayfa Düzenle</h2>
            <p className="text-muted-foreground">
              <code className="text-sm bg-muted px-2 py-1 rounded">
                /{params.slug}
              </code>
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
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList>
              <TabsTrigger value="content">İçerik</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Ayarlar</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Türkçe İçerik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sayfa Başlığı</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Hakkımızda" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heroTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Başlık</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sayfa üst başlığı" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heroSubtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Alt Başlık</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Kısa açıklama" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mainContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ana İçerik</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Sayfa içeriği..."
                            rows={10}
                          />
                        </FormControl>
                        <FormDescription>
                          Markdown formatı desteklenir
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>English Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="About Us" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heroTitleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Page header title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heroSubtitleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Subtitle</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Short description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mainContentEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Content</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Page content..."
                            rows={10}
                          />
                        </FormControl>
                        <FormDescription>
                          Markdown format supported
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Ayarları (Türkçe)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Başlığı</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Hakkımızda | NGE Ambalaj" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Açıklaması</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Sayfa açıklaması (max 160 karakter)"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anahtar Kelimeler</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ambalaj, çember, streç" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings (English)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seoTitleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="About Us | NGE Packaging" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoDescriptionEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Page description (max 160 characters)"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoKeywordsEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="packaging, strapping, stretch" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Sayfa Ayarları</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Aktif</FormLabel>
                          <FormDescription>
                            Sayfa sitede görünür olsun
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
            </TabsContent>
          </Tabs>

          <Button type="submit" disabled={loading}>
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
