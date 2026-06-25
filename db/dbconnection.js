const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const metrics = require('../metrics/metrics');

class DatabaseConnection {
    constructor() {
        // Verbindungspool initialisieren
        this.pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'wissar_db',
            password: 'postgres',
            port: 5432,
        });

        // Mess-Wrapper: jede Query, die innerhalb eines gemessenen Requests
        // läuft, wird gezählt und ihre Dauer dem Request zugerechnet.
        // Greift transparent für alle Repositories, da sie denselben Pool teilen.
        const origQuery = this.pool.query.bind(this.pool);
        this.pool.query = (...args) => {
            const start = process.hrtime.bigint();
            const result = origQuery(...args);
            if (result && typeof result.then === 'function') {
                return result.finally(() => {
                    metrics.recordDbQuery(process.hrtime.bigint() - start);
                });
            }
            return result; // Callback-Form (hier nicht genutzt): nicht gemessen
        };
    }

    // Führt alle SQL-Migrationsskripte aus
    async init() {
        const migrationsDir = path.join(process.cwd(), 'db', 'migrations');
        try {
            // Stelle sicher, dass das Migrationsverzeichnis existiert
            if (!fs.existsSync(migrationsDir)) {
                console.log('Migrationsverzeichnis nicht gefunden.');
                return;
            }

            // Lese alle .sql Dateien
            const files = fs.readdirSync(migrationsDir)
                .filter(file => file.endsWith('.sql'))
                .sort();

            console.log(`${files.length} Migrationsdatei(en) gefunden.`);

            // Führe jede Migration aus
            for (const file of files) {
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');
                
                try {
                    await this.pool.query(sql);
                    console.log(`✓ Migration ausgeführt: ${file}`);
                } catch (error) {
                    console.error(`✗ Fehler bei Migration ${file}:`, error.message);
                }
            }
        } catch (error) {
            console.error('Fehler beim Laden der Migrationen:', error);
        }
    }

    // Gibt den Pool zurück für Datenbankoperationen
    getPool() {
        return this.pool;
    }

    // Schließt den Pool (wichtig für sauberes Beenden bei Lasttests)
    async disconnect() {
        await this.pool.end();
    }
}

// Wir exportieren eine Singleton-Instanz
module.exports = new DatabaseConnection();

