"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  nameEn: z.string().optional(),
  slug: z.string().min(2, "Slug en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  descriptionEn: z.string().optional(),
  longDescription: z.string().optional(),
  longDescriptionEn: z.string().optional(),
  image: z.string().min(1, "Görsel gereklidir"),
  order: z.number().min(0),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  subCategoryId: z.string().min(1, "Alt kategori seçiniz"),
});

type FormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    nameEn?: string | null;
    slug: string;
    description: string;
    descriptionEn?: string | null;
    longDescription?: string | null;
    longDescriptionEn?: string | null;
    image: string;
    order: number;
    isActive: boolean;
    isFeatured: boolean;
    subCategoryId: string;
    images?: { url: string; alt?: string | null }[];
  };
  categories: {
    id: string;
    name: string;
    subCategories: { id: string; name: string }[];
  }[];
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ url: string; alt?: string }[]>(
    initialData?.images?.map(img => ({ url: img.url, alt: img.alt || "" })) || []
  );
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      nameEn: initialData?.nameEn || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      descriptionEn: initialData?.descriptionEn || "",
      longDescription: initialData?.longDescription || "",
      longDescriptionEn: initialData?.longDescriptionEn || "",
      image: initialData?.image || "",
      order: initialData?.order || 0,
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      subCategoryId: initialData?.subCategoryId || "",
    },
  });

  // Set initial main category based on subcategory
  useEffect(() => {
    if (initialData?.subCategoryId) {
      const category = categories.find(cat =>
        cat.subCategories.some(sub => sub.id === initialData.subCategoryId)
      );
      if (category) {
        setSelectedMainCategory(category.id);
      }
    }
  }, [initialData, categories]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!initialData) {
      form.setValue("slug", generateSlug(value));
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Yükleme başarısız");
      }

      const { url } = await res.json();
      onSuccess(url);
      toast.success("Görsel yüklendi");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const selectedCategory = categories.find(c => c.id === selectedMainCategory);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const url = initialData
        ? `/api/products/${initialData.id}`
        : "/api/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images: galleryImages.length > 0 ? galleryImages : undefined,
        }),
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "İşlem başarısız");
      }

      toast.success(initialData ? "Ürün güncellendi" : "Ürün oluşturuldu");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Kategori Seçimi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ana Kategori *</label>
                <Select
                  value={selectedMainCategory}
                  onValueChange={(value) => {
                    setSelectedMainCategory(value);
                    form.setValue("subCategoryId", "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ana kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FormField
                control={form.control}
                name="subCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Kategori *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedMainCategory}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Alt kategori seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCategory?.subCategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Turkish Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Türkçe İçerik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ürün Adı *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Örn: A337 MicroLock"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kısa Açıklama *</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Kısa ürün açıklaması..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detaylı Açıklama</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Detaylı ürün açıklaması (Markdown destekler)..."
                        rows={8}
                      />
                    </FormControl>
                    <FormDescription>Markdown formatı desteklenir</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* English Fields */}
          <Card>
            <CardHeader>
              <CardTitle>İngilizce İçerik (Opsiyonel)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g: A337 MicroLock" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Short product description..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Detailed product description (Markdown supported)..."
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Görseller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ana Görsel *</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value && (
                        <div className="relative w-48 h-32">
                          <img
                            src={field.value}
                            alt="Ürün görseli"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => field.onChange("")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <Input
                          {...field}
                          placeholder="Görsel URL'si veya yükleyin"
                          className="flex-1"
                        />
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, (url) => field.onChange(url))}
                            disabled={uploading}
                          />
                          <Button type="button" variant="outline" disabled={uploading} asChild>
                            <span>
                              {uploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gallery */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Galeri Görselleri</label>
              <div className="flex flex-wrap gap-4">
                {galleryImages.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={img.url}
                      alt={`Galeri ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5"
                      onClick={() => removeGalleryImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, (url) => setGalleryImages(prev => [...prev, { url, alt: "" }]))}
                    disabled={uploading}
                  />
                  <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Ayarlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="a337-microlock" />
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
                    <FormLabel>Sıra</FormLabel>
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Aktif</FormLabel>
                      <FormDescription>Ürün sitede görüntülensin mi?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Öne Çıkan</FormLabel>
                      <FormDescription>Ana sayfada gösterilsin mi?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Güncelle" : "Oluştur"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            İptal
          </Button>
        </div>
      </form>
    </Form>
  );
}
