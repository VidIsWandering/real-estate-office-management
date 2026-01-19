-- Migration 005: Add role_permission table for RBAC (Role-Based Access Control)
-- This table manages permissions for different staff positions

CREATE TYPE resource_enum AS ENUM ('transactions', 'contracts', 'payments', 'properties', 'partners', 'staff');
CREATE TYPE permission_enum AS ENUM ('view', 'add', 'edit', 'delete');

CREATE TABLE IF NOT EXISTS role_permission (
    id BIGSERIAL PRIMARY KEY,
    position staff_position_enum NOT NULL,
    resource resource_enum NOT NULL,
    permission permission_enum NOT NULL,
    is_granted BOOLEAN DEFAULT FALSE,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_permission_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES staff(id)
        ON DELETE SET NULL,
    CONSTRAINT uq_role_resource_permission UNIQUE (position, resource, permission)
);

CREATE INDEX IF NOT EXISTS idx_permission_position ON role_permission(position);
CREATE INDEX IF NOT EXISTS idx_permission_resource ON role_permission(resource);
CREATE INDEX IF NOT EXISTS idx_permission_position_resource ON role_permission(position, resource);

COMMENT ON TABLE role_permission IS 'RBAC permission matrix for different staff positions';
COMMENT ON TYPE resource_enum IS 'System resources that can have permissions';
COMMENT ON TYPE permission_enum IS 'Types of permissions: view, add, edit, delete';

-- Insert default permissions for all roles
INSERT INTO role_permission (position, resource, permission, is_granted) VALUES
    -- Agent permissions (view most things, full access to properties/partners)
    ('agent', 'transactions', 'view', true),
    ('agent', 'transactions', 'add', false),
    ('agent', 'transactions', 'edit', false),
    ('agent', 'transactions', 'delete', false),
    ('agent', 'contracts', 'view', true),
    ('agent', 'contracts', 'add', false),
    ('agent', 'contracts', 'edit', false),
    ('agent', 'contracts', 'delete', false),
    ('agent', 'payments', 'view', true),
    ('agent', 'payments', 'add', false),
    ('agent', 'payments', 'edit', false),
    ('agent', 'payments', 'delete', false),
    ('agent', 'properties', 'view', true),
    ('agent', 'properties', 'add', true),
    ('agent', 'properties', 'edit', true),
    ('agent', 'properties', 'delete', false),
    ('agent', 'partners', 'view', true),
    ('agent', 'partners', 'add', true),
    ('agent', 'partners', 'edit', true),
    ('agent', 'partners', 'delete', false),
    ('agent', 'staff', 'view', true),
    ('agent', 'staff', 'add', false),
    ('agent', 'staff', 'edit', false),
    ('agent', 'staff', 'delete', false),
    
    -- Legal officer permissions (contracts focused)
    ('legal_officer', 'transactions', 'view', true),
    ('legal_officer', 'transactions', 'add', false),
    ('legal_officer', 'transactions', 'edit', false),
    ('legal_officer', 'transactions', 'delete', false),
    ('legal_officer', 'contracts', 'view', true),
    ('legal_officer', 'contracts', 'add', true),
    ('legal_officer', 'contracts', 'edit', true),
    ('legal_officer', 'contracts', 'delete', false),
    ('legal_officer', 'payments', 'view', true),
    ('legal_officer', 'payments', 'add', false),
    ('legal_officer', 'payments', 'edit', false),
    ('legal_officer', 'payments', 'delete', false),
    ('legal_officer', 'properties', 'view', true),
    ('legal_officer', 'properties', 'add', false),
    ('legal_officer', 'properties', 'edit', true),
    ('legal_officer', 'properties', 'delete', false),
    ('legal_officer', 'partners', 'view', true),
    ('legal_officer', 'partners', 'add', false),
    ('legal_officer', 'partners', 'edit', false),
    ('legal_officer', 'partners', 'delete', false),
    ('legal_officer', 'staff', 'view', true),
    ('legal_officer', 'staff', 'add', false),
    ('legal_officer', 'staff', 'edit', false),
    ('legal_officer', 'staff', 'delete', false),
    
    -- Accountant permissions (payments focused)
    ('accountant', 'transactions', 'view', true),
    ('accountant', 'transactions', 'add', false),
    ('accountant', 'transactions', 'edit', false),
    ('accountant', 'transactions', 'delete', false),
    ('accountant', 'contracts', 'view', true),
    ('accountant', 'contracts', 'add', false),
    ('accountant', 'contracts', 'edit', false),
    ('accountant', 'contracts', 'delete', false),
    ('accountant', 'payments', 'view', true),
    ('accountant', 'payments', 'add', true),
    ('accountant', 'payments', 'edit', true),
    ('accountant', 'payments', 'delete', false),
    ('accountant', 'properties', 'view', true),
    ('accountant', 'properties', 'add', false),
    ('accountant', 'properties', 'edit', false),
    ('accountant', 'properties', 'delete', false),
    ('accountant', 'partners', 'view', true),
    ('accountant', 'partners', 'add', false),
    ('accountant', 'partners', 'edit', false),
    ('accountant', 'partners', 'delete', false),
    ('accountant', 'staff', 'view', true),
    ('accountant', 'staff', 'add', false),
    ('accountant', 'staff', 'edit', false),
    ('accountant', 'staff', 'delete', false),
    
    -- Manager permissions (full access to most resources)
    ('manager', 'transactions', 'view', true),
    ('manager', 'transactions', 'add', true),
    ('manager', 'transactions', 'edit', true),
    ('manager', 'transactions', 'delete', true),
    ('manager', 'contracts', 'view', true),
    ('manager', 'contracts', 'add', true),
    ('manager', 'contracts', 'edit', true),
    ('manager', 'contracts', 'delete', true),
    ('manager', 'payments', 'view', true),
    ('manager', 'payments', 'add', true),
    ('manager', 'payments', 'edit', true),
    ('manager', 'payments', 'delete', true),
    ('manager', 'properties', 'view', true),
    ('manager', 'properties', 'add', true),
    ('manager', 'properties', 'edit', true),
    ('manager', 'properties', 'delete', true),
    ('manager', 'partners', 'view', true),
    ('manager', 'partners', 'add', true),
    ('manager', 'partners', 'edit', true),
    ('manager', 'partners', 'delete', true),
    ('manager', 'staff', 'view', true),
    ('manager', 'staff', 'add', true),
    ('manager', 'staff', 'edit', true),
    ('manager', 'staff', 'delete', true),
    
    -- Admin permissions (full access to everything)
    ('admin', 'transactions', 'view', true),
    ('admin', 'transactions', 'add', true),
    ('admin', 'transactions', 'edit', true),
    ('admin', 'transactions', 'delete', true),
    ('admin', 'contracts', 'view', true),
    ('admin', 'contracts', 'add', true),
    ('admin', 'contracts', 'edit', true),
    ('admin', 'contracts', 'delete', true),
    ('admin', 'payments', 'view', true),
    ('admin', 'payments', 'add', true),
    ('admin', 'payments', 'edit', true),
    ('admin', 'payments', 'delete', true),
    ('admin', 'properties', 'view', true),
    ('admin', 'properties', 'add', true),
    ('admin', 'properties', 'edit', true),
    ('admin', 'properties', 'delete', true),
    ('admin', 'partners', 'view', true),
    ('admin', 'partners', 'add', true),
    ('admin', 'partners', 'edit', true),
    ('admin', 'partners', 'delete', true),
    ('admin', 'staff', 'view', true),
    ('admin', 'staff', 'add', true),
    ('admin', 'staff', 'edit', true),
    ('admin', 'staff', 'delete', true)
ON CONFLICT (position, resource, permission) DO NOTHING;
