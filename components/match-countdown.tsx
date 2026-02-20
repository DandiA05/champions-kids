import { sql } from "@/lib/db";
import CountdownTimer from "@/components/countdown-timer";

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
    return null; // Or some fallback
  }

  const match = matches[0];
  // Ensure date is string YYYY-MM-DD before appending time
  const datePart = new Date(match.match_date).toISOString().split("T")[0];
  const targetDate = `${datePart}T${match.match_time || "00:00:00"}`;

  return (
    <section className="tournament-countdown">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-xl-4 col-lg-12 d-flex justify-content-center justify-content-xl-start text-center text-xl-start mb-4 mb-xl-0">
            <div className="tournament-title">
              <h2>Match starts in</h2>
              <div className="d-flex align-items-center justify-content-center justify-content-xl-start mt-2">
                <span
                  className="badge bg-warning text-dark px-3 py-1"
                  style={{
                    borderRadius: "20px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    fontSize: "11px",
                  }}
                >
                  {match.remark || "Coming Soon"}
                </span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-12 justify-content-lg-center mb-4 mb-xl-0">
            <CountdownTimer targetDate={targetDate} />
          </div>
          <div className="col-xl-4 col-lg-12">
            <div className="upcoming-match d-lg-flex align-items-center justify-content-center justify-content-xl-end">
              <div
                className="match-team p-3 shadow-sm"
                style={{
                  borderRadius: "15px",
                  backgroundColor: "#1a4f7a",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "15px",
                }}
              >
                <img
                  className="img-fluid"
                  src={
                    match.home_club_logo || "/images/home-01/team-logo-01.png"
                  }
                  alt={match.home_club_name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h2 className="px-4 px-lg-5 text-white">V.S</h2>
              <div
                className="match-team shadow-sm"
                style={{
                  borderRadius: "15px",
                  backgroundColor: "#1a4f7a",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "15px",
                }}
              >
                <img
                  className="img-fluid"
                  src={
                    match.away_club_logo || "/images/home-01/team-logo-02.png"
                  }
                  alt={match.away_club_name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
