-- Migration 006: Update staff table with additional fields
-- Add created_at, updated_at, and preferences columns

-- Add missing columns to staff table
ALTER TABLE staff 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

COMMENT ON COLUMN staff.created_at IS 'Timestamp when staff record was created';
COMMENT ON COLUMN staff.updated_at IS 'Timestamp of last update to staff record';
COMMENT ON COLUMN staff.preferences IS 'Staff preferences and settings (JSONB)';

-- Update existing records to have timestamps
UPDATE staff 
SET created_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL OR updated_at IS NULL;
