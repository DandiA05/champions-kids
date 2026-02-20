import { sql } from "@/lib/db";
import { formatDate, formatTime } from "@/helper/helper";

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

export default async function MatchSchedule() {
  // Fetch upcoming matches (score is null) ordered by date
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
    ORDER BY m.match_date ASC, m.match_time ASC
  `) as Match[];

  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <section className="space-ptb match-schedule overlay-top">
      <div className="container bg-light p-5">
        <div className="row">
          <div className="col-md-12 ">
            <div className="section-title mb-5">
              <h2>Match Schedule</h2>
            </div>
          </div>
          <div className="col-sm-12">
            <div
              className="owl-carousel arrow-top-right match-schedule-slider"
              data-nav-dots="false"
              data-nav-arrow="true"
              data-items="3"
              data-xl-items="2"
              data-lg-items="2"
              data-md-items="2"
              data-sm-items="2"
              data-xs-items="1"
              data-xx-items="1"
              data-autoheight="true"
            >
              {matches.map((match) => (
                <div className="item" key={match.id}>
                  <div className="upcoming-match">
                    <div className="match-team">
                      <img
                        className="img-fluid"
                        src={
                          match.home_club_logo ||
                          "/images/home-01/team-logo-05.png"
                        }
                        alt={match.home_club_name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="match-date-time mx-3 text-center">
                      {match.remark && (
                        <div className="mb-1">
                          <span
                            className="badge bg-warning text-dark"
                            style={{
                              fontSize: "9px",
                              padding: "2px 8px",
                              borderRadius: "20px",
                              textTransform: "uppercase",
                              fontWeight: "700",
                            }}
                          >
                            {match.remark}
                          </span>
                        </div>
                      )}
                      <span
                        className="match-time d-block text-white"
                        style={{ fontSize: "1.2rem", fontWeight: "700" }}
                      >
                        {formatTime(match.match_time)}
                      </span>
                      <span
                        className="match-date d-block text-white opacity-75"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <i className="fa-solid fa-calendar-days me-1"></i>
                        {formatDate(match.match_date)}
                      </span>
                    </div>
                    <div className="match-team">
                      <img
                        className="img-fluid"
                        src={
                          match.away_club_logo ||
                          "/images/home-01/team-logo-06.png"
                        }
                        alt={match.away_club_name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
