-- Migration 003: Add system_config table for Office/Notifications settings
-- This table stores system-wide configuration with JSONB values

CREATE TABLE IF NOT EXISTS system_config (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_system_config_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES staff(id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_system_config_updated_by ON system_config(updated_by);
CREATE INDEX IF NOT EXISTS idx_system_config_updated_at ON system_config(updated_at);

COMMENT ON TABLE system_config IS 'System-wide configuration with JSONB storage for nested settings';
COMMENT ON COLUMN system_config.key IS 'Configuration key (e.g., company_info, notification_settings)';
COMMENT ON COLUMN system_config.value IS 'JSONB value supporting nested structures';

-- Insert default configurations for Office and Notifications tabs
INSERT INTO system_config (key, value, description) VALUES
    ('company_info', '{
        "company_name": "Real Estate Office",
        "address": "123 Main St, City",
        "phone": "0123456789",
        "email": "info@example.com",
        "website": "https://example.com",
        "tax_code": "1234567890"
    }'::jsonb, 'Company information for Office settings'),
    
    ('notification_settings', '{
        "email": true,
        "sms": false,
        "in_app": true,
        "desktop": false
    }'::jsonb, 'Notification preferences')
ON CONFLICT (key) DO NOTHING;
