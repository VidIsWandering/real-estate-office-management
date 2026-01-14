-- Add login_sessions table for session management
CREATE TABLE IF NOT EXISTS login_session (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL, -- Hash of refresh token for security
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info JSONB,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_login_session_account ON login_session(account_id);
CREATE INDEX idx_login_session_token ON login_session(token_hash);
CREATE INDEX idx_login_session_active ON login_session(is_active, expires_at);

-- Update audit_log table to include more login tracking fields
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'success'; -- success, failed

COMMENT ON TABLE login_session IS 'Active login sessions for users';
COMMENT ON COLUMN login_session.token_hash IS 'SHA256 hash of refresh token';
COMMENT ON COLUMN login_session.device_info IS 'Device information (browser, OS, etc.)';
COMMENT ON COLUMN login_session.last_activity IS 'Last API activity timestamp';

-- Index for login history queries (use created_at instead of timestamp)
CREATE INDEX IF NOT EXISTS idx_audit_log_action_created ON audit_log(action_type, created_at DESC);
