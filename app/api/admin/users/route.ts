import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyUserFromCookies, isAdmin, hashPassword } from "@/lib/auth";
import { z } from "zod";

// Validation schema for creating user
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "non-admin"]),
});

// GET - List all users (admin only)
export async function GET() {
  try {
    // Verify admin access
    const user = await verifyUserFromCookies();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    // Get all users
    const users = await db.getAllUsers();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const user = await verifyUserFromCookies();

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 },
      );
    }

    const { name, email, password, role } = validation.data;

    // Check if email already exists
    const existingUser = await db.getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await db.createUser(name, email, passwordHash, role);

    // Return created user (without password hash)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          created_at: newUser.created_at,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
