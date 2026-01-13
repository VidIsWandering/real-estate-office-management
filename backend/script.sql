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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_account_username ON account(username);
CREATE INDEX idx_account_active ON account(is_active);

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
-- All passwords: "password123"
INSERT INTO account (username, password, is_active) VALUES 
    ('admin', '$2a$10$FfyY6fa1UHD8su5OEDOxc.cEHwbyjM4yN1wUizLL4NK2zLFSdxSOa', true),
    ('manager1', '$2a$10$FfyY6fa1UHD8su5OEDOxc.cEHwbyjM4yN1wUizLL4NK2zLFSdxSOa', true),
    ('agent1', '$2a$10$FfyY6fa1UHD8su5OEDOxc.cEHwbyjM4yN1wUizLL4NK2zLFSdxSOa', true),
    ('legal1', '$2a$10$FfyY6fa1UHD8su5OEDOxc.cEHwbyjM4yN1wUizLL4NK2zLFSdxSOa', true),
    ('accountant1', '$2a$10$FfyY6fa1UHD8su5OEDOxc.cEHwbyjM4yN1wUizLL4NK2zLFSdxSOa', true);

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
    ('accountant', 'staff', 'view', true);

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

COMMENT ON TYPE staff_position_enum IS 'Vị trí nhân viên: manager (quản lý), agent (môi giới), legal_officer (pháp lý), accountant (kế toán)';
COMMENT ON TYPE client_type_enum IS 'Loại khách hàng: buyer (người mua), seller (người bán), landlord (chủ nhà cho thuê), tenant (người thuê)';
COMMENT ON TYPE transaction_type_enum IS 'Loại giao dịch BĐS: sale (bán), rent (cho thuê)';
COMMENT ON TYPE real_estate_status_enum IS 'Trạng thái BĐS: created, pending_legal_check, listed, negotiating, transacted, suspended';
COMMENT ON TYPE transaction_status_enum IS 'Trạng thái giao dịch: negotiating, pending_contract, cancelled';
COMMENT ON TYPE contract_status_enum IS 'Trạng thái hợp đồng: draft, pending_signature, signed, notarized, finalized, cancelled';
COMMENT ON TYPE action_type_enum IS 'Loại hành động trong audit log';
COMMENT ON TYPE contract_type_enum IS 'Loại hợp đồng: deposit (đặt cọc), purchase (mua bán), lease (thuê)';
COMMENT ON TYPE payment_method_enum IS 'Phương thức thanh toán: cash (tiền mặt), bank_transfer (chuyển khoản)';