"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, "Konu en az 3 karakter olmalıdır"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Mesaj gönderilemedi");
      }

      setSubmitted(true);
      toast.success("Mesajınız başarıyla gönderildi!");
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      value: "+90 212 123 45 67",
      href: "tel:+902121234567",
    },
    {
      icon: Mail,
      title: "E-posta",
      value: "info@ngambalaj.com",
      href: "mailto:info@ngambalaj.com",
    },
    {
      icon: MapPin,
      title: "Adres",
      value: "Organize Sanayi Bölgesi, 5. Cadde No: 12, İstanbul",
      href: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      value: "Pazartesi - Cumartesi: 08:00 - 18:00",
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background border-b border-border py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">İletişim</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Sorularınız ve talepleriniz için bizimle iletişime geçin.
            Uzman ekibimiz en kısa sürede size dönüş yapacaktır.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  İletişim Bilgileri
                </h2>
                <p className="text-muted-foreground">
                  Bizimle aşağıdaki kanallardan iletişime geçebilir veya
                  formu doldurarak mesaj gönderebilirsiniz.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{info.title}</h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          target={info.href.startsWith("http") ? "_blank" : undefined}
                          rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Mesaj Gönderin
                </h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Mesajınız Gönderildi!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      En kısa sürede size dönüş yapacağız.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>
                      Yeni Mesaj Gönder
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>İsim Soyisim *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Adınız Soyadınız" />
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
                              <FormLabel>E-posta *</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="ornek@email.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefon</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+90 5XX XXX XX XX" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Firma</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Firma Adı" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Konu *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Mesajınızın konusu" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mesaj *</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Mesajınızı buraya yazın..."
                                rows={6}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Gönderiliyor...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Mesaj Gönder
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Konumumuz</h2>
            <p className="text-muted-foreground">
              İstanbul Organize Sanayi Bölgesi'nde hizmetinizdeyiz.
            </p>
          </div>
          <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96251.37599270089!2d28.847847486328124!3d41.08564899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa5923d0c6d63%3A0x4b21c4bcbcfb1e8c!2sIstanbul%20Organize%20Sanayi%20B%C3%B6lgesi!5e0!3m2!1str!2str!4v1704067200000!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
