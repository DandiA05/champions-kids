"use client";

import "@/src/lib/chartConfig";
import { radarData, radarOptions } from "@/components/player-single/radar";
import Link from "next/link";
import { Radar } from "react-chartjs-2";
import PlayerStatBar from "@/components/player-single/PlayerStatBar";
import LogoSlide from "@/components/logo-slide";

export default function PlayerSingle() {
  return (
    <main>
      {/* Banner */}
      {/* <section
        className="inner-banner bg-overlay-black-6 bg-holder"
        style={{ backgroundImage: "url(/images/inner-banner/01.jpg)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-banner-tittle">
                <h2>Player Single</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Player Single</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="space-pt"></section>

      {/* Player Detail */}
      <section className="space-ptb single-player">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="player-img">
                <img
                  className="img-fluid"
                  src="/images/home-01/team-01.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-7 mt-4 mt-md-5 mt-lg-0 ps-3 ps-lg-5">
              <div className="player-info">
                <h2 className="mb-2">
                  <Link href="#" className="player-name text-white">
                    Mellissa Doe
                  </Link>
                </h2>
                <span className="d-block player-position">( Forward )</span>
                <ul className="list-unstyled  mt-4">
                  <li className="d-flex mb-3 mx-0">
                    <span className="me-4"> Age :</span> 50 Yers
                  </li>
                  <li className="d-flex mb-0 mx-0">
                    <span className="me-4"> Birthday :</span> January 2,1970
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
              <p className="text-white">Technical & Physical Profile</p>
            </div>
          </div>

          <div className="row align-items-center">
            {/* LEFT – Stat Bars */}
            <div className="col-lg-6 mb-5 mb-lg-0">
              <PlayerStatBar label="Pace" value={78} />
              <PlayerStatBar label="Shooting" value={85} />
              <PlayerStatBar label="Passing" value={90} />
              <PlayerStatBar label="Dribbling" value={82} />
              <PlayerStatBar label="Defending" value={65} />
              <PlayerStatBar label="Physical" value={88} />
            </div>

            {/* RIGHT – Radar */}
            <div className="col-lg-6">
              <div className="radar-wrapper mx-auto" style={{ maxWidth: 420 }}>
                <Radar data={radarData} options={radarOptions} />
              </div>
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
              <p className="text-white mb-0">Competition Performance</p>
            </div>
          </div>

          <div className="row text-center">
            {[
              { value: 28, label: "Appearances" },
              { value: 15, label: "Goals" },
              { value: 9, label: "Assists" },
              { value: 4, label: "Yellow Cards" },
              { value: 1, label: "Red Cards" },
              { value: 2, label: "Player of Match" },
            ].map((item, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-2 mb-4">
                <div className="stat-box">
                  <h3 className="stat-number">{item.value}</h3>
                  <span className="stat-label">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Player */}
      <section className="player-about">
        <div className="player-about-bg">
          <div className="container">
            <div className="row">
              <div className="col-xl-6">
                <div className="player-about-details">
                  <h2>About Player</h2>
                  <div className="mb-4">
                    <span className="text-white">Biography</span>
                  </div>
                  <p className="text-white">
                    Things like “I’m not good enough”, “I’m not smart enough”,
                    “I’m not lucky enough”, and the worst, “I’m not worthy” are
                    but a few of the self-limiting beliefs I have encountered.
                    We carry them with us like rocks in a knapsack, and then use
                    them to sabotage our success. So, how twisted is that?
                  </p>
                  <p className="text-white mb-0">
                    We all carry a lot of baggage, thanks to our upbringing. The
                    majority of people carry with them, an entire series of
                    self-limiting beliefs that will absolutely stop, and hold
                    them back from, success.
                  </p>
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
