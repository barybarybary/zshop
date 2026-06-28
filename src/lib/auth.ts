// ============================================================
// 简易 JWT 认证（替代 NextAuth，兼容 Netlify）
// ============================================================

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "zshop-default-secret-change-me"
);

const COOKIE_NAME = "zshop_token";

export async function createToken(user: { id: string; email: string; name?: string | null; role: string }) {
  return new SignJWT({ id: user.id, email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    return {
      user: {
        id: payload.id as string,
        email: payload.email as string,
        name: (payload.name as string) || null,
        role: (payload.role as string) || "USER",
      },
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: { id: string; email: string; name?: string | null; role: string }) {
  const token = await createToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
