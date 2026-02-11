import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { join } from "path";
import { stat, mkdir, writeFile, unlink } from "fs/promises";
import { cwd } from "process";

export const dynamic = "force-dynamic";

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

    // Save to local file system
    try {
      const uploadDir = join(cwd(), "public", "uploads");
      try {
        await stat(uploadDir);
      } catch (e: any) {
        if (e.code === "ENOENT") {
          await mkdir(uploadDir, { recursive: true });
        } else {
          throw e;
        }
      }

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${sanitizedName}`;
      const filePath = join(uploadDir, filename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
      console.error("Local upload error:", error);
      return NextResponse.json(
        { error: "Yerel dosya yükleme hatası" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Upload error:", error);
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

    // Handle local file deletion
    if (url.startsWith("/uploads/")) {
      try {
        const filePath = join(cwd(), "public", url);
        // Security check to prevent directory traversal
        if (!filePath.startsWith(join(cwd(), "public", "uploads"))) {
          return NextResponse.json(
            { error: "Geçersiz dosya yolu" },
            { status: 400 }
          );
        }

        await unlink(filePath);
        return NextResponse.json({ success: true });
      } catch (error: any) {
        // If file doesn't exist, technically it's "gone", so return success or ignore
        if (error.code !== "ENOENT") {
          console.error("Local delete error:", error);
          return NextResponse.json(
            { error: "Dosya silinirken hata oluştu" },
            { status: 500 }
          );
        }
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Dosya silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
