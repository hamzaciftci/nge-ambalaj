import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

// PUT - Mark message as read
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { isRead } = body;

    const submission = await prisma.contactSubmission.update({
      where: { id: params.id },
      data: { isRead },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Mesaj güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Delete message
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifySession();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await prisma.contactSubmission.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Mesaj silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
