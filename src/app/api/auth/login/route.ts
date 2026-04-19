import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth/auth-service";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await loginUser(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, user: result.user },
      { status: 200 }
    );

    if (result.token) {
      setSessionCookie(response, result.token);
    }

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
