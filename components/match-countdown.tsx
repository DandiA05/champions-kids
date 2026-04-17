import { sql } from "@/lib/db";
import MatchCountdownClient from "@/components/match-countdown-client";

interface Match {
  id: number;
  home_club_name: string;
  home_club_logo: string | null;
  away_club_name: string;
  away_club_logo: string | null;
  match_date: string;
  match_time: string | null;
  remark: string | null;
}

export default async function MatchCountdown() {
  const matches = (await sql`
    SELECT 
      m.*,
      hc.name AS home_club_name,
      hc.logo_url AS home_club_logo,
      ac.name AS away_club_name,
      ac.logo_url AS away_club_logo
    FROM matches m
    JOIN clubs hc ON m.home_club_id = hc.id
    JOIN clubs ac ON m.away_club_id = ac.id
    WHERE m.score_home IS NULL AND m.score_away IS NULL
    AND (m.match_date > CURRENT_DATE OR (m.match_date = CURRENT_DATE AND (m.match_time IS NULL OR m.match_time >= CURRENT_TIME)))
    ORDER BY m.match_date ASC, m.match_time ASC
    LIMIT 1
  `) as Match[];

  if (!matches || matches.length === 0) {
    return null; 
  }

  const match = matches[0];
  // Ensure date is string YYYY-MM-DD before appending time
  const datePart = new Date(match.match_date).toISOString().split("T")[0];
  const targetDate = `${datePart}T${match.match_time || "00:00:00"}`;

  return <MatchCountdownClient match={match} targetDate={targetDate} />;
}
