-- Migration 007: Add 'admin' position to staff_position_enum
-- This allows creating admin users with full system access

-- Add 'admin' value to existing enum
ALTER TYPE staff_position_enum ADD VALUE IF NOT EXISTS 'admin' BEFORE 'manager';

COMMENT ON TYPE staff_position_enum IS 'Staff positions: admin (system admin), manager (quản lý), agent (môi giới), legal_officer (pháp lý), accountant (kế toán)';

-- Add admin account if not exists (using same password as others: Password123)
INSERT INTO account (username, password, is_active) VALUES 
    ('admin', '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC', true)
ON CONFLICT (username) DO NOTHING;

-- Add admin staff record
INSERT INTO staff (account_id, full_name, email, position, status) 
SELECT 
    a.id,
    'Admin User',
    'admin@example.com',
    'admin',
    'working'
FROM account a
WHERE a.username = 'admin'
ON CONFLICT (account_id) DO NOTHING;
