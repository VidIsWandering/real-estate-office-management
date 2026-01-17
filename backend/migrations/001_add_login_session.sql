-- Migration: Add login_session table for active sessions tracking
-- This table was missing from the original schema

CREATE TABLE IF NOT EXISTS login_session (
    id SERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_login_session_account 
        FOREIGN KEY (account_id) 
        REFERENCES account(id) 
        ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_login_session_account ON login_session(account_id);
CREATE INDEX IF NOT EXISTS idx_login_session_token ON login_session(token_hash);
CREATE INDEX IF NOT EXISTS idx_login_session_expires ON login_session(expires_at);
CREATE INDEX IF NOT EXISTS idx_login_session_active ON login_session(is_active, expires_at);

COMMENT ON TABLE login_session IS 'Active login sessions with refresh tokens';
