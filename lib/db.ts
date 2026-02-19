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
  role: "admin" | "non-admin" | "player";
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Player {
  id: number;
  user_id: number;
  position: string;
  jersey_number: number;
  age_category: string;
  past_teams: string;
  birthday: string;
  photo_url: string;
  biography: string;
  is_active: boolean;
  is_top_player: boolean;

  // Attributes
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;

  // Stats
  appearances: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  mom: number;

  created_at: Date;
  updated_at: Date;

  // Joined fields
}

export interface Event {
  id: number;
  title: string;
  banner_url: string;
  description: string;
  event_date: string;
  documentation_urls: string[];
  created_at: Date;
  updated_at: Date;
}

// Database query helpers
export const db = {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    const events = await sql`
      SELECT * FROM events ORDER BY event_date DESC
    `;
    return events as Event[];
  },

  // Get event by ID
  async getEventById(id: number): Promise<Event | null> {
    const events = await sql`
      SELECT * FROM events WHERE id = ${id} LIMIT 1
    `;
    return (events[0] as Event) || null;
  },

  // Get latest events (for home page)
  async getLatestEvents(limit: number = 3): Promise<Event[]> {
    const events = await sql`
      SELECT * FROM events ORDER BY event_date DESC LIMIT ${limit}
    `;
    return events as Event[];
  },

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
      SELECT id, name, email, role, is_active, created_at, updated_at 
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
    role: "admin" | "non-admin" | "player" = "non-admin",
    is_active: boolean = true,
  ): Promise<User> {
    const users = await sql`
      INSERT INTO users (name, email, password_hash, role, is_active)
      VALUES (${name}, ${email}, ${passwordHash}, ${role}, ${is_active})
      RETURNING *
    `;
    return users[0] as User;
  },

  // Update user details
  async updateUser(
    id: number,
    updates: {
      name?: string;
      email?: string;
      password_hash?: string;
      role?: "admin" | "non-admin" | "player";
      is_active?: boolean;
    },
  ): Promise<User> {
    const { name, email, password_hash, role, is_active } = updates;
    const users = await sql`
      UPDATE users 
      SET 
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        password_hash = COALESCE(${password_hash}, password_hash),
        role = COALESCE(${role}, role),
        is_active = COALESCE(${is_active}, is_active),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id}
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
