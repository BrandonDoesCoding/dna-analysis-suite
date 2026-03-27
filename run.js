// =============================================
// DNA Analysis Suite — Local Dev Server
// Run with: node run.js
// =============================================

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

// ── ANSI colours ─────────────────────────────────────────────────
const C = {
    reset:  '\x1b[0m',
    dim:    '\x1b[2m',
    bold:   '\x1b[1m',
    green:  '\x1b[32m',
    cyan:   '\x1b[36m',
    yellow: '\x1b[33m',
    red:    '\x1b[31m',
    purple: '\x1b[35m',
    white:  '\x1b[97m',
    gray:   '\x1b[90m',
};

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.ico':  'image/x-icon',
    '.svg':  'image/svg+xml',
    '.woff2':'font/woff2',
};

// ── Helpers ───────────────────────────────────────────────────────
function fmtBytes(n) {
    if (n < 1024)        return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function fmtMs(ms) {
    if (ms < 1)    return `${(ms * 1000).toFixed(0)}µs`;
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function timestamp() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function statusColor(code) {
    if (code >= 500) return C.red;
    if (code >= 400) return C.yellow;
    if (code >= 300) return C.cyan;
    return C.green;
}

function fileTypeLabel(ext) {
    const map = { '.html': 'HTML', '.css': 'CSS', '.js': 'JS', '.png': 'IMG', '.jpg': 'IMG', '.svg': 'SVG' };
    return (map[ext] || ext.slice(1).toUpperCase() || 'FILE').padEnd(4);
}

let requestCount = 0;

// ── Server ────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
    const start = performance.now();
    requestCount++;

    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';

    const filePath = path.join(ROOT, urlPath);

    // Security: prevent directory traversal
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403); res.end('Forbidden');
        console.log(`${C.red}  [403] BLOCKED traversal attempt: ${urlPath}${C.reset}`);
        return;
    }

    fs.readFile(filePath, (err, data) => {
        const ms   = performance.now() - start;
        const ext  = path.extname(filePath).toLowerCase();
        const mime = MIME[ext] || 'application/octet-stream';
        const code = err ? 404 : 200;
        const sc   = statusColor(code);
        const type = fileTypeLabel(ext);

        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Not found: ${urlPath}`);
            console.log(`${C.gray}  ${timestamp()}  ${sc}${code}${C.reset}  ${C.yellow}${type}${C.reset}  ${C.gray}${urlPath}${C.reset}`);
            return;
        }

        res.writeHead(200, {
            'Content-Type':  mime,
            'Cache-Control': 'no-cache',
        });
        res.end(data);

        const sizeStr  = fmtBytes(data.length).padStart(8);
        const timeStr  = fmtMs(ms).padStart(7);
        const pathStr  = urlPath === '/index.html' && req.url === '/' ? '/' : urlPath;

        console.log(
            `${C.gray}  ${timestamp()}  ${C.reset}` +
            `${sc}${code}${C.reset}  ` +
            `${C.purple}${type}${C.reset}  ` +
            `${C.white}${pathStr.padEnd(40)}${C.reset}` +
            `${C.cyan}${sizeStr}${C.reset}  ` +
            `${C.gray}${timeStr}${C.reset}`
        );
    });
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`\n${C.red}  ✖  Port ${PORT} is already in use.${C.reset}`);
        console.log(`${C.gray}     Either the server is already running, or another app is using port ${PORT}.${C.reset}`);
        console.log(`${C.yellow}     Try:  npx kill-port ${PORT}  — then run again.${C.reset}\n`);
    } else {
        console.error(`\n${C.red}  Server error: ${err.message}${C.reset}\n`);
    }
    process.exit(1);
});

// ── Download dependencies if missing ─────────────────────────────
function ensureDeps(cb) {
    const jszipPath = path.join(ROOT, 'js', 'jszip.min.js');
    if (fs.existsSync(jszipPath)) { cb(); return; }

    console.log(`\n${C.yellow}  ⬇  Downloading JSZip locally (needed for ZIP file support)…${C.reset}`);
    const https = require('https');
    const url   = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    const dest  = fs.createWriteStream(jszipPath);

    https.get(url, res => {
        res.pipe(dest);
        dest.on('finish', () => {
            dest.close();
            const size = fs.statSync(jszipPath).size;
            console.log(`${C.green}  ✔  JSZip saved to js/jszip.min.js (${fmtBytes(size)})${C.reset}`);
            cb();
        });
    }).on('error', err => {
        fs.unlink(jszipPath, () => {});
        console.log(`${C.red}  ✖  Failed to download JSZip: ${err.message}${C.reset}`);
        console.log(`${C.gray}     ZIP file support will be unavailable.${C.reset}`);
        cb(); // continue anyway
    });
}

// ── Startup ───────────────────────────────────────────────────────
ensureDeps(() => server.listen(PORT, '127.0.0.1', () => {
    const url = `http://localhost:${PORT}`;

    // Scan JS files to report what's loaded
    const jsFiles = fs.readdirSync(path.join(ROOT, 'js'))
        .filter(f => f.endsWith('.js'))
        .map(f => {
            const size = fs.statSync(path.join(ROOT, 'js', f)).size;
            return { name: f, size };
        });

    const totalJsSize = jsFiles.reduce((s, f) => s + f.size, 0);

    console.clear();
    console.log(`\n${C.bold}${C.purple}  ██████╗ ███╗   ██╗ █████╗ ${C.reset}`);
    console.log(`${C.bold}${C.purple}  ██╔══██╗████╗  ██║██╔══██╗${C.reset}`);
    console.log(`${C.bold}${C.purple}  ██║  ██║██╔██╗ ██║███████║${C.reset}`);
    console.log(`${C.bold}${C.purple}  ██║  ██║██║╚██╗██║██╔══██║${C.reset}`);
    console.log(`${C.bold}${C.purple}  ██████╔╝██║ ╚████║██║  ██║${C.reset}`);
    console.log(`${C.bold}${C.purple}  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝${C.reset}  ${C.white}${C.bold}Analysis Suite${C.reset}\n`);

    console.log(`${C.green}  ✔  Server running${C.reset}  →  ${C.bold}${C.white}${url}${C.reset}`);
    console.log(`${C.gray}     Root: ${ROOT}${C.reset}\n`);

    console.log(`${C.cyan}  Modules loaded (${jsFiles.length} files, ${fmtBytes(totalJsSize)} total):${C.reset}`);
    jsFiles.forEach(f => {
        console.log(`${C.gray}    ·  js/${f.name.padEnd(28)} ${fmtBytes(f.size).padStart(8)}${C.reset}`);
    });

    console.log(`\n${C.yellow}  Tip: DNA parsing happens in the browser, not here.${C.reset}`);
    console.log(`${C.gray}       Large files (>50MB) will take a few seconds to scan.\n${C.reset}`);
    console.log(`${C.dim}  TIME        CODE  TYPE  PATH                                     SIZE      MS${C.reset}`);
    console.log(`${C.dim}  ──────────────────────────────────────────────────────────────────────────${C.reset}`);

    // Auto-open browser
    const { exec } = require('child_process');
    exec(`start ${url}`);
}));

// ── Graceful shutdown ─────────────────────────────────────────────
process.on('SIGINT', () => {
    console.log(`\n${C.yellow}  ⏹  Shutting down after ${requestCount} requests. Bye!${C.reset}\n`);
    process.exit(0);
});
