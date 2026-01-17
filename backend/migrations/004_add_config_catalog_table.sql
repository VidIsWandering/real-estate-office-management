-- Migration 004: Add config_catalog table for configurable catalogs
-- This table stores configurable options for property types, areas, lead sources, etc.

CREATE TYPE catalog_type_enum AS ENUM ('property_type', 'area', 'lead_source', 'contract_type');

CREATE TABLE IF NOT EXISTS config_catalog (
    id BIGSERIAL PRIMARY KEY,
    type catalog_type_enum NOT NULL,
    value VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_catalog_created_by
        FOREIGN KEY (created_by)
        REFERENCES staff(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_catalog_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES staff(id)
        ON DELETE SET NULL,
    CONSTRAINT uq_catalog_type_value UNIQUE (type, value)
);

CREATE INDEX IF NOT EXISTS idx_catalog_type ON config_catalog(type);
CREATE INDEX IF NOT EXISTS idx_catalog_active ON config_catalog(is_active);
CREATE INDEX IF NOT EXISTS idx_catalog_order ON config_catalog(type, display_order);

COMMENT ON TABLE config_catalog IS 'Configurable catalogs for property types, areas, sources, contract types';
COMMENT ON TYPE catalog_type_enum IS 'Types of configurable catalogs in the system';

-- Insert sample catalog data
INSERT INTO config_catalog (type, value, display_order) VALUES
    -- Property types
    ('property_type', 'Apartment', 1),
    ('property_type', 'House', 2),
    ('property_type', 'Land', 3),
    ('property_type', 'Commercial', 4),
    -- Areas
    ('area', 'Downtown', 1),
    ('area', 'Riverside', 2),
    ('area', 'Westside', 3),
    ('area', 'North Valley', 4),
    -- Lead sources
    ('lead_source', 'Website', 1),
    ('lead_source', 'Facebook', 2),
    ('lead_source', 'Referral', 3),
    ('lead_source', 'Walk-in', 4),
    -- Contract types
    ('contract_type', 'Deposit agreement', 1),
    ('contract_type', 'Sale & purchase agreement', 2),
    ('contract_type', 'Lease agreement', 3)
ON CONFLICT (type, value) DO NOTHING;
