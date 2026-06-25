// Out-of-band Scraper für die Server-Ressourcenmetriken.
//
// Liest periodisch den Prometheus-Endpunkt GET /metrics des Node-Servers und
// schreibt die relevanten Werte mit Zeitstempel in eine CSV. Läuft als EIGENER
// Prozess (Pull-Modell) – die Messung liegt damit außerhalb des Request-Pfads
// der gemessenen Endpunkte und verfälscht das System-under-test nicht.
//
// Faire Kennzahl: process_cpu_seconds_total ist ein KUMULATIVER Zähler.
// CPU-Sekunden eines Messfensters = Wert(Ende) − Wert(Anfang); geteilt durch die
// in diesem Fenster verarbeiteten Requests ergibt CPU-Sekunden/Request.
// RSS (process_resident_memory_bytes): Steady-State-Median + Peak berichten.
//
// Aufruf (Beispiel):
//   node tools/scrape_metrics.js --url https://localhost/metrics \
//        --out results/server_s1.csv --interval 1000 --duration 120
//   (--duration 0 oder weglassen → bis Strg+C)

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function arg(name, def) {
    const i = process.argv.indexOf(`--${name}`);
    return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const url = arg('url', 'https://localhost/metrics');
const outPath = arg('out', `server_metrics_${Date.now()}.csv`);
const interval = parseInt(arg('interval', '1000'), 10);
const durationSec = parseInt(arg('duration', '0'), 10); // 0 = bis Strg+C

const dir = path.dirname(outPath);
if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const stream = fs.createWriteStream(outPath, { flags: 'w' });
stream.write('epoch_ms,iso,cpu_seconds_total,rss_bytes,rss_mb,eventloop_lag_seconds\n');

// Wert einer (label-losen) Prometheus-Metrik aus dem Text ziehen.
function readMetric(text, name) {
    const re = new RegExp('^' + name + '\\s+([0-9.eE+-]+)\\s*$', 'm');
    const m = text.match(re);
    return m ? parseFloat(m[1]) : '';
}

function scrapeOnce() {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { rejectUnauthorized: false }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
            const ts = Date.now();
            const cpu = readMetric(body, 'process_cpu_seconds_total');
            const rss = readMetric(body, 'process_resident_memory_bytes');
            const lag = readMetric(body, 'nodejs_eventloop_lag_seconds');
            const rssMb = rss === '' ? '' : (rss / 1048576).toFixed(2);
            if (!stream.writableEnded) {
                stream.write(`${ts},${new Date(ts).toISOString()},${cpu},${rss},${rssMb},${lag}\n`);
            }
        });
    });
    req.on('error', (e) => console.error('Scrape-Fehler:', e.message));
    req.setTimeout(interval, () => req.destroy());
}

let running = true;
function loop() {
    if (!running) return;
    const t0 = Date.now();
    scrapeOnce();
    setTimeout(loop, Math.max(0, interval - (Date.now() - t0)));
}

function stop() {
    running = false;
    stream.end(() => {
        console.log(`\nScraper gestoppt. CSV → ${outPath}`);
        process.exit(0);
    });
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
if (durationSec > 0) setTimeout(stop, durationSec * 1000);

console.log(`Scrape ${url} alle ${interval} ms → ${outPath}`);
console.log(durationSec > 0 ? `Auto-Stop nach ${durationSec}s` : 'Stop mit Strg+C');
loop();
