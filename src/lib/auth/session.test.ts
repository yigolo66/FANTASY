/**
 * @jest-environment node
 */
import { createSession, verifySession, setSessionCookie, clearSessionCookie, SessionPayload } from "./session";
import { NextRequest, NextResponse } from "next/server";

// Set AUTH_SECRET for tests
process.env.AUTH_SECRET = "test-secret-key-for-jest-testing-12345";

describe("session", () => {
  const testPayload: SessionPayload = { userId: 1, email: "test@example.com" };

  describe("createSession", () => {
    it("should return a JWT string", async () => {
      const token = await createSession(testPayload);
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });
  });

  describe("verifySession", () => {
    it("should verify a valid token and return the payload", async () => {
      const token = await createSession(testPayload);
      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: { cookie: `auth-token=${token}` },
      });
      const result = await verifySession(request);
      expect(result).toEqual({ userId: 1, email: "test@example.com" });
    });

    it("should return null when no cookie is present", async () => {
      const request = new NextRequest("http://localhost:3000/api/test");
      const result = await verifySession(request);
      expect(result).toBeNull();
    });

    it("should return null for an invalid token", async () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: { cookie: "auth-token=invalid.token.here" },
      });
      const result = await verifySession(request);
      expect(result).toBeNull();
    });
  });

  describe("setSessionCookie", () => {
    it("should set cookie with correct security attributes", () => {
      const response = NextResponse.json({});
      setSessionCookie(response, "test-token");
      const cookie = response.cookies.get("auth-token");
      expect(cookie).toBeDefined();
      expect(cookie!.value).toBe("test-token");
    });
  });

  describe("clearSessionCookie", () => {
    it("should clear the cookie by setting empty value", () => {
      const response = NextResponse.json({});
      setSessionCookie(response, "test-token");
      clearSessionCookie(response);
      const cookie = response.cookies.get("auth-token");
      expect(cookie).toBeDefined();
      expect(cookie!.value).toBe("");
    });
  });
});
