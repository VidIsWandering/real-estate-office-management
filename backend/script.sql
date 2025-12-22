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
-- Positions per context_design.md: AGENT, LEGAL_OFFICER, ACCOUNTANT, MANAGER
CREATE TYPE staff_position_enum AS ENUM ('agent', 'legal_officer', 'accountant', 'manager');
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
-- Insert sample data
-- ============================================================================

-- Sample accounts (passwords hashed with bcrypt, rounds=10)
-- All passwords: "password123"
INSERT INTO account (username, password, is_active) VALUES 
    ('manager1', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQlTBSM0QKS9RGkXfPe0HhI0xVQy', true),
    ('agent1', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQlTBSM0QKS9RGkXfPe0HhI0xVQy', true),
    ('legal1', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQlTBSM0QKS9RGkXfPe0HhI0xVQy', true),
    ('accountant1', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQlTBSM0QKS9RGkXfPe0HhI0xVQy', true);

-- Sample staff (positions per context_design.md)
INSERT INTO staff (account_id, full_name, email, position, status) VALUES 
    (1, 'Nguyễn Văn Manager', 'manager@example.com', 'manager', 'working'),
    (2, 'Trần Thị Agent', 'agent@example.com', 'agent', 'working'),
    (3, 'Lê Văn Legal', 'legal@example.com', 'legal_officer', 'working'),
    (4, 'Phạm Thị Accountant', 'accountant@example.com', 'accountant', 'working');

-- Sample terms
INSERT INTO term (name, content) VALUES 
    ('Thanh toán lần 1', 'Thanh toán 30% khi ký hợp đồng'),
    ('Thanh toán lần 2', 'Thanh toán 40% khi bàn giao'),
    ('Thanh toán lần 3', 'Thanh toán 30% sau 30 ngày bàn giao');

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE account IS 'Tài khoản đăng nhập hệ thống';
COMMENT ON TABLE staff IS 'Nhân viên (positions: manager, agent, legal_officer, accountant)';
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