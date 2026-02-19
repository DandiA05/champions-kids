-- Add new columns
ALTER TABLE players ADD COLUMN IF NOT EXISTS jersey_number INTEGER;
ALTER TABLE players ADD COLUMN IF NOT EXISTS age_category VARCHAR(10);

-- Remove old columns (optional, but keep it clean)
-- We keep them for now to avoid breaking existing queries until everything is updated
-- ALTER TABLE players DROP COLUMN IF EXISTS nationality;
-- ALTER TABLE players DROP COLUMN IF EXISTS current_team;
