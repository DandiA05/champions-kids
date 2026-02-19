-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  position VARCHAR(100),
  nationality VARCHAR(100),
  current_team VARCHAR(100),
  past_teams TEXT,
  birthday DATE,
  photo_url TEXT,
  biography TEXT,
  
  -- Attributes
  pace INTEGER DEFAULT 0,
  shooting INTEGER DEFAULT 0,
  passing INTEGER DEFAULT 0,
  dribbling INTEGER DEFAULT 0,
  defending INTEGER DEFAULT 0,
  physical INTEGER DEFAULT 0,

  -- Stats
  appearances INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  mom INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
