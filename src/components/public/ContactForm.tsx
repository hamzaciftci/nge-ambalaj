"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
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

interface ContactFormProps {
  formTitle?: string;
  successTitle?: string;
  successMessage?: string;
  newMessageButton?: string;
}

export default function ContactForm({
  formTitle,
  successTitle,
  successMessage,
  newMessageButton,
}: ContactFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, t("contactForm.errors.nameMin")),
    email: z.string().email(t("contactForm.errors.emailInvalid")),
    phone: z.string().optional(),
    company: z.string().optional(),
    subject: z.string().min(3, t("contactForm.errors.subjectMin")),
    message: z.string().min(10, t("contactForm.errors.messageMin")),
  });

  type FormData = z.infer<typeof formSchema>;

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
        throw new Error(resData.error || t("contactForm.errors.sendError"));
      }

      setSubmitted(true);
      toast.success(t("contact.form.success"));
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
        {formTitle || t("contactForm.title")}
      </h2>

      {submitted ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {successTitle || t("contactForm.successTitle")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {successMessage || t("contactForm.successMessage")}
          </p>
          <Button onClick={() => setSubmitted(false)}>
            {newMessageButton || t("contactForm.newMessageButton")}
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
                    <FormLabel>{t("contactForm.name")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("contactForm.namePlaceholder")} />
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
                    <FormLabel>{t("contactForm.email")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder={t("contactForm.emailPlaceholder")} />
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
                    <FormLabel>{t("contactForm.phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("contactForm.phonePlaceholder")} />
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
                    <FormLabel>{t("contactForm.company")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("contactForm.companyPlaceholder")} />
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
                  <FormLabel>{t("contactForm.subject")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("contactForm.subjectPlaceholder")} />
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
                  <FormLabel>{t("contactForm.message")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("contactForm.messagePlaceholder")}
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
                  {t("contactForm.submitting")}
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  {t("contactForm.submitButton")}
                </>
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
