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
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface SettingsData {
  phone: string;
  email: string;
  address: string;
  addressEn: string;
  workingHours: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm<SettingsData>({
    defaultValues: {
      phone: "",
      email: "",
      address: "",
      addressEn: "",
      workingHours: "",
    },
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            form.reset({
              phone: data.phone || "",
              email: data.email || "",
              address: data.address || "",
              addressEn: data.addressEn || "",
              workingHours: data.workingHours || "",
            });
          }
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
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Kaydetme başarısız");
      }

      toast.success("Ayarlar kaydedildi");
    } catch (error) {
      toast.error("Bir hata oluştu");
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
          İletişim bilgileri ve genel site ayarlarını düzenleyin
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+90 212 123 45 67" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="info@ngambalaj.com" />
                      </FormControl>
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
                      <Textarea {...field} placeholder="Adres bilgisi..." rows={3} />
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
                      <Textarea {...field} placeholder="Address information..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Çalışma Saatleri</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Pazartesi - Cuma: 09:00 - 18:00&#10;Cumartesi: 09:00 - 14:00"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
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
            Kaydet
          </Button>
        </form>
      </Form>
    </div>
  );
}
