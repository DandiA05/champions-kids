import LogoSlide from "@/components/logo-slide";
import Link from "next/link";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import PlayerStatBar from "@/components/player-single/PlayerStatBar";
import PlayerRadarChart from "@/components/player-single/player-radar-chart";
import { POSITIONS } from "@/lib/constants";
import { getPositionColor } from "@/lib/player-helpers";

import { verifyUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import PlayerRaportPreview from "@/components/player-single/player-raport-preview";

export default async function PlayerPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  // Authentication Guard
  const session = await verifyUserFromCookies();
  if (!session) {
    redirect("/login");
  }

  // Authorization Guard: Only allow user to see their own profile (unless admin)
  // We allow access if the ID in URL matches the session User ID
  // OR if the player record's user_id matches the session User ID (checked after fetch)
  if (session.role !== "admin" && session.userId.toString() !== id) {
    // We'll check the player record's user_id after fetching to be sure
    // But if the ID doesn't match either, we might redirect early or wait for fetch.
  }

  // Fetch player details join with users
  const result = await sql`
    SELECT p.*, u.name as user_name
    FROM players p
    JOIN users u ON p.user_id = u.id
    WHERE p.id::text = ${id} OR p.user_id::text = ${id}
    LIMIT 1
  `;

  if (!result || result.length === 0) {
    notFound();
  }

  const player = result[0];

  // Secondary Authorization Guard: Check if the fetched player belongs to the logged-in user
  if (session.role !== "admin" && player.user_id !== session.userId) {
    redirect("/"); // Or a custom forbidden page
  }

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
          {/* <div className="row mb-4">
            <div className="col-12 text-start">
              <Link
                href="/team"
                className="btn btn-sm btn-outline-light text-white d-inline-flex align-items-center gap-2"
                style={{
                  borderRadius: "20px",
                  padding: "8px 20px",
                  fontSize: "0.9rem",
                }}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Team
              </Link>
            </div>
          </div> */}
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
            {/* info player here */}
            <div className="col-lg-7 mt-4 mt-md-5 mt-lg-0 ps-3 ps-lg-5 position-relative overflow-hidden">
              {/* Background Jersey Number (Decorative) */}
              <div
                className="position-absolute"
                style={{
                  right: "-20px",
                  bottom: "-40px",
                  fontSize: "18rem",
                  fontWeight: "900",
                  color: "rgba(255,255,255,0.03)",
                  lineHeight: "1",
                  zIndex: "0",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {player.jersey_number || "00"}
              </div>

              <div
                className="player-info position-relative"
                style={{ zIndex: 1 }}
              >
                <div className="d-flex align-items-center gap-3 mb-2">
                  <span
                    className="text-primary-psg font-weight-bold"
                    style={{ fontSize: "1.2rem", letterSpacing: "2px" }}
                  >
                    #{player.jersey_number || "00"}
                  </span>
                  <div
                    style={{
                      width: "40px",
                      height: "2px",
                      backgroundColor: getPositionColor(player.position),
                    }}
                  />
                </div>

                <h1
                  className="display-4 fw-black text-white mb-3"
                  style={{ letterSpacing: "-1px" }}
                >
                  {player.user_name}
                </h1>

                <div className="d-flex flex-wrap gap-3 mb-5">
                  <span
                    className="badge text-white px-4 py-2 d-flex align-items-center gap-2"
                    style={{
                      fontSize: "0.9rem",
                      borderRadius: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      fontWeight: "700",
                      backgroundColor: getPositionColor(player.position),
                    }}
                  >
                    <i className="fas fa-running"></i>
                    {POSITIONS.find((p) => p.code === player.position)?.label ||
                      player.position?.toUpperCase()}
                  </span>

                  <span
                    className="badge border border-light text-white px-4 py-2"
                    style={{
                      fontSize: "0.9rem",
                      borderRadius: "8px",
                      letterSpacing: "1px",
                      fontWeight: "700",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    {player.age_category || "N/A"}
                  </span>
                </div>

                {/* Quick Stats Grid */}
                <div className="row g-3 mt-4">
                  <div className="col-sm-4">
                    <div
                      className="p-3 rounded-4"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div
                        className="text-primary-psg mb-1"
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "800",
                          textTransform: "uppercase",
                        }}
                      >
                        Overall
                      </div>
                      <div className="text-white h3 mb-0 fw-black">{ovr}</div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div
                      className="p-3 rounded-4"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div
                        className="text-white opacity-50 mb-1"
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "800",
                          textTransform: "uppercase",
                        }}
                      >
                        Position
                      </div>
                      <div className="text-white h3 mb-0 fw-bold">
                        {player.position?.toUpperCase() || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div
                      className="p-3 rounded-4"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div
                        className="text-white opacity-50 mb-1"
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "800",
                          textTransform: "uppercase",
                        }}
                      >
                        Class
                      </div>
                      <div className="text-white h3 mb-0 fw-bold">
                        {player.age_category || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
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
      <section className="player-attributes bg-type-1 space-ptb">
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

      {/* Coach Evaluation & Raport */}
      {(player.coach_notes || player.raport_url) && (
        <section className="coach-evaluation  space-pb mt-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-12 text-center">
                <h2 className="text-white">Coach's Evaluation</h2>
                <p className="text-white mb-0 opacity-75">
                  Professional Feedback & Performance Raport
                </p>
              </div>
            </div>

            <div className="row g-4">
              {/* Coach's Notes */}
              {player.coach_notes && (
                <div className={player.raport_url ? "col-lg-8" : "col-lg-12"}>
                  <div
                    className="p-4 p-md-5 h-100"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      borderRadius: "24px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "rgba(255,193,7,0.1)",
                          color: "#F5A623",
                        }}
                      >
                        <i className="fas fa-comment fa-lg"></i>
                      </div>
                      <h4 className="text-white mb-0">Coach Notes</h4>
                    </div>
                    <div
                      className="text-white opacity-75"
                      style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.8",
                        whiteSpace: "pre-line",
                      }}
                    >
                      "{player.coach_notes}"
                    </div>
                  </div>
                </div>
              )}

              {/* Raport Download */}
              {player.raport_url && (
                <div className={player.coach_notes ? "col-lg-4" : "col-lg-12"}>
                  <div
                    className="p-4 p-md-5 h-100 d-flex flex-column align-items-center justify-content-center text-center"
                    style={{
                      backgroundColor: "rgba(255,193,7,0.05)",
                      borderRadius: "24px",
                      border: "1px solid rgba(255,193,7,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-4"
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "rgba(255,193,7,0.1)",
                        color: "#F5A623",
                      }}
                    >
                      <i className="fas fa-file-pdf fa-3x"></i>
                    </div>
                    <h4 className="text-white mb-2">Performance Raport</h4>
                    <p className="text-white opacity-50 mb-4 small">
                      Detailed statistical analysis and technical evaluation
                      PDF.
                    </p>
                    <PlayerRaportPreview
                      raportUrl={player.raport_url}
                      playerName={player.user_name}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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
