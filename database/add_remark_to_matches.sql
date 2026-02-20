-- Migration to add remark column to matches
ALTER TABLE matches ADD COLUMN IF NOT EXISTS remark VARCHAR(255);
