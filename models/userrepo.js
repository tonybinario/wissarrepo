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

    async createUser(userData) {
        const {
            household_id, email, password, first_name,
            last_name, phone, address, city, postal_code,
            role, status
        } = userData;

        const query = `
            INSERT INTO users
            (household_id, email, password, first_name, last_name,
             phone, address, city, postal_code, role, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;
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
            status || 'active'
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