import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// GET all matches with club details
export async function GET() {
  try {
    const matches = await sql`
      SELECT 
        m.*,
        hc.name AS home_club_name,
        hc.logo_url AS home_club_logo,
        hc.is_our_team AS home_club_is_our_team,
        ac.name AS away_club_name,
        ac.logo_url AS away_club_logo,
        ac.is_our_team AS away_club_is_our_team
      FROM matches m
      JOIN clubs hc ON m.home_club_id = hc.id
      JOIN clubs ac ON m.away_club_id = ac.id
      ORDER BY m.match_date DESC, m.created_at DESC
    `;
    return NextResponse.json({ matches });
  } catch (error) {
    console.error("GET matches error:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 },
    );
  }
}

// POST create new match
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      home_club_id,
      away_club_id,
      match_date,
      match_time,
      venue,
      score_home,
      score_away,
      result: resultRaw,
      remark,
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
      INSERT INTO matches (
        home_club_id, away_club_id, match_date, match_time, venue,
        score_home, score_away, result, remark
      )
      VALUES (
        ${home_club_id}, ${away_club_id}, ${match_date},
        ${match_time || null}, ${venue || null},
        ${score_home !== undefined && score_home !== "" ? score_home : null},
        ${score_away !== undefined && score_away !== "" ? score_away : null},
        ${resultRaw || null},
        ${remark || null}
      )
      RETURNING *
    `;

    revalidatePath("/");
    return NextResponse.json({ match: result[0] }, { status: 201 });
  } catch (error) {
    console.error("POST match error:", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 },
    );
  }
}
