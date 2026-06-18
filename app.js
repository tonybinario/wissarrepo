const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json()); // Wichtig, damit req.body (JSON) gelesen werden kann!

// Router importieren
const usersRouter = require('./routes/users');
const userRepository = require('./models/userrepo'); // Pfad zu deiner DB-Klasse anpassen!
// Router registrieren
app.use('/api/users', usersRouter);

app.use((req, res) => {
    res.status(404).json({error: 'Route nicht gefunden'});
});

// >>> HIER WIRD INIT AUSGEFÜHRT <<<
userRepository.init()
    .then(() => {
        console.log('DB-Initialisierung erfolgreich abgeschlossen.');

        // Erst wenn die DB bereit ist, starten wir den Server
        app.listen(PORT, () => {
            console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Kritischer Fehler beim Serverstart:', err);
    });


module.exports = app;