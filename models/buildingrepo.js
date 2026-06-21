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

    // Holt ein einzelnes Gebäude anhand seiner ID
    async getBuildingById(id) {
        const res = await this.pool.query('SELECT * FROM buildings WHERE id = $1', [id]);
        return res.rows[0];
    }

    // Spezielle Mega-Query für das Lasttest-Szenario (Heavy Nested Fetch)
    async getDeepNestedBuildings() {
        const query = `
        SELECT 
            b.id AS building_id, b.address AS building_address, b.city AS building_city, b.postal_code AS building_postal_code, b.country AS building_country, b.status AS building_status,
            h.id AS household_id, h.room_number, h.floor, h.max_residents, h.status AS household_status,
            u.id AS user_id, u.email, u.first_name, u.last_name, u.phone, u.role, u.status AS user_status
        FROM buildings b
        LEFT JOIN households h ON b.id = h.building_id
        LEFT JOIN users u ON h.id = u.household_id;
    `;
        const res = await this.pool.query(query);
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