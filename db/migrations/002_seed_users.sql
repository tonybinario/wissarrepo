-- 1. Datenbank steril machen und IDs zurücksetzen
TRUNCATE users, households, buildings RESTART IDENTITY CASCADE;

-- 2. 100 Gebäude generieren (IDs 1 bis 100)
INSERT INTO buildings (address, city, postal_code, country, status)
SELECT
    'Campus Allee ' || g,
    CASE WHEN g % 2 = 0 THEN 'Berlin' ELSE 'Muenchen' END,
    CASE WHEN g % 2 = 0 THEN '10115' ELSE '80801' END,
    'Germany',
    'active'
FROM generate_series(1, 100) AS g;

-- 3. 10.000 HAUSHALTE GENERIEREN (100 pro Gebäude)
-- Haushalt 1 bis 100 zieht in Gebäude 1, 101 bis 200 in Gebäude 2, usw.
INSERT INTO households (building_id, room_number, floor, max_residents, status)
SELECT
    ((h - 1) / 100) + 1,
    'Apt ' || (((h - 1) % 100) + 101),
    ((h - 1) % 5) + 1, -- Etagen 1 bis 5
    1, -- Max. 1 Bewohner wegen deiner Vorgabe
    'active'
FROM generate_series(1, 10000) AS h;

-- 4. 10.000 BENUTZER GENERIEREN (Exakt 1 User pro Haushalt)
-- Hier koppeln wir die IDs jetzt absolut synchron: User 1 kriegt Haushalt 1, User 2 kriegt Haushalt 2...
INSERT INTO users (
    household_id, email, password, first_name, last_name,
    phone, address, city, postal_code, role, status
)
SELECT
    u, -- KRITISCH: 1:1 Kopplung! id des Users matched exakt mit der household_id
    'user.' || u || '@wissar-experiment.edu',
    '$2b$10$fake_hash_benchmarking_1234567890',
    'First_' || u,
    'Last_' || u,
    '+49 ' || (100000 + u),
    'Dynamic Address ' || u,
    CASE WHEN (((u - 1) / 100) + 1) % 2 = 0 THEN 'Berlin' ELSE 'München' END,
    CASE WHEN (((u - 1) / 100) + 1) % 2 = 0 THEN '10115' ELSE '80801' END,
    'user',
    'active'
FROM generate_series(1, 10000) AS u;

-- Sichern
COMMIT;