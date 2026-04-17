import LogoSlide from "@/components/logo-slide";
import Link from "next/link";
import { sql } from "@/lib/db";
import { AGE_CATEGORIES, POSITIONS } from "@/lib/constants";
import { getPositionColor } from "@/lib/player-helpers";

export default async function Team(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  // Fetch active players' categories to show in filter
  const categoriesResult = await sql`
    SELECT DISTINCT age_category 
    FROM players 
    WHERE is_active = true
  `;
  const dbCategories = categoriesResult.map((r: any) => r.age_category);

  // Sort dbCategories based on the order in AGE_CATEGORIES
  const availableCategories = AGE_CATEGORIES.filter((cat) =>
    dbCategories.includes(cat),
  );

  const selectedCategory =
    searchParams.category || availableCategories[0] || "all";

  // Fetch players with user names
  let players;
  if (selectedCategory === "all") {
    players = await sql`
      SELECT p.*, u.name as user_name
      FROM players p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_active = true
      ORDER BY 
        CASE 
          WHEN p.age_category = 'U7' THEN 1
          WHEN p.age_category = 'U8' THEN 2
          WHEN p.age_category = 'U9' THEN 3
          WHEN p.age_category = 'U10' THEN 4
          WHEN p.age_category = 'U11' THEN 5
          WHEN p.age_category = 'U12' THEN 6
          WHEN p.age_category = 'U13' THEN 7
          WHEN p.age_category = 'U14' THEN 8
          WHEN p.age_category = 'U15' THEN 9
          WHEN p.age_category = 'U16' THEN 10
          WHEN p.age_category = 'U17' THEN 11
          ELSE 99
        END ASC,
        u.name ASC
    `;
  } else {
    players = await sql`
      SELECT p.*, u.name as user_name
      FROM players p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_active = true AND p.age_category = ${selectedCategory}
      ORDER BY u.name ASC
    `;
  }

  // Fetch Coaches and Staff
  const staffMembers = await sql`
    SELECT s.*, u.name as user_name, u.role
    FROM staff s
    JOIN users u ON s.user_id = u.id
    ORDER BY CASE WHEN u.role = 'coach' THEN 1 ELSE 2 END, u.name ASC
  `;

  const coaches = staffMembers.filter((s) => s.role === "coach");
  const otherStaff = staffMembers.filter((s) => s.role === "staff");

  return (
    <main>
      <section className="space-pt"></section>

      {/* Coaches & Staff Section */}
      {(coaches.length > 0 || otherStaff.length > 0) && (
        <section className="space-ptb " style={{ paddingBottom: "0px" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="section-title text-center mb-4 mb-md-5">
                  <h2 className="mb-0 text-white">Our Coaches & Staff</h2>
                  <p className="text-white mt-2">
                    Meet the dedicated professionals who guide and support our
                    young athletes on and off the field.
                  </p>
                </div>
              </div>
            </div>

            {/* Coaches */}
            {coaches.length > 0 && (
              <>
                <div className="row mb-3">
                  <div className="col-12 text-center">
                    <h4 className="sporty-section-title text-primary-psg text-uppercase fw-bold mb-4">
                      Coaches
                    </h4>
                  </div>
                </div>
                <div className="row justify-content-center mb-5">
                  {coaches.map((coach) => (
                    <div className="col-lg-3 col-md-6 mb-4" key={coach.id}>
                      <div className="staff-card">
                        <div className="staff-image-wrapper">
                          <img
                            className="img-fluid"
                            src={
                              coach.photo_url || "/images/home-01/team-01.jpg"
                            }
                            alt={coach.user_name}
                            style={{
                              width: "100%",
                              aspectRatio: "1 / 1",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                        <div className="staff-info">
                          <div className="staff-role-tag">Coach</div>
                          <h5 className="text-white text-uppercase mb-1 fw-black">
                            {coach.user_name}
                          </h5>
                          <p
                            className="text-white-50 mt-2 mb-0"
                            style={{
                              fontSize: "0.8rem",
                              height: "3.2rem",
                              overflow: "hidden",
                            }}
                          >
                            {coach.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Staff */}
            {otherStaff.length > 0 && (
              <>
                <div className="row mb-3">
                  <div className="col-12 text-center">
                    <h4 className="sporty-section-title text-white text-uppercase fw-bold mb-4">
                      Support Staff
                    </h4>
                  </div>
                </div>
                <div className="row justify-content-center">
                  {otherStaff.map((staff: any) => (
                    <div className="col-lg-3 col-md-6 mb-4" key={staff.id}>
                      <div className="staff-card">
                        <div className="staff-image-wrapper">
                          <img
                            className="img-fluid"
                            src={
                              staff.photo_url || "/images/home-01/team-01.jpg"
                            }
                            alt={staff.user_name}
                            style={{
                              width: "100%",
                              aspectRatio: "1 / 1",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                        <div className="staff-info">
                          <div
                            className="staff-role-tag"
                            style={{ background: "#eee" }}
                          >
                            Staff
                          </div>
                          <h5 className="text-white text-uppercase mb-1 fw-black">
                            {staff.user_name}
                          </h5>
                          <p
                            className="text-white-50 mt-2 mb-0"
                            style={{
                              fontSize: "0.8rem",
                              height: "3.2rem",
                              overflow: "hidden",
                            }}
                          >
                            {staff.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <hr className="bg-white opacity-10 my-5" />
          </div>
        </section>
      )}

      {/* Our Player */}
      <section className="space-ptb">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-title text-center mb-4 mb-md-5">
                <h2 className="mb-0 text-white">Our Players</h2>
                <p className="text-white mt-2">
                  Meet the talented athletes of campions Kids. Our players are
                  divided into age categories to ensure optimal development and
                  fair competition for every child.
                </p>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {availableCategories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/team?category=${cat}`}
                    scroll={false}
                    className={`btn btn-sm hover:text-black ${
                      selectedCategory === cat
                        ? "btn-light text-black"
                        : "btn-outline-light text-white"
                    }`}
                    style={{
                      borderRadius: "20px",
                      padding: "8px 20px",
                    }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="row">
            {players.length > 0 ? (
              players.map((player: any) => (
                <div className="col-lg-4 col-md-6 mb-4" key={player.id}>
                  <div className="player-card-sporty">
                    <div className="player-img-container">
                      <div className="jersey-number-overlay">
                        {player.jersey_number || "00"}
                      </div>
                      <img
                        className="img-fluid"
                        src={player.photo_url || "/images/home-01/team-01.jpg"}
                        alt={player.user_name}
                        style={{
                          width: "100%",
                          aspectRatio: "3 / 4",
                          objectFit: "cover",
                          display: "block",
                          position: "relative",
                          zIndex: 1,
                        }}
                      />
                    </div>
                    <div className="player-meta">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h4 className="player-name-sporty mb-0">
                          <div className="text-dark text-decoration-none">
                            {player.user_name}
                          </div>
                        </h4>
                        <span
                          className="fw-black italic text-muted"
                          style={{ fontSize: "1.2rem" }}
                        >
                          #{player.jersey_number || "00"}
                        </span>
                      </div>
                      <div className="d-flex gap-2">
                        <span
                          className="sporty-badge text-white"
                          style={{
                            backgroundColor: getPositionColor(player.position),
                          }}
                        >
                          {player.position?.toUpperCase()}
                        </span>
                        <span className="sporty-badge bg-dark text-white">
                          {player.age_category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4 className="text-white opacity-50">
                  No players found in this category.
                </h4>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonial Section kept as is ... */}
      <section
        className="space-ptb position-relative"
        style={{ backgroundImage: "url(/images/home-01/bg-02.jpg)" }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center ">
            <div className="col-md-8 mb-4 mb-md-5 mb-lg-0">
              <div
                className="owl-carousel dots-bottom-center"
                data-nav-dots="true"
                data-nav-arrow="false"
                data-items="1"
                data-lg-items="1"
                data-md-items="1"
                data-sm-items="1"
                data-space="30"
                data-autoheight="true"
              >
                <div className="item">
                  <div className="testimonial text-center">
                    <div className="testimonial-star-icon">
                      <ul className="justify-content-center">
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                      </ul>
                    </div>

                    <div className="testimonial-content">
                      <p className="mb-0 text-white">
                        <i>
                          &quot;Aku senang banget main bola di campions Kids!
                          Pelatihnya baik, aku jadi jago nendang bola ke gawang.
                          Mau main terus tiap hari!&quot;
                        </i>
                      </p>
                    </div>
                    <div className="testimonial-author">
                      <div className="testimonial-name">
                        <h6 className="author-tittle text-primary-psg">
                          Cakra
                        </h6>
                        <span>Pemain U-7</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimonial text-center">
                    <div className="testimonial-star-icon">
                      <ul className="justify-content-center">
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="testimonial-content">
                      <p className="mb-0 text-white">
                        <i>
                          &quot;Seru banget bisa main sama teman-teman baru. Aku
                          paling suka kalau lagi latihan lari-lari, capek tapi
                          aku senang sekali!&quot;
                        </i>
                      </p>
                    </div>
                    <div className="testimonial-author">
                      <div className="testimonial-name">
                        <h6 className="author-tittle text-primary-psg">
                          Dzaki
                        </h6>
                        <span>Pemain U-7</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimonial text-center">
                    <div className="testimonial-star-icon">
                      <ul className="justify-content-center">
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                      </ul>
                    </div>

                    <div className="testimonial-content">
                      <p className="mb-0 text-white">
                        <i>
                          &quot;Cita-citaku mau jadi pemain bola hebat kayak
                          Cristiano Ronaldo. Di sini aku belajar banyak cara
                          oper bola sama gocek-gocek!&quot;
                        </i>
                      </p>
                    </div>
                    <div className="testimonial-author">
                      <div className="testimonial-name">
                        <h6 className="author-tittle text-primary-psg">Ryu</h6>
                        <span>Pemain U-7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LogoSlide />
    </main>
  );
}
