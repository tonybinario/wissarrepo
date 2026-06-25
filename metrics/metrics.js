// Server-seitige Instrumentierung für den REST-vs-GraphQL-Vergleich.
//
// Misst pro Request die Verarbeitungszeit und – über AsyncLocalStorage – die
// DB-Zeit und Query-Anzahl, und gibt beides im Server-Timing-Header zurück.
// Die eigentlichen Latenz-/Durchsatzmessungen laufen extern über k6, das den
// Header pro Response mitliest (k6 sieht die DB-Dekomposition selbst nicht).
// Hier wird bewusst nichts in eine Datei geschrieben: kein I/O auf dem
// Event-Loop, keine Messdaten-Haltung im System-under-test.

const { AsyncLocalStorage } = require('node:async_hooks');

// Request-skopierter Zähler: { dbQueries, dbTimeNs }
const als = new AsyncLocalStorage();

// Vom DB-Wrapper (dbconnection.js) bei jeder Query aufgerufen.
function recordDbQuery(durationNs) {
    const store = als.getStore();
    if (!store) return; // Query außerhalb eines gemessenen Requests
    store.dbQueries += 1;
    store.dbTimeNs += durationNs;
}

// Misst Server-/DB-Zeit pro Request und gibt sie im Server-Timing-Header zurück.
function middleware(req, res, next) {
    const measured = req.path.startsWith('/api/') || req.path === '/graphql';
    if (!measured) return next();

    const store = { dbQueries: 0, dbTimeNs: 0n };
    const start = process.hrtime.bigint();
    const origEnd = res.end;

    res.end = function (...args) {
        if (!res.headersSent) {
            const serverMs = Number(process.hrtime.bigint() - start) / 1e6;
            const dbMs = Number(store.dbTimeNs) / 1e6;
            // app = Verarbeitungszeit, db = DB-Zeit, dbq = Query-Anzahl.
            res.setHeader(
                'Server-Timing',
                `app;dur=${serverMs.toFixed(3)}, db;dur=${dbMs.toFixed(3)}, dbq;dur=${store.dbQueries}`
            );
        }
        return origEnd.apply(this, args);
    };

    als.run(store, next);
}

module.exports = { als, recordDbQuery, middleware };
