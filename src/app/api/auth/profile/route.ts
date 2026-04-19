import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { updateProfile } from "@/lib/auth/auth-service";
import { validateProfileUpdate } from "@/lib/auth/auth-validators";

export async function PUT(request: NextRequest) {
  try {
    const session = await verifySession(request);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = validateProfileUpdate(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const result = await updateProfile(session.userId, body.name);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, user: result.user },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
