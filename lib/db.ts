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
  role: "admin" | "non-admin" | "player" | "coach" | "staff";
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface StaffMember {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  role?: string;
  photo_url: string;
  description: string;
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
  raport_url: string;
  coach_notes: string;

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

export interface Schedule {
  id: number;
  name: string;
  date: string;
  category: "training" | "sparing" | "tournament" | "liga";
  description: string;
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
    role: "admin" | "non-admin" | "player" | "coach" | "staff" = "non-admin",
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
      role?: "admin" | "non-admin" | "player" | "coach" | "staff";
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

  // --- Schedule Helpers ---

  // Get all schedules
  async getAllSchedules(): Promise<Schedule[]> {
    const schedules = await sql`
      SELECT * FROM schedules ORDER BY date DESC
    `;
    return schedules as Schedule[];
  },

  // Get schedule by ID
  async getScheduleById(id: number): Promise<Schedule | null> {
    const schedules = await sql`
      SELECT * FROM schedules WHERE id = ${id} LIMIT 1
    `;
    return (schedules[0] as Schedule) || null;
  },

  // Create new schedule
  async createSchedule(
    name: string,
    date: string,
    category: string,
    description: string,
  ): Promise<Schedule> {
    const schedules = await sql`
      INSERT INTO schedules (name, date, category, description)
      VALUES (${name}, ${date}, ${category}, ${description})
      RETURNING *
    `;
    return schedules[0] as Schedule;
  },

  // Update schedule
  async updateSchedule(
    id: number,
    updates: {
      name?: string;
      date?: string;
      category?: string;
      description?: string;
    },
  ): Promise<Schedule> {
    const { name, date, category, description } = updates;
    const schedules = await sql`
      UPDATE schedules 
      SET 
        name = COALESCE(${name}, name),
        date = COALESCE(${date}, date),
        category = COALESCE(${category}, category),
        description = COALESCE(${description}, description),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id}
      RETURNING *
    `;
    return schedules[0] as Schedule;
  },

  // Delete schedule
  async deleteSchedule(id: number): Promise<void> {
    await sql`
      DELETE FROM schedules WHERE id = ${id}
    `;
  },

  // --- Staff Helpers ---

  // Get all staff
  async getAllStaff(): Promise<StaffMember[]> {
    const staff = await sql`
      SELECT s.*, u.name as user_name, u.email as user_email, u.role
      FROM staff s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `;
    return staff as StaffMember[];
  },

  // Get staff by ID
  async getStaffById(id: number): Promise<StaffMember | null> {
    const staff = await sql`
      SELECT s.*, u.name as user_name, u.email as user_email, u.role
      FROM staff s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ${id}
      LIMIT 1
    `;
    return (staff[0] as StaffMember) || null;
  },

  // Create new staff
  async createStaff(
    userId: number,
    photoUrl: string,
    description: string,
  ): Promise<StaffMember> {
    const staff = await sql`
      INSERT INTO staff (user_id, photo_url, description)
      VALUES (${userId}, ${photoUrl}, ${description})
      RETURNING *
    `;
    return staff[0] as StaffMember;
  },

  // Update staff
  async updateStaff(
    id: number,
    updates: {
      photo_url?: string;
      description?: string;
    },
  ): Promise<StaffMember> {
    const { photo_url, description } = updates;
    const staff = await sql`
      UPDATE staff 
      SET 
        photo_url = COALESCE(${photo_url}, photo_url),
        description = COALESCE(${description}, description),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id}
      RETURNING *
    `;
    return staff[0] as StaffMember;
  },

  // Delete staff
  async deleteStaff(id: number): Promise<void> {
    await sql`
      DELETE FROM staff WHERE id = ${id}
    `;
  },
};
