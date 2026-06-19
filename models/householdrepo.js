const db = require('../db/dbconnection'); // Pfad zu deinem DB-Modul anpassen

class HouseholdRepository {
    constructor() {
        this.pool = db.getPool();
    }

    // Holt alle Haushalte
    async getAllHouseholds() {
        const res = await this.pool.query('SELECT * FROM households');
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