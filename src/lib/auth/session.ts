import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export interface SessionPayload {
  userId: number;
  email: string;
}

const COOKIE_NAME = "auth-token";
const JWT_EXPIRATION = "7d";

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const secret = getSecret();
  return new SignJWT({ userId: payload.userId, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secret);
}

export async function verifySession(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as number | undefined;
    const email = payload.email as string | undefined;
    if (typeof userId !== "number" || typeof email !== "string") return null;
    return { userId, email };
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
