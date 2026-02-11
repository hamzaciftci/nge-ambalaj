import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { loginRateLimiter, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Input validation schema
const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Şifre gereklidir"),
});

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const ip = getClientIp(request);
    const rateLimitResult = loginRateLimiter.check(ip);

    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult.resetTime);
    }

    // Parse and validate input
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Use same error message to prevent user enumeration
      return NextResponse.json(
        { error: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Geçersiz e-posta veya şifre" },
        { status: 401 }
      );
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    // Don't expose error details to client
    return NextResponse.json(
      { error: "Giriş yapılırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
