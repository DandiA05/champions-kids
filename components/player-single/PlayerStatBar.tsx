"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function PlayerStatBar({
  label,
  value,
  max = 100,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const progress = (value / max) * 100;

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });

    return () => controls.stop();
  }, [value]);

  return (
    <div className="player-stat mb-4">
      <div className="d-flex justify-content-between mb-2">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{displayValue}</span>
      </div>

      <div className="stat-bar">
        <motion.div
          className="stat-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
