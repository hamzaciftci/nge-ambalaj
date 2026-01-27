"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface SettingsData {
  siteName: string;
  siteNameEn: string;
  phone: string;
  phone2: string;
  email: string;
  whatsapp: string;
  address: string;
  addressEn: string;
  workingHours: string;
  workingHoursEn: string;
  mapEmbedUrl: string;
  footerText: string;
  footerTextEn: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  defaultSeoTitle: string;
  defaultSeoTitleEn: string;
  defaultSeoDescription: string;
  defaultSeoDescriptionEn: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm<SettingsData>({
    defaultValues: {
      siteName: "",
      siteNameEn: "",
      phone: "",
      phone2: "",
      email: "",
      whatsapp: "",
      address: "",
      addressEn: "",
      workingHours: "",
      workingHoursEn: "",
      mapEmbedUrl: "",
      footerText: "",
      footerTextEn: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      defaultSeoTitle: "",
      defaultSeoTitleEn: "",
      defaultSeoDescription: "",
      defaultSeoDescriptionEn: "",
    },
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          const socialLinks = data.socialLinks || {};

          form.reset({
            siteName: data.siteName || "",
            siteNameEn: data.siteNameEn || "",
            phone: data.phone || "",
            phone2: data.phone2 || "",
            email: data.email || "",
            whatsapp: data.whatsapp || "",
            address: data.address || "",
            addressEn: data.addressEn || "",
            workingHours: data.workingHours || "",
            workingHoursEn: data.workingHoursEn || "",
            mapEmbedUrl: data.mapEmbedUrl || "",
            footerText: data.footerText || "",
            footerTextEn: data.footerTextEn || "",
            facebook: socialLinks.facebook || "",
            instagram: socialLinks.instagram || "",
            linkedin: socialLinks.linkedin || "",
            twitter: socialLinks.twitter || "",
            youtube: socialLinks.youtube || "",
            defaultSeoTitle: data.defaultSeoTitle || "",
            defaultSeoTitleEn: data.defaultSeoTitleEn || "",
            defaultSeoDescription: data.defaultSeoDescription || "",
            defaultSeoDescriptionEn: data.defaultSeoDescriptionEn || "",
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setFetching(false);
      }
    }
    fetchSettings();
  }, [form]);

  const onSubmit = async (data: SettingsData) => {
    setLoading(true);
    try {
      const payload = {
        siteName: data.siteName,
        siteNameEn: data.siteNameEn,
        phone: data.phone,
        phone2: data.phone2,
        email: data.email,
        whatsapp: data.whatsapp,
        address: data.address,
        addressEn: data.addressEn,
        workingHours: data.workingHours,
        workingHoursEn: data.workingHoursEn,
        mapEmbedUrl: data.mapEmbedUrl,
        footerText: data.footerText,
        footerTextEn: data.footerTextEn,
        socialLinks: {
          facebook: data.facebook,
          instagram: data.instagram,
          linkedin: data.linkedin,
          twitter: data.twitter,
          youtube: data.youtube,
        },
        defaultSeoTitle: data.defaultSeoTitle,
        defaultSeoTitleEn: data.defaultSeoTitleEn,
        defaultSeoDescription: data.defaultSeoDescription,
        defaultSeoDescriptionEn: data.defaultSeoDescriptionEn,
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let responseData;
      const responseText = await res.text();
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        console.error("API Response (not JSON):", responseText);
        throw new Error(`Sunucu hatası (${res.status}): ${responseText.substring(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(responseData?.error || `Kaydetme başarısız (${res.status})`);
      }

      toast.success("Ayarlar kaydedildi");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
      toast.error(errorMessage);
      console.error("Settings save error:", error);
    } finally {
      setLoading(false);
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Site Ayarları</h2>
        <p className="text-muted-foreground">
          Genel site ayarlarını ve iletişim bilgilerini düzenleyin
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">Genel</TabsTrigger>
              <TabsTrigger value="contact">İletişim</TabsTrigger>
              <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Bilgileri</CardTitle>
                  <CardDescription>
                    Sitenin genel bilgilerini düzenleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Adı (Türkçe)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="NGE Ambalaj" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="siteNameEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name (English)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="NGE Packaging" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="footerText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Metni (Türkçe)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="© 2024 NGE Ambalaj. Tüm hakları saklıdır."
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="footerTextEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Text (English)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="© 2024 NGE Packaging. All rights reserved."
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>İletişim Bilgileri</CardTitle>
                  <CardDescription>
                    Sitede görüntülenecek iletişim bilgilerini girin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon 1</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="0532 643 5501" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon 2</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="0533 357 5292" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="info@ngeltd.net" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+905326435501" />
                          </FormControl>
                          <FormDescription>
                            Ülke kodu ile (+90...)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres (Türkçe)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Adana Organize Sanayi Bölgesi..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address (English)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Adana Organized Industrial Zone..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="workingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Çalışma Saatleri (Türkçe)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Pazartesi - Cuma: 09:00 - 18:00"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workingHoursEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Working Hours (English)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Monday - Friday: 09:00 - 18:00"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mapEmbedUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Maps Embed URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://www.google.com/maps/embed?pb=..."
                          />
                        </FormControl>
                        <FormDescription>
                          Google Maps'ten embed URL'sini kopyalayın
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sosyal Medya Linkleri</CardTitle>
                  <CardDescription>
                    Sosyal medya hesaplarınızın linklerini girin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://facebook.com/..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://instagram.com/..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://linkedin.com/company/..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter / X</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://twitter.com/..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="youtube"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://youtube.com/@..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Ayarları</CardTitle>
                  <CardDescription>
                    Varsayılan SEO meta tag değerlerini belirleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultSeoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Varsayılan SEO Başlığı (Türkçe)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="NGE Ambalaj | Endüstriyel Ambalaj Çözümleri"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultSeoTitleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default SEO Title (English)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="NGE Packaging | Industrial Packaging Solutions"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultSeoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Varsayılan SEO Açıklaması (Türkçe)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="NGE Ambalaj, endüstriyel ambalaj çözümleri..."
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Maksimum 160 karakter önerilir
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultSeoDescriptionEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default SEO Description (English)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="NGE Packaging, industrial packaging solutions..."
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum 160 characters recommended
                        </FormDescription>
                        <FormMessage />
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
