import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT update match
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      home_club_id,
      away_club_id,
      match_date,
      match_time,
      venue,
      score_home,
      score_away,
    } = body;

    if (!home_club_id || !away_club_id || !match_date) {
      return NextResponse.json(
        { error: "home_club_id, away_club_id, and match_date are required" },
        { status: 400 },
      );
    }

    if (home_club_id === away_club_id) {
      return NextResponse.json(
        { error: "Home and Away club cannot be the same" },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE matches
      SET 
        home_club_id = ${home_club_id},
        away_club_id = ${away_club_id},
        match_date = ${match_date},
        match_time = ${match_time || null},
        venue = ${venue || null},
        score_home = ${score_home !== undefined && score_home !== "" ? score_home : null},
        score_away = ${score_away !== undefined && score_away !== "" ? score_away : null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ match: result[0] });
  } catch (error) {
    console.error("PUT match error:", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 },
    );
  }
}

// DELETE match
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM matches WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("DELETE match error:", error);
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 },
    );
  }
}
