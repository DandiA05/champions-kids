export const getPositionColor = (pos: string) => {
  const attackers = ["ST", "CF", "LW", "RW"];
  const midfielders = ["CM", "AM", "DM"];
  const defenders = ["CB", "LB", "RB"];

  if (attackers.includes(pos)) return "#d32f2f"; // Red
  if (midfielders.includes(pos)) return "#2e7d32"; // Green
  if (defenders.includes(pos)) return "#0288d1"; // Blue
  if (pos === "GK") return "#ed6c02"; // Gold/Orange
  return "var(--pgs_secondary_color)";
};
