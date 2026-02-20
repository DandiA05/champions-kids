"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      console.log("Countdown Target Date:", targetDate);
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      } else {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-main">
      <div className="countdown">
        <span className="days">{timeLeft.days}</span>
        <p className="days_ref">Days</p>
      </div>
      <div className="countdown">
        <span className="hours">{timeLeft.hours}</span>
        <p className="hours_ref">Hrs</p>
      </div>
      <div className="countdown">
        <span className="minutes">{timeLeft.minutes}</span>
        <p className="minutes_ref">Min</p>
      </div>
      <div className="countdown">
        <span className="seconds">{timeLeft.seconds}</span>
        <p className="seconds_ref">Sec</p>
      </div>
    </div>
  );
}
