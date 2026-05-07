-- ============================================
-- Relsoft Notify — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  industry    text,
  phone       text,
  address     text,
  notes       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name          text NOT NULL,
  description   text,
  category      text,
  expiry_date   date NOT NULL,
  status        text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'renewed')),
  notify_days   integer[] DEFAULT '{30,14,7,1}',
  notes         text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- 3. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  role        text,
  is_primary  boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- 4. NOTIFICATION LOGS TABLE
CREATE TABLE IF NOT EXISTS notification_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id    uuid REFERENCES services(id) ON DELETE CASCADE,
  contact_id    uuid REFERENCES contacts(id) ON DELETE SET NULL,
  days_before   integer,
  channel       text DEFAULT 'email',
  status        text CHECK (status IN ('sent', 'failed')),
  sent_at       timestamptz DEFAULT now(),
  error_message text
);

-- 5. SETTINGS TABLE (for runtime configuration)
CREATE TABLE IF NOT EXISTS settings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key             text UNIQUE NOT NULL,
  value           text NOT NULL,
  description     text,
  updated_at      timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_services_company_id ON services(company_id);
CREATE INDEX IF NOT EXISTS idx_services_expiry_date ON services(expiry_date);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_service_id ON notification_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_sent_at ON notification_logs(sent_at);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (key, value, description) VALUES
  ('notification_days', '30,14,7,1', 'Default days before expiry to send notifications'),
  ('admin_email', '', 'Admin email address for system notifications'),
  ('sendgrid_from_email', 'notify@relsoft.com', 'SendGrid sender email address')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- DISABLE RLS (Admin-only application)
-- ============================================
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
