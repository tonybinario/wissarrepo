-- Fake-Testdaten für die User-Tabelle
INSERT INTO users (email, password, first_name, last_name, phone, address, city, postal_code, role, status)
VALUES
    ('admin@wissar.de', '$2b$10$fake_hash_admin_1234567890', 'Admin', 'Benutzer', '+49 123 456789', 'Adminstraße 1', 'Berlin', '10115', 'admin', 'active'),
    ('max.mustermann@example.com', '$2b$10$fake_hash_user1_1234567890', 'Max', 'Mustermann', '+49 234 567890', 'Hauptstraße 42', 'München', '80801', 'user', 'active'),
    ('anna.schmidt@example.com', '$2b$10$fake_hash_user2_1234567890', 'Anna', 'Schmidt', '+49 345 678901', 'Königstraße 100', 'Hamburg', '20099', 'user', 'active'),
    ('peter.wagner@example.com', '$2b$10$fake_hash_user3_1234567890', 'Peter', 'Wagner', '+49 456 789012', 'Marktplatz 15', 'Köln', '50667', 'user', 'inactive'),
    ('julia.becker@example.com', '$2b$10$fake_hash_user4_1234567890', 'Julia', 'Becker', '+49 567 890123', 'Friedrichstraße 30', 'Frankfurt', '60311', 'user', 'active'),
    ('test@test.de', '$2b$10$fake_hash_test_1234567890', 'Test', 'User', '+49 999 888777', 'Teststraße 99', 'Stuttgart', '70173', 'user', 'active')
ON CONFLICT (email) DO NOTHING;
