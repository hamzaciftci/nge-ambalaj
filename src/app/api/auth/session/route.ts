import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await verifySession();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logError("Session error", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
