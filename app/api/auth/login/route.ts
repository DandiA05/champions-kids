import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  comparePassword,
  generateToken,
  COOKIE_NAME,
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

    // Check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 },
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      ...cookieOptions,
      secure: false, // Ensure it works in dev
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
