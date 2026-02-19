import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all clubs
export async function GET() {
  try {
    const clubs = await sql`
      SELECT * FROM clubs ORDER BY name ASC
    `;
    return NextResponse.json({ clubs });
  } catch (error) {
    console.error("GET clubs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch clubs" },
      { status: 500 },
    );
  }
}

// POST create new club
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, logo_url } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Club name is required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO clubs (name, logo_url)
      VALUES (${name}, ${logo_url || null})
      RETURNING *
    `;

    return NextResponse.json({ club: result[0] }, { status: 201 });
  } catch (error) {
    console.error("POST club error:", error);
    return NextResponse.json(
      { error: "Failed to create club" },
      { status: 500 },
    );
  }
}
