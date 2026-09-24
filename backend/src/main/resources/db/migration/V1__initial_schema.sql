CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(40) NOT NULL,
  PRIMARY KEY (user_id, role)
);

CREATE TABLE loans (
  id BIGSERIAL PRIMARY KEY,
  version BIGINT NOT NULL DEFAULT 0,
  request_id UUID NOT NULL UNIQUE,
  borrower_email VARCHAR(254) NOT NULL,
  borrower_name VARCHAR(120) NOT NULL,
  amount_eur NUMERIC(19,2) NOT NULL CHECK (amount_eur > 0),
  collateral_symbol VARCHAR(40) NOT NULL,
  collateral_amount NUMERIC(30,10) NOT NULL CHECK (collateral_amount > 0),
  minimum_ratio NUMERIC(10,4) NOT NULL CHECK (minimum_ratio >= 1),
  status VARCHAR(20) NOT NULL,
  warning_sent BOOLEAN NOT NULL DEFAULT FALSE,
  last_observed_ratio NUMERIC(12,6),
  created_at TIMESTAMPTZ NOT NULL,
  approved_at TIMESTAMPTZ,
  liquidated_at TIMESTAMPTZ,
  contract_hash VARCHAR(64)
);
CREATE INDEX idx_loans_borrower ON loans(borrower_email, created_at DESC);
CREATE INDEX idx_loans_status ON loans(status);

CREATE TABLE contract_proofs (
  loan_id BIGINT PRIMARY KEY REFERENCES loans(id) ON DELETE RESTRICT,
  borrower_email VARCHAR(254) NOT NULL,
  contract_hash VARCHAR(64) NOT NULL,
  user_tx_hash VARCHAR(80),
  admin_tx_hash VARCHAR(80),
  document_reference VARCHAR(255) NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  recipient VARCHAR(254) NOT NULL,
  type VARCHAR(60) NOT NULL,
  subject VARCHAR(180) NOT NULL,
  message VARCHAR(2000) NOT NULL,
  loan_id BIGINT REFERENCES loans(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL,
  error VARCHAR(300),
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_notifications_recipient ON notifications(recipient, created_at DESC);

CREATE TABLE audit_events (
  id BIGSERIAL PRIMARY KEY,
  actor VARCHAR(254) NOT NULL,
  action VARCHAR(80) NOT NULL,
  resource VARCHAR(120) NOT NULL,
  details VARCHAR(2000) NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_audit_time ON audit_events(occurred_at DESC);

