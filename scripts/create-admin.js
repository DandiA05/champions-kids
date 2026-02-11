// Script to create the first admin user
// Run this with: node scripts/create-admin.js

const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "admin123"; // Change this to your desired password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log("Password:", password);
  console.log("Bcrypt Hash:", hash);
  console.log("\nUse this hash in your SQL INSERT statement:");
  console.log(`
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@example.com',
  '${hash}',
  'admin'
);
  `);
}

generateHash();
