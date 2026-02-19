import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyUserFromCookies, isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await sql`
      SELECT * FROM events
      ORDER BY event_date DESC, created_at DESC
    `;

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, banner_url, description, event_date, documentation_urls } =
      body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newEvent = await sql`
      INSERT INTO events (title, banner_url, description, event_date, documentation_urls)
      VALUES (${title}, ${banner_url}, ${description}, ${event_date}, ${JSON.stringify(documentation_urls || [])})
      RETURNING *
    `;

    return NextResponse.json({ event: newEvent[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
