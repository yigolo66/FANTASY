import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { findUserById, toPublicUser } from "@/lib/auth/user-repository";

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const user = findUserById(session.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, user: toPublicUser(user) },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
