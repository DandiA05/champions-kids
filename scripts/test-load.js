try {
  const { neon } = require("@neondatabase/serverless");
  console.log("Package @neondatabase/serverless loaded successfully!");
} catch (e) {
  console.error("Failed to load @neondatabase/serverless:", e.message);
}
