import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyUserFromCookies, isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch players with user details
    const players = await sql`
      SELECT 
        p.*,
        u.name as user_name,
        u.email as user_email,
        u.is_active as user_is_active
      FROM players p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json({ players });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch players",
        details: error instanceof Error ? error.message : String(error),
      },
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
    const {
      user_id,
      position,
      jersey_number,
      age_category,
      past_teams,
      birthday,
      photo_url,
      biography,
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physical,
      appearances,
      goals,
      assists,
      yellow_cards,
      red_cards,
      mom,
      is_active,
      is_top_player,
    } = body;

    // Validation
    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Check if user already has a player profile
    const existingPlayer = await sql`
      SELECT id FROM players WHERE user_id = ${user_id}
    `;

    if (existingPlayer.length > 0) {
      return NextResponse.json(
        { error: "This user already has a player profile" },
        { status: 400 },
      );
    }

    // Insert new player
    const newPlayer = await sql`
      INSERT INTO players (
        user_id, position, jersey_number, age_category, past_teams, 
        birthday, photo_url, biography,
        pace, shooting, passing, dribbling, defending, physical,
        appearances, goals, assists, yellow_cards, red_cards, mom,
        is_active, is_top_player
      )
      VALUES (
        ${user_id}, ${position}, ${jersey_number || 0}, ${age_category || ""}, ${past_teams}, 
        ${birthday || null}, ${photo_url}, ${biography},
        ${pace || 0}, ${shooting || 0}, ${passing || 0}, ${dribbling || 0}, ${defending || 0}, ${physical || 0},
        ${appearances || 0}, ${goals || 0}, ${assists || 0}, ${yellow_cards || 0}, ${red_cards || 0}, ${mom || 0},
        ${is_active !== undefined ? is_active : true},
        ${is_top_player !== undefined ? is_top_player : false}
      )
      RETURNING *
    `;

    return NextResponse.json({ player: newPlayer[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 },
    );
  }
}
