-- RioWorkspace Database Initialization Script
-- Creates initial database structure and default data

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff', 'client');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create initial admin user (password: admin123)
-- This will be handled by Django's user creation, but keeping for reference
-- INSERT INTO auth_user (username, email, password, is_superuser, is_staff, is_active, date_joined)
-- VALUES ('admin', 'admin@rioworkspace.com', 'pbkdf2_sha256$600000$...', true, true, true, NOW());

-- Create initial business settings
-- This will be handled by Django migrations

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance
-- These will be created by Django migrations, but keeping for reference
-- CREATE INDEX IF NOT EXISTS idx_clients_email ON clients_client(email);
-- CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments_appointment(appointment_date);
-- CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices_invoice(status);
