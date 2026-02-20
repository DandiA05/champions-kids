import { formatDate, formatTime } from "@/helper/helper";
import { sql } from "@/lib/db";

interface Match {
  id: number;
  home_club_name: string;
  home_club_logo: string | null;
  away_club_name: string;
  away_club_logo: string | null;
  match_date: string;
  match_time: string | null;
  venue: string | null;
  score_home: number | null;
  score_away: number | null;
  result: string | null;
  remark: string | null;
}

export default async function LatestResults() {
  // Fetch the latest finished match
  const matches = await sql`
    SELECT 
      m.*,
      hc.name AS home_club_name,
      hc.logo_url AS home_club_logo,
      ac.name AS away_club_name,
      ac.logo_url AS away_club_logo
    FROM matches m
    JOIN clubs hc ON m.home_club_id = hc.id
    JOIN clubs ac ON m.away_club_id = ac.id
    WHERE m.score_home IS NOT NULL AND m.score_away IS NOT NULL
    ORDER BY m.match_date DESC, m.created_at DESC
    LIMIT 1
  `;

  if (!matches || matches.length === 0) {
    return null;
  }

  const match = matches[0] as Match;

  return (
    <section className="space-ptb latest-results">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title text-center">
              <h2 className="mb-0 text-white">Latest Results</h2>
            </div>
          </div>
        </div>
        <div className="row mt-5 align-items-center">
          <div className="col-md-12 col-lg-4 text-center mb-4 mb-lg-0">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <img
                className="img-fluid mb-3"
                src={match.home_club_logo || "/images/home-01/team-logo-03.png"}
                alt={match.home_club_name}
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "contain",
                }}
              />
              <h3 className="mb-0">{match.home_club_name}</h3>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 text-center mb-4 mb-lg-0">
            {match.remark && (
              <div className="remark mb-2">
                <span
                  className="badge bg-warning text-dark px-3 py-2"
                  style={{
                    borderRadius: "20px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  {match.remark}
                </span>
              </div>
            )}
            <h5 className="text-white opacity-75">Match Result</h5>
            <h2
              className="text-white"
              style={{ fontSize: "3.5rem", fontWeight: "800" }}
            >
              <span>{String(match.score_home).padStart(2, "0")}</span> :{" "}
              <span>{String(match.score_away).padStart(2, "0")}</span>
            </h2>
            <div className="time-location mt-3">
              <span className="time text-white mx-3">
                <i className="fa-regular fa-clock me-2"></i>
                {formatDate(match.match_date)}
                {match.match_time ? ` - ${formatTime(match.match_time)}` : ""}
              </span>
              <br className="d-md-none" />
              <div className="mt-2">
                <span className="location text-white mx-3">
                  <i className="fa-solid fa-location-dot me-2"></i>
                  {match.venue || "TBA"}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-4 text-center">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <img
                className="img-fluid mb-3"
                src={match.away_club_logo || "/images/home-01/team-logo-04.png"}
                alt={match.away_club_name}
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "contain",
                }}
              />
              <h3 className="mb-0">{match.away_club_name}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
