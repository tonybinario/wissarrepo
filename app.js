const express = require('express');
const https = require('https');
const fs = require('fs');
const { join } = require('node:path');
const path = require('path');

// Apollo GraphQL Imports
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const typeDefs = require('./graphql/schema'); // Pfade eventuell anpassen
const resolvers = require('./graphql/resolver');

// REST Router & Repositories Imports
const usersRouter = require('./routes/users');
const buildingsRouter = require('./routes/buildings');
const householdsRouter = require('./routes/households');
const userRepository = require('./models/userrepo');

// Mess-Infrastruktur (REST vs. GraphQL)
const metrics = require('./metrics/metrics');

// Ressourcen-Metriken (CPU/RAM) im Prometheus-Format. prom-client erfasst u.a.
// process_cpu_seconds_total (kumulative CPU-Sekunden) und
// process_resident_memory_bytes (RSS). Erhebung erfolgt out-of-band per Pull:
// ein externer Scraper liest periodisch GET /metrics (siehe tools/scrape_metrics.js).
const promClient = require('prom-client');
promClient.collectDefaultMetrics();

const app = express();

// 1. Globale Middlewares
app.use(express.json());

// 1b. Mess-Middleware: misst Server-/DB-Zeit pro Request und setzt den
// Server-Timing-Header. Bewusst VOR den Routern und vor /graphql, damit der
// AsyncLocalStorage-Kontext sowohl REST-Handler als auch Resolver umschließt.
app.use(metrics.middleware);

// 2. Frontend Statisch ausliefern (Wichtig für das Smartphone!)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
console.log("➔ Express sucht den public-Ordner in:", publicPath);

// 3. REST-Router registrieren
app.use('/api/users', usersRouter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/households', householdsRouter);

// 3b. Prometheus-Exposition (read-only). Wird out-of-band gescrapt und liegt
// NICHT im Request-Pfad der gemessenen Endpunkte (/api/*, /graphql), sodass die
// Messung das System-under-test nicht verfälscht.
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});


// 4. GraphQL Server initialisieren und starten
async function startCombinedServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    // GraphQL-Middleware registrieren
    app.use('/graphql', expressMiddleware(server));

    // 5. Fallback Route für nicht existierende Pfade (Ganz unten!)
    app.use((req, res) => {
        res.status(404).json({ error: 'Route nicht gefunden' });
    });

    // 6. Datenbank initialisieren
    try {
        await userRepository.init();
        console.log('DB-Initialisierung erfolgreich abgeschlossen.');
    } catch (err) {
        console.error('Fehler bei der DB-Initialisierung:', err);
    }

    // 7. HTTPS Server starten
    try {
        const httpsOptions = {
            key: fs.readFileSync(join(__dirname, 'server.key')),
            cert: fs.readFileSync(join(__dirname, 'server.cert'))
        };

        const PORT = 443;
        https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`Master-HTTPS-Server läuft stabil auf Port ${PORT}`);
            console.log("Frontend-Oberfläche: https://localhost/");
            console.log(" GraphQL-Endpunkt: https://localhost/graphql");
        });
    } catch (error) {
        console.error("Fehler beim Laden der SSL-Zertifikate:", error.message);
    }
}

startCombinedServer();