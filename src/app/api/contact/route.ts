import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { contactRateLimiter, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

// Input validation schema with strict limits
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(100, "İsim en fazla 100 karakter olabilir")
    .trim(),
  email: z
    .string()
    .email("Geçerli bir e-posta adresi giriniz")
    .max(255, "E-posta en fazla 255 karakter olabilir")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .max(30, "Telefon en fazla 30 karakter olabilir")
    .optional()
    .nullable(),
  company: z
    .string()
    .max(200, "Şirket adı en fazla 200 karakter olabilir")
    .optional()
    .nullable(),
  subject: z
    .string()
    .max(200, "Konu en fazla 200 karakter olabilir")
    .optional()
    .nullable(),
  message: z
    .string()
    .min(10, "Mesaj en az 10 karakter olmalıdır")
    .max(5000, "Mesaj en fazla 5000 karakter olabilir")
    .trim(),
});

// POST - Submit contact form (public with rate limiting)
export async function POST(request: Request) {
  try {
    // Rate limiting check
    const ip = getClientIp(request);
    const rateLimitResult = contactRateLimiter.check(ip);

    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult.resetTime);
    }

    // Parse and validate input
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, company, subject, message } = validation.data;

    // Create submission
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject: subject || null,
        message,
      },
    });

    // Send email notification (fire and forget or wait depending on preference)
    // We wait to ensure we know if it failed, but we return success for the DB entry regardless
    try {
      await sendMail({
        to: process.env.EMAIL_TO || "info@ngeltd.net",
        subject: `Yeni İletişim Formu Mesajı: ${subject || "Konu Yok"}`,
        html: `
          <h3>Yeni İletişim Formu Mesajı</h3>
          <p><strong>İsim:</strong> ${name}</p>
          <p><strong>E-posta:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || "Belirtilmedi"}</p>
          <p><strong>Şirket:</strong> ${company || "Belirtilmedi"}</p>
          <p><strong>Konu:</strong> ${subject || "Belirtilmedi"}</p>
          <p><strong>Mesaj:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    } catch (mailError) {
      console.error("Email notification failed:", mailError);
      // We don't fail the whole request because the submission was saved in DB
    }

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Mesaj gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// GET - List contact submissions (admin only)
export async function GET() {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json(
      { error: "Mesajlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
