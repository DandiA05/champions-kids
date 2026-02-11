import { NextResponse } from "next/server";
import { verifyUserFromCookies } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Verify JWT from cookies
    const jwtPayload = await verifyUserFromCookies();

    if (!jwtPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get full user data from database
    const user = await db.getUserById(jwtPayload.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (without password hash)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
