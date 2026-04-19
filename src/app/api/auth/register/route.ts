import { NextRequest, NextResponse } from "next/server";
import { parseRegisterData, validateRegisterData } from "@/lib/auth/auth-validators";
import { registerUser } from "@/lib/auth/auth-service";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = parseRegisterData(body);
    const validation = validateRegisterData(data);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const result = await registerUser(data);

    if (!result.success) {
      const isEmailDuplicate = result.errors?.email?.includes("ya está registrado");
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: isEmailDuplicate ? 409 : 400 }
      );
    }

    const response = NextResponse.json(
      { success: true, user: result.user },
      { status: 201 }
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
