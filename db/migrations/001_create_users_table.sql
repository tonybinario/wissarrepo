CREATE TABLE IF NOT EXISTS buildings
(
    id          SERIAL PRIMARY KEY,
    address     VARCHAR(255) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10)  NOT NULL,
    country     VARCHAR(100) DEFAULT 'Germany',
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS households
(
    id            SERIAL PRIMARY KEY,
    building_id   INTEGER     NOT NULL REFERENCES buildings (id) ON DELETE CASCADE,
    room_number   VARCHAR(20) NOT NULL,
    floor         INTEGER,
    status        VARCHAR(50) DEFAULT 'active',
    created_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS users
(
    id           SERIAL PRIMARY KEY,
    household_id INTEGER,
    email        VARCHAR(255) UNIQUE NOT NULL,
    password     VARCHAR(255),
    first_name   VARCHAR(100),
    last_name    VARCHAR(100),
    phone        VARCHAR(20),
    address      VARCHAR(255),
    city         VARCHAR(100),
    postal_code  VARCHAR(10),
    role         VARCHAR(50) DEFAULT 'user',
    created_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);
--
-- CREATE TABLE IF NOT EXISTS buildings
-- (
--     id SERIAL PRIMARY KEY,
--     address VARCHAR(255) NOT NULL,
--     city VARCHAR(100),
--     postal_code VARCHAR(10),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- CREATE TABLE IF NOT EXISTS households
-- (
--     id SERIAL PRIMARY KEY,
--     building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
--     room_number VARCHAR(50),
--     floor VARCHAR(50),
--     status VARCHAR(50) DEFAULT 'occupied',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );