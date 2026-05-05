import { NextRequest, NextResponse } from "next/server";
import { parseLoginData, validateLoginData } from "@/lib/auth/auth-validators";
import { loginUser } from "@/lib/auth/auth-service";
import { setSessionCookie } from "@/lib/auth/session";
import { isRateLimited, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(getRateLimitKey(ip, "login"))) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const data = parseLoginData(body);
    const validation = validateLoginData(data);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const result = await loginUser(data);

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
