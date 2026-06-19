const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');       // Zum Einlesen der Zertifikatsdateien
const PORT = 443;


app.use(express.json());

// Router importieren
const usersRouter = require('./routes/users');
const userRepository = require('./models/userrepo');
const buildingsRouter = require('./routes/buildings');
const householdsRouter = require('./routes/households');
const {join} = require("node:path");
// Router registrieren
app.use('/api/users', usersRouter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/households', householdsRouter);

app.use((req, res) => {
    res.status(404).json({error: 'Route nicht gefunden'});
});

userRepository.init()//sql skript werden ausgeführt
    .then(() => {
        console.log('DB-Initialisierung erfolgreich abgeschlossen.');
    })
    .catch((err) => {
        console.error('Fehler bei der DB-Initialisierung:', err);
    });

try {
    // 2. SSL/TLS-Zertifikate einlesen
    // Stelle sicher, dass die Pfade zu deinen vorhin generierten Dateien stimmen!
    const httpsOptions = {
        key: fs.readFileSync(join(__dirname, 'server.key')),
        cert: fs.readFileSync(join(__dirname, 'server.cert'))
    };

    // 3. Den Express-App-Inhalt in einen HTTPS-Server einwickeln
    const PORT = 443;
    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`🚀 Wissenschaftlicher HTTPS-Server läuft stabil auf Port ${PORT}`);
    });

} catch (error) {
    console.error("Fehler beim Laden der SSL-Zertifikate:", error.message);
    console.error("Hast du 'openssl req...' im richtigen Ordner ausgeführt?");
}


module.exports = app;