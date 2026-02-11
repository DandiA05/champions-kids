import { neon } from "@neondatabase/serverless";

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const {
    PGUSER,
    PGPASSWORD,
    PGHOST,
    PGDATABASE,
    PGSSLMODE,
    PGCHANNELBINDING,
  } = process.env;
  if (PGUSER && PGPASSWORD && PGHOST && PGDATABASE) {
    return `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=${PGSSLMODE || "require"}&channel_binding=${PGCHANNELBINDING || "require"}`;
  }

  throw new Error(
    "Database configuration is missing. Set DATABASE_URL or individual PG variables.",
  );
};

const DATABASE_URL = getDatabaseUrl();

// Create a single neon connection instance
export const sql = neon(DATABASE_URL);

// Helper type for user from database
export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "non-admin";
  created_at: Date;
  updated_at: Date;
}

// Database query helpers
export const db = {
  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;
    return (users[0] as User) || null;
  },

  // Get user by ID
  async getUserById(id: number): Promise<User | null> {
    const users = await sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `;
    return (users[0] as User) || null;
  },

  // Get all users
  async getAllUsers(): Promise<User[]> {
    const users = await sql`
      SELECT id, name, email, role, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    return users as User[];
  },

  // Create new user
  async createUser(
    name: string,
    email: string,
    passwordHash: string,
    role: "admin" | "non-admin" = "non-admin",
  ): Promise<User> {
    const users = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${name}, ${email}, ${passwordHash}, ${role})
      RETURNING *
    `;
    return users[0] as User;
  },

  // Update user's updated_at timestamp
  async touchUser(id: number): Promise<void> {
    await sql`
      UPDATE users 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id}
    `;
  },
};
