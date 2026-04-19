import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Sesión cerrada correctamente" },
      { status: 200 }
    );

    clearSessionCookie(response);

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
