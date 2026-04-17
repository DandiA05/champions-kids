import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyUserFromCookies, isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Add columns if they don't exist
    await sql`
      ALTER TABLE players 
      ADD COLUMN IF NOT EXISTS raport JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS coach_notes TEXT DEFAULT ''
    `;

    return NextResponse.json({ message: "Migration successful" });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed", details: String(error) },
      { status: 500 }
    );
  }
}
