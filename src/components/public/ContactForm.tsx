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
import { Send, Loader2, CheckCircle } from "lucide-react";
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

interface ContactFormProps {
  formTitle?: string;
  successTitle?: string;
  successMessage?: string;
  newMessageButton?: string;
}

export default function ContactForm({
  formTitle = "Mesaj Gönderin",
  successTitle = "Mesajınız Gönderildi!",
  successMessage = "En kısa sürede size dönüş yapacağız.",
  newMessageButton = "Yeni Mesaj Gönder",
}: ContactFormProps) {
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

  return (
    <div className="bg-card rounded-2xl border border-border p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {formTitle}
      </h2>

      {submitted ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {successTitle}
          </h3>
          <p className="text-muted-foreground mb-6">
            {successMessage}
          </p>
          <Button onClick={() => setSubmitted(false)}>
            {newMessageButton}
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
  );
}
