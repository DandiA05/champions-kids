import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  comparePassword,
  generateToken,
  COOKIE_NAME,
  PLAYER_COOKIE_NAME,
  cookieOptions,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await db.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if user is allowed to login
    const allowedRoles = ["admin", "player"];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: `Access denied. ${user.role} role is not allowed to login here.` },
        { status: 403 },
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Determine cookie name based on role
    const activeCookieName = user.role === "admin" ? COOKIE_NAME : PLAYER_COOKIE_NAME;

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(activeCookieName, token, {
      ...cookieOptions,
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
