"use client";

import { useEffect, useState } from "react";
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

interface MatchCountdownClientProps {
  match: Match;
  targetDate: string;
}

export default function MatchCountdownClient({
  match,
  targetDate,
}: MatchCountdownClientProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkVisibility = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setIsVisible(false);
      }
    };

    checkVisibility();
    const timer = setInterval(checkVisibility, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isVisible) return null;

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
