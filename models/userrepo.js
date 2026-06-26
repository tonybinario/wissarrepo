const db = require('../db/dbconnection');

class UserRepository {
    constructor() {
        this.pool = db.getPool();
    }

    // Initialisiert die Datenbankverbindung
    async init() {
        await db.init();
    }

    // Holt alle User aus der Datenbank
    async getAllUsers() {
        const res = await this.pool.query('SELECT * FROM users');
        return res.rows;
    }

    // Holt einen einzelnen User anhand seiner ID
    async getUserById(id) {
        console.log("enter");
        const query = 'SELECT id, household_id, email, first_name, last_name, phone, address, city, postal_code, role, status FROM users WHERE id = $1';
        const res = await this.pool.query(query, [id]);

        if (res.rows.length === 0) {
            return null;
        }

        // KORREKTUR: Einfach die ganze Zeile zurückgeben!
        // Da sind dann id, email, first_name, last_name etc. alle fix und fertig drin.
        return res.rows[0];
    }

    async getUsersByHouseholdId(householdId) {
        const res = await this.pool.query('SELECT id, household_id, email, first_name, last_name, phone, address, city, postal_code, role, status FROM users WHERE household_id = $1', [householdId]);

        if (res.rows.length === 0) {
            return null;
        }

        return res.rows[0];
    }

    async createUser(userData) {
        const {
            household_id, email, password, first_name,
            last_name, phone, address, city, postal_code,
            role,
        } = userData;

        const query = `
            INSERT INTO users
            (household_id, email, password, first_name, last_name,
             phone, address, city, postal_code, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
        `;

        const values = [
            household_id || null,
            email,
            password || null,
            first_name || null,
            last_name || null,
            phone || null,
            address || null,
            city || null,
            postal_code || null,
            role || 'user',
        ];

        const res = await this.pool.query(query, values);
        return res.rows[0];
    }

    // Schließt den Pool
    async disconnect() {
        await db.disconnect();
    }
}

module.exports = new UserRepository();