const express = require('express');
// const app = express();
// const https = require('https');
// const fs = require('fs');
// const { join } = require('node:path');
// const path = require('path');
// // Apollo GraphQL Imports
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@as-integrations/express4'); // Korrektes Apollo 5 Paket
// const typeDefs = require('./schema');
// const resolvers = require('./resolver');
//
// // Deine vorhandenen Imports (Ein Ordner nach oben, da wir im graphql/ Ordner sind)
// const userRepository = require('../models/userrepo');
//
// app.use(express.json());
// const publicPath = path.join(__dirname, '..', 'public');
// app.use(express.static(publicPath));
// console.log("➔ Express sucht den public-Ordner in:", publicPath);
// async function startServer() {
//
//     // 1. Apollo Server aufbauen
//     const server = new ApolloServer({
//         typeDefs,
//         resolvers,
//     });
//
//     await server.start();
//
//     // 2. GraphQL exakt wie deine REST-Router registrieren
//     app.use('/graphql', expressMiddleware(server));
//
//     // 3. Fallback Route (Wie in deinem REST-Server)
//     app.use((req, res) => {
//         res.status(404).json({error: 'Route nicht gefunden'});
//     });
//
//     // 4. DB-Initialisierung (Wie in deinem REST-Server)
//     userRepository.init()
//         .then(() => {
//             console.log('DB-Initialisierung erfolgreich abgeschlossen.');
//         })
//         .catch((err) => {
//             console.error('Fehler bei der DB-Initialisierung:', err);
//         });
//
//     // 5. SSL/TLS-Zertifikate einlesen und Server starten (Wie in deinem REST-Server)
//     try {
//         const httpsOptions = {
//             // Pfad geht einen Ordner hoch, weil die Datei in /graphql liegt
//             key: fs.readFileSync(join(__dirname, '..', 'server.key')),
//             cert: fs.readFileSync(join(__dirname, '..', 'server.cert'))
//         };
//
//         const PORT = 443;
//         https.createServer(httpsOptions, app).listen(PORT, () => {
//             console.log(`🚀 Wissenschaftlicher HTTPS-GraphQL-Server läuft stabil auf Port ${PORT}`);
//             console.log(`   ↳ GraphQL-Endpunkt: https://localhost:${PORT}/graphql`);
//         });
//
//     } catch (error) {
//         console.error("Fehler beim Laden der SSL-Zertifikate:", error.message);
//     }
// }
//
// startServer();
//
// module.exports = app;