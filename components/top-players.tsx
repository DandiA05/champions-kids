import { sql } from "@/lib/db";
import { getPositionColor } from "@/lib/player-helpers";
import Link from "next/link";

export default async function TopPlayers() {
  // Fetch top players with user names
  const players = await sql`
    SELECT 
      p.*, 
      u.name as user_name
    FROM players p
    JOIN users u ON p.user_id = u.id
    WHERE p.is_top_player = true
    ORDER BY p.created_at DESC
  `;

  if (!players || players.length === 0) {
    return null; // Or return a placeholder if preferred
  }

  return (
    <section className="space-pb classic-players px-0 px-md-5">
      <div className="container-fluid">
        <div className="row position-relative">
          <div className="col-lg-4 pe-0 pe-lg-5">
            <div className="section-title">
              <h2 className="mb-0 text-white">Top Players Now</h2>
              <p className="text-white mt-2">
                Discover our elite young talents who have shown exceptional
                dedication, skill, and performance on the field. Success is
                built through discipline, planning, and the belief that every
                goal is achievable.
              </p>
            </div>
          </div>
          <div className="col-lg-8 mt-5 mt-lg-0">
            <div
              className="owl-carousel"
              data-nav-dots="false"
              data-nav-arrow="true"
              data-items="2"
              data-xl-items="2"
              data-lg-items="1"
              data-md-items="1"
              data-sm-items="1"
              data-xs-items="1"
              data-xx-items="1"
              data-autoheight="true"
            >
              {players.map((player: any) => (
                <div className="item mb-4 mb-lg-0" key={player.id}>
                  <Link href={`/players/${player.id}`}>
                    <div className="player">
                      <img
                        className="img-fluid"
                        src={player.photo_url || "/images/home-01/team-01.jpg"}
                        alt={player.user_name}
                        style={{
                          width: "100%",
                          aspectRatio: "3 / 4",
                          objectFit: "cover",
                          backgroundColor: "white",
                          display: "block",
                        }}
                      />
                    </div>
                  </Link>
                  <div className="player-info">
                    <span className="player-number">
                      {player.jersey_number || "00"}
                    </span>
                    <div className="player-name">
                      <h3 className="text-uppercase title">
                        <Link href={`/players/${player.id}`}>
                          {player.user_name}
                        </Link>
                      </h3>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          className="badge text-white px-4 py-2"
                          style={{
                            fontSize: "0.7rem",
                            borderRadius: "30px",
                            letterSpacing: "1px",
                            backgroundColor: getPositionColor(player.position),
                          }}
                        >
                          {player.position?.toUpperCase()}
                        </span>
                        <span
                          className="badge bg-dark"
                          style={{ fontSize: "0.7rem", opacity: 0.8 }}
                        >
                          {player.age_category}
                        </span>
                      </div>
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
