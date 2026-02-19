"use client";

import "@/src/lib/chartConfig";
import { Radar } from "react-chartjs-2";

interface PlayerRadarChartProps {
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
}

export default function PlayerRadarChart({
  attributes,
}: PlayerRadarChartProps) {
  const radarData = {
    labels: [
      "Pace",
      "Shooting",
      "Passing",
      "Dribbling",
      "Defending",
      "Physical",
    ],
    datasets: [
      {
        label: "Player Ability",
        data: [
          attributes.pace,
          attributes.shooting,
          attributes.passing,
          attributes.dribbling,
          attributes.defending,
          attributes.physical,
        ],
        backgroundColor: "rgba(245, 166, 35, 0.3)",
        borderColor: "#f5a623",
        pointBackgroundColor: "#f5a623",
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#ccc",
          backdropColor: "transparent",
        },
        grid: {
          color: "rgba(255,255,255,0.15)",
        },
        angleLines: {
          color: "rgba(255,255,255,0.2)",
        },
        pointLabels: {
          color: "#fff",
          font: {
            size: 13,
            weight: 600,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div
      className="radar-wrapper mx-auto"
      style={{ maxWidth: 420, height: 420 }}
    >
      <Radar data={radarData} options={radarOptions as any} />
    </div>
  );
}
