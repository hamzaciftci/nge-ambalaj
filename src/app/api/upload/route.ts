import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Allowed Vercel Blob hostnames
const ALLOWED_BLOB_HOSTNAMES = [
  "public.blob.vercel-storage.com",
  ".public.blob.vercel-storage.com",
  ".vercel-storage.com",
];

/**
 * Validate that a URL is a Vercel Blob URL
 */
function isValidBlobUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ALLOWED_BLOB_HOSTNAMES.some(
      (hostname) =>
        url.hostname === hostname || url.hostname.endsWith(hostname)
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadı" },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Geçersiz dosya türü. Sadece JPEG, PNG, WebP ve GIF kabul edilir." },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 10MB'dan büyük olamaz" },
        { status: 400 }
      );
    }

    // Sanitize filename - remove potentially dangerous characters
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .substring(0, 100);

    const blob = await put(sanitizedName, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json(
      { error: "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL gerekli" },
        { status: 400 }
      );
    }

    // Validate URL is a Vercel Blob URL to prevent unauthorized deletion of other files
    if (!isValidBlobUrl(url)) {
      return NextResponse.json(
        { error: "Geçersiz dosya URL'si. Sadece yüklenen dosyalar silinebilir." },
        { status: 400 }
      );
    }

    await del(url);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Dosya silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
