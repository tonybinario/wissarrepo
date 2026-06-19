const db = require('../db/dbconnection'); // Pfad zu deinem DB-Modul anpassen

class BuildingRepository {
    constructor() {
        this.pool = db.getPool();
    }

    // Holt alle Gebäude
    async getAllBuildings() {
        const res = await this.pool.query('SELECT * FROM buildings');
        return res.rows;
    }

    // Erstellt ein neues Gebäude
    async createBuilding(buildingData) {
        const {
            address, city, postal_code, country, status
        } = buildingData;

        const query = `
            INSERT INTO buildings 
            (address, city, postal_code, country, status)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;

        const values = [
            address,
            city,
            postal_code,
            country || 'Germany',
            status || 'active'
        ];

        const res = await this.pool.query(query, values);
        return res.rows[0];
    }
}

module.exports = new BuildingRepository(); // Als Singleton exportieren