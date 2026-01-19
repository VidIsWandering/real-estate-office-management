-- Migration 008: Add updated_at column to account table
-- This tracks when account information was last modified

ALTER TABLE account 
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

COMMENT ON COLUMN account.updated_at IS 'Timestamp of last update to account record';

-- Create trigger to automatically update updated_at on account changes
CREATE OR REPLACE FUNCTION update_account_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_account_updated_at ON account;
CREATE TRIGGER trigger_account_updated_at
    BEFORE UPDATE ON account
    FOR EACH ROW
    EXECUTE FUNCTION update_account_updated_at();

-- Update existing records
UPDATE account 
SET updated_at = CURRENT_TIMESTAMP
WHERE updated_at IS NULL;
