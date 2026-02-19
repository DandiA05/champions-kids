import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyUserFromCookies, isAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
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

    const updatedPlayer = await sql`
      UPDATE players
      SET 
        position = ${position},
        jersey_number = ${jersey_number},
        age_category = ${age_category},
        past_teams = ${past_teams},
        birthday = ${birthday},
        photo_url = ${photo_url},
        biography = ${biography},
        pace = ${pace},
        shooting = ${shooting},
        passing = ${passing},
        dribbling = ${dribbling},
        defending = ${defending},
        physical = ${physical},
        appearances = ${appearances},
        goals = ${goals},
        assists = ${assists},
        yellow_cards = ${yellow_cards},
        red_cards = ${red_cards},
        mom = ${mom},
        is_active = ${is_active},
        is_top_player = ${is_top_player},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedPlayer.length === 0) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json({ player: updatedPlayer[0] });
  } catch (error) {
    console.error("Error updating player:", error);
    return NextResponse.json(
      { error: "Failed to update player" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete player
    const deletedPlayer = await sql`
      DELETE FROM players
      WHERE id = ${id}
      RETURNING id
    `;

    if (deletedPlayer.length === 0) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json({ id: deletedPlayer[0].id });
  } catch (error) {
    console.error("Error deleting player:", error);
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 },
    );
  }
}
