-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  home_club_id INTEGER NOT NULL REFERENCES clubs(id) ON DELETE RESTRICT,
  away_club_id INTEGER NOT NULL REFERENCES clubs(id) ON DELETE RESTRICT,
  match_date DATE NOT NULL,
  match_time TIME,
  venue VARCHAR(255),
  score_home INTEGER DEFAULT NULL,
  score_away INTEGER DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_home_club ON matches(home_club_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_club ON matches(away_club_id);

-- Notes:
-- Status is derived:
--   score_home IS NULL OR score_away IS NULL  → "Upcoming"
--   score_home IS NOT NULL AND score_away IS NOT NULL → "Selesai"
