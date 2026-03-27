// =============================================
// DNA PARSER — Web Worker
// Runs off the main thread so the UI never freezes.
// Handles ZIP, GZ, and plain text DNA files.
// =============================================

importScripts('/js/jszip.min.js');

const post = (type, payload) => self.postMessage({ type, ...payload });

// ── Entry point ───────────────────────────────────────────────────
self.onmessage = async ({ data }) => {
    const { buffer, filename, targetRsids } = data;
    const target = new Set(targetRsids);
    const fname  = filename.toLowerCase();

    // ── Step 1: Decompress / read ─────────────────────────────────
    let text;
    try {
        if (fname.endsWith('.zip')) {
            post('progress', { label: 'Extracting ZIP archive…', pct: 8 });
            text = await extractZip(buffer);
        } else if (fname.endsWith('.gz')) {
            post('progress', { label: 'Decompressing .gz file…', pct: 8 });
            text = await decompressGz(buffer);
        } else {
            post('progress', { label: 'Reading file…', pct: 8 });
            text = new TextDecoder().decode(new Uint8Array(buffer));
        }
    } catch (err) {
        post('error', { message: err.message }); return;
    }

    if (!text || text.length < 100) {
        post('error', { message: 'File appears empty or unreadable.' }); return;
    }

    // ── Step 2: Detect provider ───────────────────────────────────
    post('progress', { label: 'Detecting format…', pct: 20 });
    const provider = detectProvider(text, filename);
    post('provider', { provider });

    // ── Step 3: Parse ─────────────────────────────────────────────
    post('progress', { label: 'Scanning SNPs…', pct: 25 });
    const { snps, total } = parseDNA(text, target);

    post('done', { snps, total, provider });
};

// ── ZIP extraction ────────────────────────────────────────────────
async function extractZip(buffer) {
    const zip = await JSZip.loadAsync(buffer);
    const validExts = ['.csv', '.txt', '.raw', '.tsv'];
    let target = null;

    for (const [p, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue;
        const lower = p.toLowerCase();
        if (lower.includes('__macosx') || lower.includes('.ds_store')) continue;
        if (!validExts.some(e => lower.endsWith(e))) continue;
        if (!target) target = entry;
        if (lower.includes('dna') || lower.includes('raw') || lower.includes('genome') || lower.includes('ancestry')) {
            target = entry; break;
        }
    }

    if (!target) {
        // Fall back to first non-dir file
        for (const [, e] of Object.entries(zip.files)) {
            if (!e.dir) { target = e; break; }
        }
    }
    if (!target) throw new Error('No DNA data file found inside ZIP.');
    return await target.async('string');
}

// ── GZ decompression (native browser API) ────────────────────────
async function decompressGz(buffer) {
    const ds     = new DecompressionStream('gzip');
    const stream = new ReadableStream({
        start(c) { c.enqueue(new Uint8Array(buffer)); c.close(); }
    }).pipeThrough(ds);
    const reader = stream.getReader();
    const chunks = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }
    const dec = new TextDecoder();
    return chunks.map(c => dec.decode(c, { stream: true })).join('') + dec.decode();
}

// ── Provider detection ────────────────────────────────────────────
function detectProvider(text, filename) {
    const fn   = filename.toLowerCase();
    const head = text.substring(0, 3000).toLowerCase();
    if (fn.includes('myheritage') || head.includes('myheritage'))   return 'MyHeritage';
    if (fn.includes('23andme')   || head.includes('23andme'))       return '23andMe';
    if (fn.includes('ancestry')  || head.includes('ancestrydna'))   return 'AncestryDNA';
    if (fn.includes('ftdna')     || fn.includes('familytree') || head.includes('family tree dna')) return 'FTDNA';
    if (fn.includes('livingdna') || head.includes('living dna'))    return 'LivingDNA';
    const lines = text.substring(0, 5000).split('\n').filter(l => l.trim() && !l.startsWith('#'));
    if (lines.length > 0) {
        const f = lines[0];
        if (f.includes('allele1') && f.includes('allele2')) return 'AncestryDNA';
        if ((f.includes('RSID') || f.includes('rsid')) && (f.includes('RESULT') || f.includes('result'))) return 'MyHeritage';
        if (f.includes('genotype')) return '23andMe';
    }
    return 'Unknown Format';
}

// ── Core SNP parser ───────────────────────────────────────────────
// Runs synchronously on the worker thread — safe because we're off
// the main thread. Posts progress every 100k lines.
function parseDNA(text, target) {
    const snps = {};
    let total = 0;

    const lines = text.split('\n');
    const len   = lines.length;

    // ── Format detection ──────────────────────────────────────────
    let delim = '\t', genoCol = -1, allele1Col = -1, allele2Col = -1, rsidCol = 0;

    for (let i = 0; i < Math.min(len, 100); i++) {
        const raw = lines[i].trim();
        if (!raw || raw.startsWith('#')) continue;
        const clean = raw.replace(/"/g, '').toLowerCase();

        if (clean.includes('rsid') || clean.includes('snpid') || clean.includes('marker')) {
            if (raw.split('\t').length >= 4)      delim = '\t';
            else if (raw.split(',').length >= 4)  delim = ',';
            else continue;

            const cols = clean.split(delim).map(c => c.trim());
            for (let c = 0; c < cols.length; c++) {
                if (cols[c] === 'result'   || cols[c] === 'genotype') genoCol    = c;
                if (cols[c] === 'allele1')                            allele1Col = c;
                if (cols[c] === 'allele2')                            allele2Col = c;
                if (cols[c] === 'rsid' || cols[c] === 'snpid' || cols[c] === 'marker') rsidCol = c;
            }
            continue;
        }

        if (raw.split('\t').length >= 4)     delim = '\t';
        else if (raw.split(',').length >= 4) delim = ',';
        if (delim) {
            const parts = raw.replace(/"/g, '').split(delim);
            if (parts.length >= 5) {
                const c3 = parts[3]?.trim(), c4 = parts[4]?.trim();
                if (c3?.length === 1 && c4?.length === 1 && /^[ACGT0]$/i.test(c3) && /^[ACGT0]$/i.test(c4)) {
                    allele1Col = 3; allele2Col = 4; genoCol = -1;
                }
            }
            if (genoCol === -1 && allele1Col === -1 && parts.length >= 4) genoCol = parts.length - 1;
            break;
        }
    }

    if (genoCol === -1 && allele1Col === -1) genoCol = 3;

    // Pre-compute for hot path
    const delimCode = delim.charCodeAt(0);
    const HASH = 35, QUOTE = 34, CR = 13;
    const RS_R = 114, RS_S = 115;
    const bad   = new Set(['--','00','NA','II','DD','DI','ID','0','','-','N','NN']);

    const REPORT_EVERY = 100_000;
    let nextReport = REPORT_EVERY;

    for (let idx = 0; idx < len; idx++) {
        const raw = lines[idx];
        if (!raw || raw.length < 5) continue;

        const c0 = raw.charCodeAt(0);
        if (c0 === HASH || c0 === CR) continue;

        // Fast rsid extraction — no full line split
        let rsidStart = 0;
        if (rsidCol > 0) {
            let col = 0;
            for (let i = 0; i < raw.length; i++) {
                if (raw.charCodeAt(i) === delimCode && ++col === rsidCol) {
                    rsidStart = i + 1; break;
                }
            }
            if (rsidStart === 0) continue;
        }

        let rsidEnd = raw.indexOf(delim, rsidStart);
        if (rsidEnd === -1) continue;

        let rsid = raw.substring(rsidStart, rsidEnd);
        if (rsid.charCodeAt(0) === QUOTE)
            rsid = rsid.slice(1, rsid.charCodeAt(rsid.length - 1) === QUOTE ? -1 : rsid.length);

        if (rsid.charCodeAt(0) !== RS_R || rsid.charCodeAt(1) !== RS_S) continue;

        total++;

        if (!target.has(rsid)) continue;

        // Full parse only for target SNPs (~200 out of 700k)
        const parts = raw.split(delim);
        let genotype;
        if (allele1Col >= 0 && allele2Col >= 0 && parts.length > allele2Col) {
            const a1 = (parts[allele1Col] || '').replace(/"/g, '').trim();
            const a2 = (parts[allele2Col] || '').replace(/"/g, '').trim();
            if (bad.has(a1) || bad.has(a2)) continue;
            genotype = a1 + a2;
        } else if (genoCol >= 0 && parts.length > genoCol) {
            genotype = (parts[genoCol] || '').replace(/"/g, '').trim();
        } else continue;

        if (!genotype || genotype.length > 2 || bad.has(genotype.toUpperCase())) continue;
        snps[rsid] = genotype.toUpperCase();

        // Send progress updates periodically
        if (total >= nextReport) {
            const pct = Math.min(Math.round((idx / len) * 65) + 25, 88);
            post('progress', {
                label: `Scanning… ${total.toLocaleString()} SNPs checked, ${Object.keys(snps).length} matched`,
                pct,
            });
            nextReport += REPORT_EVERY;
        }
    }

    return { snps, total };
}
