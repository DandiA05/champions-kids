export const radarData = {
  labels: ["Pace", "Shooting", "Passing", "Dribbling", "Defending", "Physical"],
  datasets: [
    {
      label: "Player Ability",
      data: [82, 75, 88, 85, 60, 78],
      backgroundColor: "rgba(245, 166, 35, 0.3)",
      borderColor: "#f5a623",
      pointBackgroundColor: "#f5a623",
      borderWidth: 2,
    },
  ],
};

export const radarOptions = {
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
