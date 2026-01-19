-- ============================================================================
-- REAL ESTATE MANAGEMENT SYSTEM 
-- Aligned with context_design.md
-- ============================================================================

-- ============================================================================
-- 1. ACCOUNT
-- ============================================================================
CREATE TABLE account (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_account_username ON account(username);
CREATE INDEX idx_account_active ON account(is_active);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_account_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_account_updated_at
    BEFORE UPDATE ON account
    FOR EACH ROW
    EXECUTE FUNCTION update_account_updated_at();

-- ============================================================================
-- 2. STAFF
-- ============================================================================
-- Positions: ADMIN, MANAGER, AGENT, LEGAL_OFFICER, ACCOUNTANT
CREATE TYPE staff_position_enum AS ENUM ('admin', 'manager', 'agent', 'legal_officer', 'accountant');
CREATE TYPE staff_status_enum AS ENUM ('working', 'off_duty');

CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    phone_number VARCHAR(12),
    address VARCHAR(100),
    assigned_area VARCHAR(100),
    position staff_position_enum NOT NULL DEFAULT 'agent',
    status staff_status_enum DEFAULT 'working',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_staff_account 
        FOREIGN KEY (account_id) 
        REFERENCES account(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_staff_account ON staff(account_id);
CREATE INDEX idx_staff_position ON staff(position);

-- ============================================================================
-- 3. CLIENT
-- ============================================================================
CREATE TYPE client_type_enum AS ENUM ('buyer', 'seller', 'landlord', 'tenant');

CREATE TABLE client (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    phone_number VARCHAR(12),
    address VARCHAR(100),
    type client_type_enum NOT NULL,
    referral_src TEXT,
    requirement TEXT,
    staff_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_client_staff 
        FOREIGN KEY (staff_id) 
        REFERENCES staff(id) 
        ON DELETE SET NULL
);

CREATE INDEX idx_client_staff ON client(staff_id);
CREATE INDEX idx_client_type ON client(type);

-- ============================================================================
-- 4. FILE
-- ============================================================================
CREATE TABLE file (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    name TEXT NOT NULL,
    type VARCHAR(20),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. REAL_ESTATE
-- ============================================================================
CREATE TYPE transaction_type_enum AS ENUM ('sale', 'rent');
CREATE TYPE direction_enum AS ENUM ('north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest');
-- Status per context_design.md
CREATE TYPE real_estate_status_enum AS ENUM ('created', 'pending_legal_check', 'listed', 'negotiating', 'transacted', 'suspended');

CREATE TABLE real_estate (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    transaction_type transaction_type_enum NOT NULL,
    location VARCHAR(100) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    area NUMERIC(12,2) NOT NULL,
    description TEXT,
    direction direction_enum,
    media_files BIGINT[],
    owner_id BIGINT NOT NULL,
    legal_docs BIGINT[],
    staff_id BIGINT NOT NULL,
    status real_estate_status_enum DEFAULT 'created',
    
    CONSTRAINT fk_real_estate_owner 
        FOREIGN KEY (owner_id) 
        REFERENCES client(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_real_estate_staff 
        FOREIGN KEY (staff_id) 
        REFERENCES staff(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT chk_price_positive 
        CHECK (price > 0),
    
    CONSTRAINT chk_area_positive 
        CHECK (area > 0)
);

CREATE INDEX idx_real_estate_owner ON real_estate(owner_id);
CREATE INDEX idx_real_estate_staff ON real_estate(staff_id);
CREATE INDEX idx_real_estate_status ON real_estate(status);
CREATE INDEX idx_real_estate_type ON real_estate(type);

-- ============================================================================
-- 6. APPOINTMENT
-- ============================================================================
CREATE TYPE appointment_status_enum AS ENUM ('created', 'confirmed', 'completed', 'cancelled');

CREATE TABLE appointment (
    id BIGSERIAL PRIMARY KEY,
    real_estate_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(100),
    status appointment_status_enum DEFAULT 'created',
    note TEXT,
    
    CONSTRAINT fk_appointment_real_estate 
        FOREIGN KEY (real_estate_id) 
        REFERENCES real_estate(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_appointment_client 
        FOREIGN KEY (client_id) 
        REFERENCES client(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_appointment_staff 
        FOREIGN KEY (staff_id) 
        REFERENCES staff(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT chk_appointment_time 
        CHECK (end_time > start_time)
);

CREATE INDEX idx_appointment_real_estate ON appointment(real_estate_id);
CREATE INDEX idx_appointment_client ON appointment(client_id);
CREATE INDEX idx_appointment_staff ON appointment(staff_id);
CREATE INDEX idx_appointment_start_time ON appointment(start_time);

-- ============================================================================
-- 7. TERM
-- ============================================================================
CREATE TABLE term (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL
);

-- ============================================================================
-- 8. TRANSACTION
-- ============================================================================
-- Status per context_design.md
CREATE TYPE transaction_status_enum AS ENUM ('negotiating', 'pending_contract', 'cancelled');

CREATE TABLE transaction (
    id BIGSERIAL PRIMARY KEY,
    real_estate_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    offer_price NUMERIC(12,2) NOT NULL,
    terms BIGINT[],
    status transaction_status_enum DEFAULT 'negotiating',
    cancellation_reason TEXT,
    
    CONSTRAINT fk_transaction_real_estate 
        FOREIGN KEY (real_estate_id) 
        REFERENCES real_estate(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_transaction_client 
        FOREIGN KEY (client_id) 
        REFERENCES client(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_transaction_staff 
        FOREIGN KEY (staff_id) 
        REFERENCES staff(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT chk_offer_price_positive 
        CHECK (offer_price > 0)
);

CREATE INDEX idx_transaction_real_estate ON transaction(real_estate_id);
CREATE INDEX idx_transaction_client ON transaction(client_id);
CREATE INDEX idx_transaction_staff ON transaction(staff_id);
CREATE INDEX idx_transaction_status ON transaction(status);

-- ============================================================================
-- 9. CONTRACT
-- ============================================================================
CREATE TYPE contract_type_enum AS ENUM ('deposit', 'purchase', 'lease');
-- Status per context_design.md
CREATE TYPE contract_status_enum AS ENUM ('draft', 'pending_signature', 'signed', 'notarized', 'finalized', 'cancelled');

CREATE TABLE contract (
    id BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT NOT NULL UNIQUE,
    type contract_type_enum NOT NULL,
    party_a BIGINT NOT NULL,
    party_b BIGINT NOT NULL,
    total_value NUMERIC(12,2) NOT NULL,
    deposit_amount NUMERIC(12,2) DEFAULT 0,
    payment_terms BIGINT[],
    paid_amount NUMERIC(12,2) DEFAULT 0,
    remaining_amount NUMERIC(12,2) NOT NULL,
    signed_date DATE,
    effective_date DATE NOT NULL,
    expiration_date DATE,
    attachments BIGINT[],
    status contract_status_enum DEFAULT 'draft',
    staff_id BIGINT NOT NULL,
    
    CONSTRAINT fk_contract_transaction 
        FOREIGN KEY (transaction_id) 
        REFERENCES transaction(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_contract_party_a 
        FOREIGN KEY (party_a) 
        REFERENCES client(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_contract_party_b 
        FOREIGN KEY (party_b) 
        REFERENCES client(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_contract_staff 
        FOREIGN KEY (staff_id) 
        REFERENCES staff(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT chk_contract_parties 
        CHECK (party_a != party_b),
    
    CONSTRAINT chk_total_value_positive 
        CHECK (total_value > 0),
    
    CONSTRAINT chk_contract_amounts 
        CHECK (paid_amount + remaining_amount = total_value),
    
    CONSTRAINT chk_deposit_valid 
        CHECK (deposit_amount >= 0 AND deposit_amount <= total_value),
    
    CONSTRAINT chk_contract_dates 
        CHECK (expiration_date IS NULL OR effective_date <= expiration_date)
);

CREATE INDEX idx_contract_transaction ON contract(transaction_id);
CREATE INDEX idx_contract_party_a ON contract(party_a);
CREATE INDEX idx_contract_party_b ON contract(party_b);
CREATE INDEX idx_contract_staff ON contract(staff_id);
CREATE INDEX idx_contract_status ON contract(status);

-- ============================================================================
-- 10. VOUCHER
-- ============================================================================
CREATE TYPE voucher_type_enum AS ENUM ('receipt', 'payment');
CREATE TYPE payment_method_enum AS ENUM ('cash', 'bank_transfer');
CREATE TYPE voucher_status_enum AS ENUM ('created', 'confirmed');

CREATE TABLE voucher (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    type voucher_type_enum NOT NULL,
    party VARCHAR(100) NOT NULL,
    payment_time TIMESTAMP NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    payment_method payment_method_enum NOT NULL,
    payment_description TEXT,
    attachments BIGINT[],
    staff_id BIGINT NOT NULL,
    status voucher_status_enum DEFAULT 'created',
    
    CONSTRAINT fk_voucher_contract 
        FOREIGN KEY (contract_id) 
        REFERENCES contract(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_voucher_staff 
        FOREIGN KEY (staff_id) 
        REFERENCES staff(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT chk_amount_positive 
        CHECK (amount > 0)
);

CREATE INDEX idx_voucher_contract ON voucher(contract_id);
CREATE INDEX idx_voucher_staff ON voucher(staff_id);
CREATE INDEX idx_voucher_status ON voucher(status);

-- ============================================================================
-- 11. CLIENT_NOTE (Contact History - UC2.2)
-- ============================================================================
CREATE TABLE client_note (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL,
    staff_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_client_note_client 
        FOREIGN KEY (client_id) 
        REFERENCES client(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_client_note_staff 
        FOREIGN KEY (staff_id) 
        REFERENCES staff(id) 
        ON DELETE SET NULL
);

CREATE INDEX idx_client_note_client ON client_note(client_id);
CREATE INDEX idx_client_note_staff ON client_note(staff_id);
CREATE INDEX idx_client_note_created ON client_note(created_at);

-- ============================================================================
-- 12. AUDIT_LOG (Activity Logs for Manager - UC9.3)
-- ============================================================================
-- Note: This is AUDIT LOG (who did what), NOT application logs (errors, debug)
-- Audit logs belong in DB because they need to be queried, filtered, reported
CREATE TYPE action_type_enum AS ENUM (
    'create', 'update', 'delete', 'status_change',
    'login', 'logout', 'export', 'approve', 'reject'
);

CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    actor_id BIGINT,
    action_type action_type_enum NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id BIGINT,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_log_actor 
        FOREIGN KEY (actor_id) 
        REFERENCES staff(id) 
        ON DELETE SET NULL
);

CREATE INDEX idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_log_action ON audit_log(action_type);
CREATE INDEX idx_audit_log_target ON audit_log(target_type, target_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ============================================================================
-- 13. LOGIN_SESSION - Active login sessions tracking
-- ============================================================================
CREATE TABLE login_session (
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

CREATE INDEX idx_login_session_account ON login_session(account_id);
CREATE INDEX idx_login_session_token ON login_session(token_hash);
CREATE INDEX idx_login_session_expires ON login_session(expires_at);
CREATE INDEX idx_login_session_active ON login_session(is_active, expires_at);

-- ============================================================================
-- 10. SYSTEM_CONFIG - System configuration with JSONB storage
-- ============================================================================
CREATE TABLE system_config (
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

CREATE INDEX idx_system_config_updated_by ON system_config(updated_by);
CREATE INDEX idx_system_config_updated_at ON system_config(updated_at);

-- Insert default system configurations
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
    }'::jsonb, 'Notification preferences');

-- ============================================================================
-- 11. CONFIG_CATALOG - Configurable catalogs (property types, areas, sources, contract types)
-- ============================================================================
CREATE TYPE catalog_type_enum AS ENUM ('property_type', 'area', 'lead_source', 'contract_type');

CREATE TABLE config_catalog (
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

CREATE INDEX idx_catalog_type ON config_catalog(type);
CREATE INDEX idx_catalog_active ON config_catalog(is_active);
CREATE INDEX idx_catalog_order ON config_catalog(type, display_order);

-- ============================================================================
-- 12. ROLE_PERMISSION - Permission matrix for roles (agent, legal_officer, accountant)
-- ============================================================================
CREATE TYPE resource_enum AS ENUM ('transactions', 'contracts', 'payments', 'properties', 'partners', 'staff');
CREATE TYPE permission_enum AS ENUM ('view', 'add', 'edit', 'delete');

CREATE TABLE role_permission (
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

CREATE INDEX idx_permission_position ON role_permission(position);
CREATE INDEX idx_permission_resource ON role_permission(resource);
CREATE INDEX idx_permission_position_resource ON role_permission(position, resource);

-- ============================================================================
-- Insert sample data
-- ============================================================================

-- Sample accounts (passwords hashed with bcrypt, rounds=10)
-- All passwords: "Password123"
INSERT INTO account (username, password, is_active) VALUES 
    ('admin', '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC', true),
    ('manager1', '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC', true),
    ('agent1', '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC', true),
    ('legal1', '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC', true),
    ('accountant1', '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC', true);

-- Sample staff
INSERT INTO staff (account_id, full_name, email, position, status) VALUES 
    (1, 'Admin User', 'admin@example.com', 'admin', 'working'),
    (2, 'Nguyễn Văn Manager', 'manager@example.com', 'manager', 'working'),
    (3, 'Trần Thị Agent', 'agent@example.com', 'agent', 'working'),
    (4, 'Lê Văn Legal', 'legal@example.com', 'legal_officer', 'working'),
    (5, 'Phạm Thị Accountant', 'accountant@example.com', 'accountant', 'working');

-- Sample terms
INSERT INTO term (name, content) VALUES 
    ('Thanh toán lần 1', 'Thanh toán 30% khi ký hợp đồng'),
    ('Thanh toán lần 2', 'Thanh toán 40% khi bàn giao'),
    ('Thanh toán lần 3', 'Thanh toán 30% sau 30 ngày bàn giao');

-- Sample catalog data
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
    ('contract_type', 'Lease agreement', 3);

-- Sample role permissions (default: agents have view-only on most resources)
INSERT INTO role_permission (position, resource, permission, is_granted) VALUES
    -- Agent permissions (view most things, full access to properties/partners)
    ('agent', 'transactions', 'view', true),
    ('agent', 'transactions', 'add', false),
    ('agent', 'contracts', 'view', true),
    ('agent', 'contracts', 'add', false),
    ('agent', 'payments', 'view', true),
    ('agent', 'properties', 'view', true),
    ('agent', 'properties', 'add', true),
    ('agent', 'properties', 'edit', true),
    ('agent', 'partners', 'view', true),
    ('agent', 'partners', 'add', true),
    ('agent', 'partners', 'edit', true),
    ('agent', 'staff', 'view', true),
    -- Legal officer permissions (contracts focused)
    ('legal_officer', 'transactions', 'view', true),
    ('legal_officer', 'contracts', 'view', true),
    ('legal_officer', 'contracts', 'add', true),
    ('legal_officer', 'contracts', 'edit', true),
    ('legal_officer', 'payments', 'view', true),
    ('legal_officer', 'properties', 'view', true),
    ('legal_officer', 'properties', 'edit', true),
    ('legal_officer', 'partners', 'view', true),
    ('legal_officer', 'staff', 'view', true),
    -- Accountant permissions (payments focused)
    ('accountant', 'transactions', 'view', true),
    ('accountant', 'contracts', 'view', true),
    ('accountant', 'payments', 'view', true),
    ('accountant', 'payments', 'add', true),
    ('accountant', 'payments', 'edit', true),
    ('accountant', 'properties', 'view', true),
    ('accountant', 'partners', 'view', true),
    ('accountant', 'staff', 'view', true),
    
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
    ('admin', 'staff', 'delete', true);

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE account IS 'Tài khoản đăng nhập hệ thống';
COMMENT ON TABLE staff IS 'Nhân viên (positions: admin, manager, agent, legal_officer, accountant)';
COMMENT ON TABLE client IS 'Khách hàng (buyer, seller, landlord, tenant)';
COMMENT ON TABLE real_estate IS 'Bất động sản';
COMMENT ON TABLE appointment IS 'Lịch hẹn xem nhà';
COMMENT ON TABLE transaction IS 'Giao dịch thương lượng';
COMMENT ON TABLE contract IS 'Hợp đồng';
COMMENT ON TABLE voucher IS 'Chứng từ thu chi';
COMMENT ON TABLE client_note IS 'Lịch sử liên hệ khách hàng (UC2.2)';
COMMENT ON TABLE audit_log IS 'Audit logs - ai đã làm gì lúc nào (UC9.3)';
COMMENT ON TABLE login_session IS 'Active login sessions with refresh tokens';
COMMENT ON TABLE system_config IS 'System-wide configuration with JSONB storage';
COMMENT ON TABLE config_catalog IS 'Configurable catalogs for property types, areas, sources, contract types';
COMMENT ON TABLE role_permission IS 'RBAC permission matrix for different staff positions';

COMMENT ON TYPE staff_position_enum IS 'Vị trí nhân viên: admin (system admin), manager (quản lý), agent (môi giới), legal_officer (pháp lý), accountant (kế toán)';
COMMENT ON TYPE client_type_enum IS 'Loại khách hàng: buyer (người mua), seller (người bán), landlord (chủ nhà cho thuê), tenant (người thuê)';
COMMENT ON TYPE transaction_type_enum IS 'Loại giao dịch BĐS: sale (bán), rent (cho thuê)';
COMMENT ON TYPE real_estate_status_enum IS 'Trạng thái BĐS: created, pending_legal_check, listed, negotiating, transacted, suspended';
COMMENT ON TYPE transaction_status_enum IS 'Trạng thái giao dịch: negotiating, pending_contract, cancelled';
COMMENT ON TYPE contract_status_enum IS 'Trạng thái hợp đồng: draft, pending_signature, signed, notarized, finalized, cancelled';
COMMENT ON TYPE action_type_enum IS 'Loại hành động trong audit log';
COMMENT ON TYPE contract_type_enum IS 'Loại hợp đồng: deposit (đặt cọc), purchase (mua bán), lease (thuê)';
COMMENT ON TYPE payment_method_enum IS 'Phương thức thanh toán: cash (tiền mặt), bank_transfer (chuyển khoản)';


-- ============================================================================
-- HWTHANG add: Lịch sử thay đổi trạng thái và giá của bất động sản
-- ============================================================================

-- Lưu lại **lịch sử thay đổi trạng thái** của bất động sản.
-- Mỗi khi status của real_estate được cập nhật (ví dụ: từ 'pending_legal_check' → 'listed'),
-- một record sẽ được thêm vào bảng này, ghi lại:
--   - real_estate_id: bất động sản nào
--   - old_status: trạng thái cũ trước khi thay đổi
--   - new_status: trạng thái mới
--   - reason: lý do thay đổi (nếu có)
--   - changed_by: nhân viên hoặc admin thực hiện thay đổi
--   - changed_at: thời điểm thay đổi
CREATE TABLE real_estate_status_history (
    id BIGSERIAL PRIMARY KEY,
    real_estate_id BIGINT NOT NULL REFERENCES real_estate(id) ON DELETE CASCADE,
    old_status real_estate_status_enum NOT NULL,
    new_status real_estate_status_enum NOT NULL,
    reason TEXT,
    changed_by BIGINT NOT NULL, -- staff_id hoặc admin_id
    changed_at TIMESTAMP DEFAULT now()
);

-- Lưu lại **lịch sử thay đổi giá** của bất động sản.
-- Mỗi khi giá của real_estate được cập nhật, một record được thêm vào bảng này:
--   - real_estate_id: bất động sản nào
--   - price: giá mới
--   - changed_at: thời điểm thay đổi
--   - changed_by: nhân viên thực hiện cập nhật
CREATE TABLE real_estate_price_history (
    id BIGSERIAL PRIMARY KEY,
    real_estate_id BIGINT NOT NULL REFERENCES real_estate(id) ON DELETE CASCADE,
    price NUMERIC(15,2) NOT NULL CHECK (price > 0),
    changed_at TIMESTAMP DEFAULT now(),
    changed_by BIGINT NOT NULL -- staff_id
);

-- Index giúp **tìm nhanh tất cả các record lịch sử giá** của một bất động sản cụ thể.
-- Khi gọi getPriceHistory(real_estate_id), PostgreSQL sẽ sử dụng index này để query
-- mà không cần quét toàn bộ bảng, tăng hiệu suất đáng kể khi bảng có nhiều hàng.
CREATE INDEX idx_price_history_real_estate 
    ON real_estate_price_history(real_estate_id);

ALTER TABLE contract
ADD COLUMN cancellation_reason TEXT;











-- ============================================================================
-- SAMPLE DATA FOR REPORT TESTING - ALL IN ONE
-- Real Estate Management System
-- 
-- File này sẽ:
-- 1. Truncate tất cả tables (trừ account, staff)
-- 2. Reset sequences
-- 3. Insert sample data
-- 
-- Đơn vị tiền: TRIỆU ĐỒNG (VD: 12500 = 12.5 tỷ VND)
-- ============================================================================

-- ============================================================================
-- STEP 1: TRUNCATE ALL TABLES (giữ lại account & staff)
-- ============================================================================
TRUNCATE 
    voucher,
    contract,
    transaction,
    appointment,
    client_note,
    audit_log,
    real_estate,
    client,
    file,
    term
CASCADE;

-- ============================================================================
-- STEP 2: RESET SEQUENCES
-- ============================================================================
ALTER SEQUENCE file_id_seq RESTART WITH 1;
ALTER SEQUENCE client_id_seq RESTART WITH 1;
ALTER SEQUENCE real_estate_id_seq RESTART WITH 1;
ALTER SEQUENCE appointment_id_seq RESTART WITH 1;
ALTER SEQUENCE transaction_id_seq RESTART WITH 1;
ALTER SEQUENCE contract_id_seq RESTART WITH 1;
ALTER SEQUENCE voucher_id_seq RESTART WITH 1;
ALTER SEQUENCE client_note_id_seq RESTART WITH 1;
ALTER SEQUENCE audit_log_id_seq RESTART WITH 1;
ALTER SEQUENCE term_id_seq RESTART WITH 1;

-- ============================================================================
-- STEP 3: INSERT SAMPLE DATA
-- ============================================================================

-- 3.1 TERMS (IDs: 1-8)
INSERT INTO term (name, content) VALUES 
    ('Thanh toán lần 1', 'Thanh toán 30% khi ký hợp đồng'),
    ('Thanh toán lần 2', 'Thanh toán 40% khi bàn giao'),
    ('Thanh toán lần 3', 'Thanh toán 30% sau 30 ngày bàn giao'),
    ('Điều khoản bảo hành', 'Bên bán bảo hành kết cấu trong 12 tháng kể từ ngày bàn giao'),
    ('Điều khoản phạt', 'Bên vi phạm phải chịu phạt 8% giá trị hợp đồng'),
    ('Điều khoản bàn giao', 'Bàn giao nhà trong vòng 30 ngày sau khi thanh toán đủ 70%'),
    ('Điều khoản thuê', 'Tiền thuê thanh toán vào ngày 01 hàng tháng'),
    ('Điều khoản gia hạn', 'Hợp đồng tự động gia hạn nếu không có thông báo trước 30 ngày');

-- 3.2 FILES (IDs: 1-10)
INSERT INTO file (url, name, type) VALUES 
    ('https://storage.example.com/images/house1_1.jpg', 'Mặt tiền nhà 1', 'image'),
    ('https://storage.example.com/images/house1_2.jpg', 'Phòng khách nhà 1', 'image'),
    ('https://storage.example.com/images/house2_1.jpg', 'Mặt tiền nhà 2', 'image'),
    ('https://storage.example.com/images/apt1_1.jpg', 'Căn hộ 1 view', 'image'),
    ('https://storage.example.com/images/land1_1.jpg', 'Đất nền 1', 'image'),
    ('https://storage.example.com/docs/sodo_001.pdf', 'Sổ đỏ BĐS 001', 'pdf'),
    ('https://storage.example.com/docs/sodo_002.pdf', 'Sổ đỏ BĐS 002', 'pdf'),
    ('https://storage.example.com/docs/sodo_003.pdf', 'Sổ đỏ BĐS 003', 'pdf'),
    ('https://storage.example.com/docs/hopdong_001.pdf', 'Hợp đồng 001', 'pdf'),
    ('https://storage.example.com/docs/hopdong_002.pdf', 'Hợp đồng 002', 'pdf');

-- 3.3 CLIENTS (IDs: 1-15)
-- Sellers/Landlords: 1-5 (owners)
-- Buyers/Tenants: 6-15
INSERT INTO client (full_name, email, phone_number, address, type, referral_src, requirement, staff_id) VALUES 
    ('Nguyễn Văn An', 'an.nguyen@gmail.com', '0901234567', '123 Nguyễn Huệ, Q1, HCM', 'seller', 'Website', 'Bán nhà phố Q1', 2),
    ('Trần Thị Bình', 'binh.tran@gmail.com', '0912345678', '456 Lê Lợi, Q3, HCM', 'landlord', 'Giới thiệu', 'Cho thuê căn hộ cao cấp', 2),
    ('Lê Văn Cường', 'cuong.le@gmail.com', '0923456789', '789 Võ Văn Tần, Q3, HCM', 'seller', 'Facebook', 'Bán đất nền Thủ Đức', 2),
    ('Phạm Thị Dung', 'dung.pham@gmail.com', '0934567890', '321 Cách Mạng Tháng 8, Q10, HCM', 'seller', 'Zalo', 'Bán biệt thự Q2', 2),
    ('Hoàng Văn Em', 'em.hoang@gmail.com', '0945678901', '654 Điện Biên Phủ, Q3, HCM', 'landlord', 'Website', 'Cho thuê mặt bằng kinh doanh', 2),
    ('Võ Thị Phương', 'phuong.vo@gmail.com', '0956789012', '987 Trần Hưng Đạo, Q5, HCM', 'buyer', 'Google Ads', 'Mua nhà Q1-Q3, ngân sách 8-12 tỷ', 2),
    ('Đặng Văn Giang', 'giang.dang@gmail.com', '0967890123', '147 Hai Bà Trưng, Q1, HCM', 'tenant', 'Giới thiệu', 'Thuê căn hộ 2PN, Q2-Q7', 2),
    ('Bùi Thị Hoa', 'hoa.bui@gmail.com', '0978901234', '258 Pasteur, Q3, HCM', 'buyer', 'Website', 'Mua đất nền đầu tư', 2),
    ('Ngô Văn Khải', 'khai.ngo@gmail.com', '0989012345', '369 Nam Kỳ Khởi Nghĩa, Q3, HCM', 'buyer', 'Facebook', 'Mua biệt thự cho gia đình', 2),
    ('Lý Thị Lan', 'lan.ly@gmail.com', '0990123456', '741 Nguyễn Đình Chiểu, Q3, HCM', 'tenant', 'Zalo', 'Thuê văn phòng 100-200m2', 2),
    ('Trịnh Văn Minh', 'minh.trinh@gmail.com', '0901111111', '111 Lý Tự Trọng, Q1, HCM', 'buyer', 'Website', 'Mua căn hộ Q7', 2),
    ('Đinh Thị Ngọc', 'ngoc.dinh@gmail.com', '0902222222', '222 Lê Duẩn, Q1, HCM', 'seller', 'Giới thiệu', 'Bán shophouse Q9', 2),
    ('Mai Văn Phúc', 'phuc.mai@gmail.com', '0903333333', '333 Tôn Đức Thắng, Q1, HCM', 'buyer', 'Google Ads', 'Mua nhà phố Q2', 2),
    ('Chu Thị Quỳnh', 'quynh.chu@gmail.com', '0904444444', '444 Nguyễn Thị Minh Khai, Q3, HCM', 'tenant', 'Facebook', 'Thuê kho xưởng', 2),
    ('Vương Văn Sơn', 'son.vuong@gmail.com', '0905555555', '555 Võ Thị Sáu, Q3, HCM', 'buyer', 'Website', 'Mua đất Q9', 2);

-- 3.4 REAL ESTATE (IDs: 1-13)
INSERT INTO real_estate (title, type, transaction_type, location, price, area, description, direction, media_files, owner_id, legal_docs, staff_id, status) VALUES 
    ('Nhà phố Nguyễn Huệ Q1', 'Nhà phố', 'sale', '123 Nguyễn Huệ, Quận 1, HCM', 12500, 120.5, 'Nhà 4 tầng, mặt tiền 5m, sổ hồng chính chủ', 'south', ARRAY[1,2], 1, ARRAY[6], 2, 'transacted'),
    ('Căn hộ Vinhomes Central Park', 'Căn hộ', 'rent', '208 Nguyễn Hữu Cảnh, Bình Thạnh, HCM', 25, 85.0, 'Căn 2PN, full nội thất, view sông', 'east', ARRAY[4], 2, ARRAY[7], 2, 'transacted'),
    ('Đất nền Thủ Đức', 'Đất nền', 'sale', 'KDC Bình Chiểu, Thủ Đức, HCM', 3500, 200.0, 'Đất thổ cư 100%, đường 12m', 'north', ARRAY[5], 3, ARRAY[8], 2, 'negotiating'),
    ('Biệt thự Thảo Điền Q2', 'Biệt thự', 'sale', '15 Nguyễn Văn Hưởng, Q2, HCM', 45000, 500.0, 'Biệt thự compound, hồ bơi riêng, 5PN', 'southeast', ARRAY[1,2,3], 4, ARRAY[6,7], 2, 'negotiating'),
    ('Mặt bằng kinh doanh Q3', 'Mặt bằng', 'rent', '100 Võ Văn Tần, Q3, HCM', 80, 150.0, 'Mặt tiền 8m, phù hợp showroom, nhà hàng', 'west', ARRAY[3,4], 5, ARRAY[8], 2, 'listed'),
    ('Căn hộ Masteri Thảo Điền', 'Căn hộ', 'sale', 'Xa lộ Hà Nội, Q2, HCM', 5200, 70.0, 'Căn 2PN, tầng cao, view city', 'northeast', ARRAY[4], 2, ARRAY[7], 2, 'listed'),
    ('Nhà phố Phú Mỹ Hưng Q7', 'Nhà phố', 'sale', 'Khu Cảnh Đồi, PMH, Q7, HCM', 18000, 180.0, 'Nhà 3 tầng, nội thất cao cấp, gara ô tô', 'south', ARRAY[1,2], 1, ARRAY[6], 2, 'listed'),
    ('Đất nền Long An', 'Đất nền', 'sale', 'KCN Đức Hòa, Long An', 1800, 300.0, 'Đất công nghiệp, đã san lấp', 'north', ARRAY[5], 3, ARRAY[8], 2, 'listed'),
    ('Căn hộ Sunrise City Q7', 'Căn hộ', 'rent', '23-25 Nguyễn Hữu Thọ, Q7, HCM', 18, 65.0, 'Căn 1PN+1, full nội thất', 'west', ARRAY[4], 2, NULL, 2, 'pending_legal_check'),
    ('Nhà phố Gò Vấp', 'Nhà phố', 'sale', '55 Nguyễn Oanh, Gò Vấp, HCM', 6500, 90.0, 'Nhà 3 tầng, hẻm xe hơi', 'east', ARRAY[1,2], 12, NULL, 2, 'pending_legal_check'),
    ('Shophouse Q9', 'Shophouse', 'sale', 'Vinhomes Grand Park, Q9, HCM', 8500, 120.0, 'Shophouse mặt tiền, kinh doanh tốt', 'south', ARRAY[3], 12, NULL, 2, 'created'),
    ('Căn hộ Empire City', 'Căn hộ', 'sale', 'Empire City, Q2, HCM', 9800, 95.0, 'Căn 3PN, tầng penthouse', 'northeast', ARRAY[4], 4, NULL, 2, 'created'),
    ('Đất nền Củ Chi', 'Đất nền', 'sale', 'Xã Tân Phú Trung, Củ Chi, HCM', 2200, 500.0, 'Đất vườn, đang chờ lên thổ', 'north', ARRAY[5], 3, NULL, 2, 'suspended');

-- 3.5 APPOINTMENTS (IDs: 1-12)
INSERT INTO appointment (real_estate_id, client_id, staff_id, start_time, end_time, location, status, note) VALUES 
    (1, 6, 2, '2025-12-15 09:00:00', '2025-12-15 10:00:00', '123 Nguyễn Huệ, Q1', 'completed', 'Khách rất thích, muốn thương lượng giá'),
    (1, 9, 2, '2025-12-16 14:00:00', '2025-12-16 15:00:00', '123 Nguyễn Huệ, Q1', 'completed', 'Khách cần suy nghĩ thêm'),
    (2, 7, 2, '2025-12-18 10:00:00', '2025-12-18 11:00:00', '208 Nguyễn Hữu Cảnh, BT', 'completed', 'Khách đồng ý thuê'),
    (3, 8, 2, '2025-12-20 09:00:00', '2025-12-20 10:30:00', 'KDC Bình Chiểu, TĐ', 'completed', 'Khách quan tâm, đang xem thêm'),
    (4, 9, 2, '2025-12-22 15:00:00', '2025-12-22 17:00:00', '15 Nguyễn Văn Hưởng, Q2', 'completed', 'Khách rất thích, đang thương lượng'),
    (5, 10, 2, '2026-01-17 09:00:00', '2026-01-17 10:00:00', '100 Võ Văn Tần, Q3', 'confirmed', 'Khách muốn thuê làm văn phòng'),
    (6, 11, 2, '2026-01-17 14:00:00', '2026-01-17 15:00:00', 'Masteri Thảo Điền, Q2', 'confirmed', 'Khách mua đầu tư'),
    (7, 13, 2, '2026-01-18 10:00:00', '2026-01-18 11:30:00', 'PMH, Q7', 'confirmed', 'Gia đình 4 người'),
    (8, 15, 2, '2026-01-20 09:00:00', '2026-01-20 10:00:00', 'KCN Đức Hòa, Long An', 'created', 'Khách mua để xây xưởng'),
    (5, 14, 2, '2026-01-21 15:00:00', '2026-01-21 16:00:00', '100 Võ Văn Tần, Q3', 'created', 'Khách thuê làm kho'),
    (6, 8, 2, '2025-12-25 09:00:00', '2025-12-25 10:00:00', 'Masteri Thảo Điền, Q2', 'cancelled', 'Khách bận việc đột xuất'),
    (3, 11, 2, '2025-12-28 14:00:00', '2025-12-28 15:00:00', 'KDC Bình Chiểu, TĐ', 'cancelled', 'Khách đã mua BĐS khác');

-- 3.6 TRANSACTIONS (IDs: 1-7)
INSERT INTO transaction (real_estate_id, client_id, staff_id, offer_price, terms, status, cancellation_reason) VALUES 
    (1, 6, 2, 12000, ARRAY[1,2,3], 'pending_contract', NULL),
    (2, 7, 2, 24, ARRAY[1], 'pending_contract', NULL),
    (3, 8, 2, 3200, ARRAY[1,2], 'negotiating', NULL),
    (4, 9, 2, 43000, ARRAY[1,2,3], 'negotiating', NULL),
    (6, 11, 2, 5000, ARRAY[1,2], 'negotiating', NULL),
    (7, 13, 2, 16500, ARRAY[1,2,3], 'cancelled', 'Khách không đủ tài chính'),
    (8, 15, 2, 1600, NULL, 'cancelled', 'Khách thay đổi kế hoạch');

-- 3.7 CONTRACTS (IDs: 1-5)
INSERT INTO contract (transaction_id, type, party_a, party_b, total_value, deposit_amount, payment_terms, paid_amount, remaining_amount, signed_date, effective_date, expiration_date, attachments, status, staff_id) VALUES 
    (1, 'purchase', 1, 6, 12000, 1200, ARRAY[1,2,3], 12000, 0, '2025-12-20', '2025-12-20', NULL, ARRAY[9], 'finalized', 3),
    (2, 'lease', 2, 7, 288, 48, ARRAY[1], 96, 192, '2025-12-22', '2026-01-01', '2026-12-31', ARRAY[10], 'signed', 3),
    (3, 'deposit', 3, 8, 350, 350, NULL, 0, 350, NULL, '2026-01-20', '2026-02-20', NULL, 'pending_signature', 3),
    (4, 'deposit', 4, 9, 4500, 4500, NULL, 0, 4500, NULL, '2026-01-25', '2026-02-25', NULL, 'draft', 3),
    (5, 'purchase', 2, 11, 5000, 500, ARRAY[1,2], 500, 4500, '2026-01-10', '2026-01-10', NULL, ARRAY[9,10], 'notarized', 3);

-- 3.8 VOUCHERS (IDs: 1-9)
INSERT INTO voucher (contract_id, type, party, payment_time, amount, payment_method, payment_description, attachments, staff_id, status) VALUES 
    (1, 'receipt', 'Võ Thị Phương', '2025-12-20 10:00:00', 3600, 'bank_transfer', 'Thanh toán đợt 1 - 30%', ARRAY[9], 4, 'confirmed'),
    (1, 'receipt', 'Võ Thị Phương', '2025-12-28 14:00:00', 4800, 'bank_transfer', 'Thanh toán đợt 2 - 40%', ARRAY[9], 4, 'confirmed'),
    (1, 'receipt', 'Võ Thị Phương', '2026-01-05 09:00:00', 3600, 'bank_transfer', 'Thanh toán đợt 3 - 30%', ARRAY[9], 4, 'confirmed'),
    (2, 'receipt', 'Đặng Văn Giang', '2025-12-22 11:00:00', 48, 'bank_transfer', 'Tiền cọc 2 tháng', ARRAY[10], 4, 'confirmed'),
    (2, 'receipt', 'Đặng Văn Giang', '2026-01-01 09:00:00', 24, 'bank_transfer', 'Tiền thuê tháng 1/2026', ARRAY[10], 4, 'confirmed'),
    (2, 'receipt', 'Đặng Văn Giang', '2026-01-01 09:05:00', 24, 'cash', 'Tiền thuê tháng 2/2026 (trả trước)', NULL, 4, 'confirmed'),
    (5, 'receipt', 'Trịnh Văn Minh', '2026-01-10 15:00:00', 500, 'bank_transfer', 'Tiền cọc 10%', ARRAY[9], 4, 'confirmed'),
    (3, 'receipt', 'Bùi Thị Hoa', '2026-01-15 10:00:00', 350, 'bank_transfer', 'Tiền đặt cọc', NULL, 4, 'created'),
    (1, 'payment', 'Công ty ABC', '2026-01-06 16:00:00', 120, 'bank_transfer', 'Phí môi giới 1%', NULL, 4, 'confirmed');

-- 3.9 CLIENT NOTES
INSERT INTO client_note (client_id, staff_id, content, created_at) VALUES 
    (6, 2, 'Gọi điện tư vấn về nhà phố Q1, khách quan tâm đến vị trí và pháp lý', '2025-12-10 09:30:00'),
    (6, 2, 'Đã đưa khách đi xem nhà, khách rất hài lòng với thiết kế', '2025-12-15 11:00:00'),
    (6, 2, 'Thương lượng giá thành công, khách đồng ý 12 tỷ', '2025-12-18 14:00:00'),
    (6, 3, 'Hướng dẫn khách chuẩn bị giấy tờ ký hợp đồng', '2025-12-19 10:00:00'),
    (7, 2, 'Khách tìm căn hộ thuê gấp, cần view sông', '2025-12-14 08:00:00'),
    (7, 2, 'Đã show căn hộ Vinhomes, khách rất thích', '2025-12-18 12:00:00'),
    (7, 2, 'Ký hợp đồng thuê 1 năm, bắt đầu từ 1/1/2026', '2025-12-22 15:00:00'),
    (8, 2, 'Khách quan tâm đất nền đầu tư, ngân sách 3-4 tỷ', '2025-12-15 10:00:00'),
    (8, 2, 'Đưa khách xem đất Thủ Đức, khách đang cân nhắc', '2025-12-20 11:00:00'),
    (8, 2, 'Khách đã chốt, chuẩn bị đặt cọc', '2026-01-10 09:00:00'),
    (9, 2, 'Khách VIP, tìm biệt thự cao cấp Q2', '2025-12-18 09:00:00'),
    (9, 2, 'Xem biệt thự Thảo Điền, khách rất thích compound', '2025-12-22 17:30:00'),
    (9, 2, 'Đang thương lượng giá, khách offer 43 tỷ', '2025-12-28 10:00:00'),
    (10, 2, 'Khách công ty, cần thuê văn phòng hoặc mặt bằng', '2026-01-05 14:00:00'),
    (10, 2, 'Đã giới thiệu mặt bằng Q3, khách sẽ xem tuần sau', '2026-01-10 16:00:00');

-- 3.10 AUDIT LOGS
INSERT INTO audit_log (actor_id, action_type, target_type, target_id, details, ip_address, created_at) VALUES 
    (2, 'create', 'real_estate', 1, '{"title": "Nhà phố Nguyễn Huệ Q1", "price": 12500}', '192.168.1.100', '2025-12-01 09:00:00'),
    (2, 'create', 'real_estate', 2, '{"title": "Căn hộ Vinhomes Central Park", "price": 25}', '192.168.1.100', '2025-12-02 10:00:00'),
    (2, 'create', 'client', 6, '{"name": "Võ Thị Phương", "type": "buyer"}', '192.168.1.100', '2025-12-05 11:00:00'),
    (3, 'approve', 'real_estate', 1, '{"status_from": "pending_legal_check", "status_to": "listed"}', '192.168.1.101', '2025-12-08 14:00:00'),
    (2, 'create', 'appointment', 1, '{"real_estate_id": 1, "client_id": 6}', '192.168.1.100', '2025-12-10 09:00:00'),
    (2, 'status_change', 'appointment', 1, '{"from": "created", "to": "confirmed"}', '192.168.1.100', '2025-12-12 10:00:00'),
    (2, 'status_change', 'appointment', 1, '{"from": "confirmed", "to": "completed"}', '192.168.1.100', '2025-12-15 10:30:00'),
    (2, 'create', 'transaction', 1, '{"real_estate_id": 1, "client_id": 6, "offer_price": 12000}', '192.168.1.100', '2025-12-16 11:00:00'),
    (2, 'status_change', 'real_estate', 1, '{"from": "listed", "to": "negotiating"}', '192.168.1.100', '2025-12-16 11:05:00'),
    (2, 'status_change', 'transaction', 1, '{"from": "negotiating", "to": "pending_contract"}', '192.168.1.100', '2025-12-18 15:00:00'),
    (3, 'create', 'contract', 1, '{"transaction_id": 1, "type": "purchase", "total_value": 12000}', '192.168.1.101', '2025-12-19 09:00:00'),
    (3, 'status_change', 'contract', 1, '{"from": "draft", "to": "pending_signature"}', '192.168.1.101', '2025-12-19 14:00:00'),
    (3, 'status_change', 'contract', 1, '{"from": "pending_signature", "to": "signed"}', '192.168.1.101', '2025-12-20 10:30:00'),
    (4, 'create', 'voucher', 1, '{"contract_id": 1, "amount": 3600, "type": "receipt"}', '192.168.1.102', '2025-12-20 11:00:00'),
    (3, 'status_change', 'contract', 1, '{"from": "signed", "to": "notarized"}', '192.168.1.101', '2025-12-23 09:00:00'),
    (4, 'create', 'voucher', 2, '{"contract_id": 1, "amount": 4800, "type": "receipt"}', '192.168.1.102', '2025-12-28 14:30:00'),
    (4, 'create', 'voucher', 3, '{"contract_id": 1, "amount": 3600, "type": "receipt"}', '192.168.1.102', '2026-01-05 09:30:00'),
    (3, 'status_change', 'contract', 1, '{"from": "notarized", "to": "finalized"}', '192.168.1.101', '2026-01-05 10:00:00'),
    (2, 'status_change', 'real_estate', 1, '{"from": "negotiating", "to": "transacted"}', '192.168.1.100', '2026-01-05 10:05:00'),
    (1, 'export', 'report', NULL, '{"report_type": "monthly_sales", "period": "2025-12"}', '192.168.1.99', '2026-01-06 08:00:00'),
    (2, 'create', 'real_estate', 11, '{"title": "Shophouse Q9", "price": 8500}', '192.168.1.100', '2026-01-08 09:00:00'),
    (2, 'create', 'appointment', 6, '{"real_estate_id": 5, "client_id": 10}', '192.168.1.100', '2026-01-10 10:00:00'),
    (3, 'create', 'contract', 5, '{"transaction_id": 5, "type": "purchase", "total_value": 5000}', '192.168.1.101', '2026-01-10 14:00:00'),
    (4, 'create', 'voucher', 7, '{"contract_id": 5, "amount": 500, "type": "receipt"}', '192.168.1.102', '2026-01-10 15:30:00'),
    (2, 'login', 'account', 2, '{"ip": "192.168.1.100"}', '192.168.1.100', '2026-01-15 08:00:00'),
    (1, 'login', 'account', 1, '{"ip": "192.168.1.99"}', '192.168.1.99', '2026-01-15 08:30:00');

-- ============================================================================
-- VERIFY DATA
-- ============================================================================
SELECT 'terms' as tbl, count(*) FROM term
UNION ALL SELECT 'files', count(*) FROM file
UNION ALL SELECT 'clients', count(*) FROM client
UNION ALL SELECT 'real_estate', count(*) FROM real_estate
UNION ALL SELECT 'appointments', count(*) FROM appointment
UNION ALL SELECT 'transactions', count(*) FROM transaction
UNION ALL SELECT 'contracts', count(*) FROM contract
UNION ALL SELECT 'vouchers', count(*) FROM voucher
UNION ALL SELECT 'client_notes', count(*) FROM client_note
UNION ALL SELECT 'audit_logs', count(*) FROM audit_log;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Terms: 8
-- Files: 10
-- Clients: 15 (sellers 1-5, buyers/tenants 6-15)
-- Real Estate: 13 (đủ các trạng thái)
-- Appointments: 12
-- Transactions: 7
-- Contracts: 5
-- Vouchers: 9
-- Client Notes: 15
-- Audit Logs: 26
--
-- ĐƠN VỊ TIỀN: TRIỆU ĐỒNG (12500 = 12.5 tỷ VND)
-- ============================================================================







