const db = require('../db/dbconnection'); // Pfad zu deinem DB-Modul anpassen

class BuildingRepository {
    constructor() {
        this.pool = db.getPool();
    }

    async getAllBuildingsFlat() {
        // Liefert alle Spalten, was typisch für REST-Overfetching ist
        const res = await this.pool.query('SELECT * FROM buildings');
        return res.rows;
    }

    async getAllBuildings() {
        const query = `
        SELECT b.id, b.address, b.city,
               COALESCE(
                   json_agg(
                       json_build_object(
                           'id', h.id, 
                           'room_number', h.room_number
                       )
                   ) FILTER (WHERE h.id IS NOT NULL), 
                   '[]'
               ) AS households
        FROM buildings b
        LEFT JOIN households h ON b.id = h.building_id
        GROUP BY b.id;
    `;
        const res = await this.pool.query(query);
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
            b.id AS building_id, b.address AS building_address, b.city AS building_city, b.postal_code AS building_postal_code, b.country AS building_country,
            h.id AS household_id, h.room_number, h.floor, h.max_residents, h.status AS household_status,
            u.id AS user_id, u.email, u.first_name, u.last_name, u.phone, u.role
        FROM buildings b
        LEFT JOIN households h ON b.id = h.building_id
        LEFT JOIN users u ON h.id = u.household_id;
    `;
        const res = await this.pool.query(query);
        return res.rows;
    }

}

module.exports = new BuildingRepository(); // Als Singleton exportieren