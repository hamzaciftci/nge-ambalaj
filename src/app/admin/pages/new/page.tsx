"use client";

import { useState } from "react";
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
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PageFormData {
  slug: string;
  title: string;
  titleEn: string;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
}

export default function NewPagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<PageFormData>({
    defaultValues: {
      slug: "",
      title: "",
      titleEn: "",
      seoTitle: "",
      seoDescription: "",
      isActive: true,
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/ş/g, "s")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/ı/g, "i")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    form.setValue("slug", slug);
  };

  const onSubmit = async (data: PageFormData) => {
    setLoading(true);
    try {
      const payload = {
        slug: data.slug,
        title: data.title,
        titleEn: data.titleEn,
        content: {},
        contentEn: {},
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        isActive: data.isActive,
      };

      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Oluşturma başarısız");
      }

      toast.success("Sayfa oluşturuldu");
      router.push(`/admin/pages/${data.slug}`);
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Yeni Sayfa</h2>
          <p className="text-muted-foreground">
            Yeni bir içerik sayfası oluşturun
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sayfa Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Başlık zorunludur" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sayfa Başlığı (Türkçe)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Hakkımızda"
                        onChange={(e) => {
                          field.onChange(e);
                          handleTitleChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title (English)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="About Us" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                rules={{ required: "Slug zorunludur" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="hakkimizda" />
                    </FormControl>
                    <FormDescription>
                      Sayfa URL'si: ngeltd.net/{field.value || "slug"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="Sayfa açıklaması..."
                        rows={3}
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

          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Oluştur
          </Button>
        </form>
      </Form>
    </div>
  );
}
