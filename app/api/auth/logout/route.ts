import { NextResponse } from "next/server";
import { COOKIE_NAME, PLAYER_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 },
    );

    // Clear the auth cookies
    response.cookies.delete(COOKIE_NAME);
    response.cookies.delete(PLAYER_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
