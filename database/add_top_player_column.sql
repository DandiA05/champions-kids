-- Migration: Add is_top_player column to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS is_top_player BOOLEAN DEFAULT FALSE;
