import bcrypt from "bcryptjs";
import * as jose from "jose";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-key-min-32-chars-long";
const secret = new TextEncoder().encode(JWT_SECRET);
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days
const COOKIE_NAME = "admin_token";

// JWT Payload interface
export interface JWTPayload extends jose.JWTPayload {
  userId: number;
  email: string;
  role: string;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Password comparison
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export async function generateToken(payload: JWTPayload): Promise<string> {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch (error) {
    console.error(
      "JWT Verification Error:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

// Get token from cookies (server-side)
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value || null;
}

// Verify user from request cookies
export async function verifyUserFromCookies(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
}

// Check if user is admin
export function isAdmin(user: JWTPayload | null): boolean {
  return user?.role === "admin";
}

// Cookie options for setting JWT
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  path: "/",
};

export { COOKIE_NAME };
