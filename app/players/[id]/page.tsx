import LogoSlide from "@/components/logo-slide";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import PlayerStatBar from "@/components/player-single/PlayerStatBar";
import PlayerRadarChart from "@/components/player-single/player-radar-chart";
import { POSITIONS } from "@/lib/constants";

export default async function PlayerPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  // Fetch player details join with users
  const result = await sql`
    SELECT p.*, u.name as user_name
    FROM players p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ${id}
    LIMIT 1
  `;

  if (!result || result.length === 0) {
    notFound();
  }

  const player = result[0] as any;

  // Calculate OVR for possibly later use or just to have it
  const ovr = Math.round(
    ((player.pace || 0) +
      (player.shooting || 0) +
      (player.passing || 0) +
      (player.dribbling || 0) +
      (player.defending || 0) +
      (player.physical || 0)) /
      6,
  );

  const getPositionColor = (pos: string) => {
    const attackers = ["ST", "CF", "LW", "RW"];
    const midfielders = ["CM", "AM", "DM"];
    const defenders = ["CB", "LB", "RB"];

    if (attackers.includes(pos)) return "#d32f2f"; // Red
    if (midfielders.includes(pos)) return "#2e7d32"; // Green
    if (defenders.includes(pos)) return "#0288d1"; // Blue
    if (pos === "GK") return "#ed6c02"; // Gold/Orange
    return "var(--pgs_secondary_color)";
  };

  // Calculate Age (simple)
  let age = "N/A";
  if (player.birthday) {
    const birthDate = new Date(player.birthday);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    age = `${calculatedAge} Years`;
  }

  return (
    <main>
      <section className="space-pt"></section>

      {/* Player Detail */}
      <section className="space-ptb single-player">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="player-img">
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
                    borderRadius: "12px",
                  }}
                />
              </div>
            </div>
            {/* here */}
            <div className="col-lg-7 mt-4 mt-md-5 mt-lg-0 ps-3 ps-lg-5">
              <div className="player-info">
                <h2 className="mb-3">
                  <span className="player-name text-white">
                    {player.user_name}
                  </span>
                </h2>
                <div className="mb-4">
                  <span
                    className="badge text-white px-4 py-2"
                    style={{
                      fontSize: "1rem",
                      borderRadius: "30px",
                      letterSpacing: "1px",
                      backgroundColor: getPositionColor(player.position),
                    }}
                  >
                    {POSITIONS.find((p) => p.code === player.position)?.label ||
                      player.position?.toUpperCase()}
                  </span>
                </div>
                <ul className="list-unstyled mt-4 text-white">
                  <li className="d-flex mb-3 mx-0">
                    <span
                      className="me-4 opacity-75"
                      style={{ minWidth: "120px" }}
                    >
                      OVR Score
                    </span>
                    <span
                      className="text-primary-psg font-weight-bold"
                      style={{ fontSize: "1.2rem" }}
                    >
                      {ovr}
                    </span>
                  </li>
                  <li className="d-flex mb-3 mx-0">
                    <span
                      className="me-4 opacity-75"
                      style={{ minWidth: "120px" }}
                    >
                      Jersey Number
                    </span>
                    <span className="font-weight-bold text-white">
                      #{player.jersey_number || "00"}
                    </span>
                  </li>
                  <li className="d-flex mb-3 mx-0">
                    <span
                      className="me-4 opacity-75"
                      style={{ minWidth: "120px" }}
                    >
                      Age Category
                    </span>
                    <span className="text-white">{player.age_category}</span>
                  </li>
                  <li className="d-flex mb-3 mx-0">
                    <span
                      className="me-4 opacity-75"
                      style={{ minWidth: "120px" }}
                    >
                      Age
                    </span>
                    <span className="text-white">{age}</span>
                  </li>
                  <li className="d-flex mb-0 mx-0">
                    <span
                      className="me-4 opacity-75"
                      style={{ minWidth: "120px" }}
                    >
                      Birthday
                    </span>{" "}
                    <span className="text-white">
                      {player.birthday
                        ? new Date(player.birthday).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="single-player-bg">
          <img
            className="img-fluid vert-move"
            src="/images/home-01/pattern-04.png"
            alt=""
          />
        </div>
      </section>

      {/* Player Attributes */}
      <section className="player-attributes space-ptb">
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-12 text-center">
              <h2 className="text-white">Player Attributes</h2>
              <p className="text-white opacity-75">
                Technical & Physical Profile
              </p>
            </div>
          </div>

          <div className="row align-items-center">
            {/* LEFT – Stat Bars */}
            <div className="col-lg-6 mb-5 mb-lg-0">
              <PlayerStatBar label="Pace" value={player.pace || 0} />
              <PlayerStatBar label="Shooting" value={player.shooting || 0} />
              <PlayerStatBar label="Passing" value={player.passing || 0} />
              <PlayerStatBar label="Dribbling" value={player.dribbling || 0} />
              <PlayerStatBar label="Defending" value={player.defending || 0} />
              <PlayerStatBar label="Physical" value={player.physical || 0} />
            </div>

            {/* RIGHT – Radar */}
            <div className="col-lg-6">
              <PlayerRadarChart
                attributes={{
                  pace: player.pace || 0,
                  shooting: player.shooting || 0,
                  passing: player.passing || 0,
                  dribbling: player.dribbling || 0,
                  defending: player.defending || 0,
                  physical: player.physical || 0,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Season Statistics */}
      <section className="player-stats space-ptb">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-12 text-center">
              <h2 className="text-white">Season Statistics</h2>
              <p className="text-white mb-0 opacity-75">
                Competition Performance
              </p>
            </div>
          </div>

          <div className="row text-center">
            {[
              { value: player.appearances || 0, label: "Appearances" },
              { value: player.goals || 0, label: "Goals" },
              { value: player.assists || 0, label: "Assists" },
              { value: player.yellow_cards || 0, label: "Yellow Cards" },
              { value: player.red_cards || 0, label: "Red Cards" },
              { value: player.mom || 0, label: "Player of Match" },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-2 mb-4">
                <div className="stat-box">
                  <h3 className="stat-number">{item.value}</h3>
                  <span className="stat-label text-white opacity-75">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Player */}
      {player.biography && (
        <section className="player-about">
          <div className="player-about-bg">
            <div className="container">
              <div className="row">
                <div className="col-xl-6">
                  <div className="player-about-details">
                    <h2>About {player.user_name.split(" ")[0]}</h2>
                    <div className="mb-4">
                      <span className="text-white opacity-75">Biography</span>
                    </div>
                    <div
                      className="text-white biography-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {player.biography}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <LogoSlide />
    </main>
  );
}
