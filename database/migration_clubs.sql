-- Create clubs table (Master Club)
CREATE TABLE IF NOT EXISTS clubs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster name lookups
CREATE INDEX IF NOT EXISTS idx_clubs_name ON clubs(name);

-- Insert sample club data
INSERT INTO clubs (name, logo_url) VALUES
  ('Champions Kids FC', NULL),
  ('Lions Academy', NULL),
  ('Eagles Youth Club', NULL),
  ('Dragons Football School', NULL)
ON CONFLICT DO NOTHING;
