-- ============================================================
-- SASKAITA.LT - Database Initialization
-- ============================================================
-- Šis failas automatiškai paleidžiamas kai kuriama duomenų bazė
-- ============================================================

-- Enable UUID extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin user (will be updated by application on first run)
-- Password: admin123 (bcrypt hash)
INSERT INTO users (email, hashed_password, full_name, is_active, is_verified, is_admin, subscription_plan, invoices_this_month, created_at, updated_at, invoices_reset_date)
VALUES (
    'admin@saskaita.lt',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G4RkqQDX9q/7Oy',
    'Administratorius',
    true,
    true,
    true,
    'business',
    0,
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- DEMO DATA (optional, for testing)
-- Uncomment if you want demo data
-- ============================================================

/*
-- Demo company
INSERT INTO companies (user_id, name, code, vat_code, address, city, postal_code, email, phone, bank_name, bank_account, invoice_prefix, next_invoice_number, created_at, updated_at)
SELECT
    id,
    'Demo Įmonė UAB',
    '123456789',
    'LT123456789',
    'Demo gatvė 1',
    'Vilnius',
    'LT-01234',
    'demo@demo.lt',
    '+370 600 00000',
    'Swedbank',
    'LT12 3456 7890 1234 5678',
    'SF',
    1,
    NOW(),
    NOW()
FROM users WHERE email = 'admin@saskaita.lt'
ON CONFLICT DO NOTHING;

-- Demo client
INSERT INTO clients (company_id, name, code, vat_code, address, city, postal_code, email, phone, created_at, updated_at)
SELECT
    c.id,
    'Klientas UAB',
    '987654321',
    'LT987654321',
    'Kliento gatvė 2',
    'Kaunas',
    'LT-44444',
    'klientas@demo.lt',
    '+370 611 11111',
    NOW(),
    NOW()
FROM companies c
JOIN users u ON c.user_id = u.id
WHERE u.email = 'admin@saskaita.lt'
ON CONFLICT DO NOTHING;
*/
