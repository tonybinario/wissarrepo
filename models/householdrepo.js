const db = require('../db/dbconnection'); // Pfad zu deinem DB-Modul anpassen

class HouseholdRepository {
    constructor() {
        this.pool = db.getPool();
    }

    async getAllHouseholdsFlat() {
        const res = await this.pool.query('SELECT * FROM households');
        return res.rows;
    }

    async getAllHouseholds() {
        const query = `
        SELECT h.id, h.room_number,
               json_build_object(
                   'id', u.id,
                   'email', u.email
               ) AS user
        FROM households h
        LEFT JOIN users u ON u.household_id = h.id;
    `;
        const res = await this.pool.query(query);
        return res.rows;
    }

    async getHouseholdById(id) {
        const res = await this.pool.query('SELECT * FROM households WHERE id = $1', [id]);
        return res.rows[0];
    }

    // Holt alle Haushalte, die zu einem bestimmten Gebäude gehören
    async getHouseholdsByBuildingId(buildingId) {
        const res = await this.pool.query('SELECT * FROM households WHERE building_id = $1', [buildingId]);
        return res.rows;
    }


    // Erstellt einen neuen Haushalt (Wichtig für dein 1:1 Experiment)
    async createHousehold(householdData) {
        const {
            building_id, room_number, floor, max_residents, status
        } = householdData;

        const query = `
            INSERT INTO households 
            (building_id, room_number, floor, max_residents, status)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;

        const values = [
            building_id, // Pflichtfeld (Foreign Key)
            room_number, // Pflichtfeld
            floor || null,
            max_residents || 1, // Auf 1 gesetzt, da ein User exklusiv einen Haushalt besitzt
            status || 'active'
        ];

        const res = await this.pool.query(query, values);
        return res.rows[0];
    }
}

module.exports = new HouseholdRepository(); // Als Singleton exportierenB