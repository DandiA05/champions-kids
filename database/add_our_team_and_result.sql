-- Migration to add is_our_team to clubs and result to matches
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS is_our_team BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS result VARCHAR(10);
