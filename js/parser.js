// =============================================
// DNA FILE PARSER — Optimized, frame-budgeted
// =============================================

function readFileAsText(file) {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = e => res(e.target.result);
        r.onerror = rej;
        r.readAsText(file);
    });
}

async function extractFromZip(file) {
    const ab = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(ab);
    const validExts = ['.csv', '.txt', '.raw', '.tsv'];
    let targetFile = null;

    for (const [path, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue;
        const lower = path.toLowerCase();
        if (lower.includes('__macosx') || lower.includes('.ds_store')) continue;
        if (!validExts.some(ext => lower.endsWith(ext))) continue;
        if (!targetFile) targetFile = entry;
        if (lower.includes('dna') || lower.includes('raw') || lower.includes('genome') || lower.includes('ancestry')) {
            targetFile = entry; break;
        }
    }

    if (!targetFile) {
        for (const [, entry] of Object.entries(zip.files)) {
            if (!entry.dir) { targetFile = entry; break; }
        }
    }
    if (!targetFile) throw new Error('No DNA data file found inside ZIP.');
    return await targetFile.async('string');
}

async function decompressGzip(file) {
    if (typeof DecompressionStream !== 'undefined') {
        const ds = new DecompressionStream('gzip');
        const stream = file.stream().pipeThrough(ds);
        const reader = stream.getReader();
        const chunks = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }
        const decoder = new TextDecoder();
        return chunks.map(c => decoder.decode(c, { stream: true })).join('') + decoder.decode();
    }
    return await readFileAsText(file);
}

function detectProvider(text, filename) {
    const fn = filename.toLowerCase();
    const head = text.substring(0, 3000).toLowerCase();
    if (fn.includes('myheritage') || head.includes('myheritage')) return 'MyHeritage';
    if (fn.includes('23andme') || head.includes('23andme')) return '23andMe';
    if (fn.includes('ancestry') || head.includes('ancestrydna')) return 'AncestryDNA';
    if (fn.includes('ftdna') || fn.includes('familytree') || head.includes('family tree dna')) return 'FTDNA';
    if (fn.includes('livingdna') || head.includes('living dna')) return 'LivingDNA';
    const lines = text.substring(0, 5000).split('\n').filter(l => l.trim() && !l.startsWith('#'));
    if (lines.length > 0) {
        const f = lines[0];
        if (f.includes('allele1') && f.includes('allele2')) return 'AncestryDNA';
        if ((f.includes('RSID') || f.includes('rsid')) && (f.includes('RESULT') || f.includes('result'))) return 'MyHeritage';
        if (f.includes('genotype')) return '23andMe';
    }
    return 'Unknown Format';
}

// ─── Optimized parser ────────────────────────────────────────────────────────
// Key insight: 99.97% of lines are NOT in our SNP database (~200 SNPs vs ~700k lines).
// We extract just the rsid using indexOf (no full split) and skip unmatched lines
// immediately. Full split happens only for the ~200 target SNPs.
// Frame-budgeted scheduling (rAF + 12ms budget) keeps the UI at 60fps during parsing.

function parseDNA(text, barFill, labelEl) {
    return new Promise(resolve => {
        const snps = {};
        let total = 0;
        const target = new Set(Object.keys(SNP_DB));

        // Single upfront split — unavoidable, but fast in modern V8
        const lines = text.split('\n');
        const len = lines.length;
        let idx = 0;

        // ── Format detection ─────────────────────────────────────────────────
        let delim = '\t', genoCol = -1, allele1Col = -1, allele2Col = -1, rsidCol = 0;

        for (let i = 0; i < Math.min(len, 100); i++) {
            const raw = lines[i].trim();
            if (!raw || raw.startsWith('#')) continue;
            const clean = raw.replace(/"/g, '').toLowerCase();

            if (clean.includes('rsid') || clean.includes('snpid') || clean.includes('marker')) {
                if (raw.split('\t').length >= 4) delim = '\t';
                else if (raw.split(',').length >= 4) delim = ',';
                else continue;

                const cols = clean.split(delim).map(c => c.trim());
                for (let c = 0; c < cols.length; c++) {
                    if (cols[c] === 'result' || cols[c] === 'genotype') genoCol = c;
                    if (cols[c] === 'allele1') allele1Col = c;
                    if (cols[c] === 'allele2') allele2Col = c;
                    if (cols[c] === 'rsid' || cols[c] === 'snpid' || cols[c] === 'marker') rsidCol = c;
                }
                continue;
            }

            if (raw.split('\t').length >= 4) delim = '\t';
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

        // Pre-compute char codes for hot-path comparisons
        const delimCode = delim.charCodeAt(0);
        const HASH = 35, QUOTE = 34, CR = 13;
        const RS_R = 114, RS_S = 115; // 'r', 's'

        const bad = new Set(['--', '00', 'NA', 'II', 'DD', 'DI', 'ID', '0', '', '-', 'N', 'NN']);

        // ── Per-frame processing ──────────────────────────────────────────────
        // Uses requestAnimationFrame + 12ms time budget so UI stays at 60fps.
        function tick() {
            const deadline = performance.now() + 12; // 12ms of 16ms frame budget

            while (idx < len && performance.now() < deadline) {
                const raw = lines[idx++];
                if (!raw || raw.length < 5) continue;

                const c0 = raw.charCodeAt(0);
                if (c0 === HASH || c0 === CR) continue; // comment or bare \r

                // ── Fast rsid extraction — NO full line split ─────────────────
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
                const rc0 = rsid.charCodeAt(0);
                if (rc0 === QUOTE) rsid = rsid.slice(1, rsid.charCodeAt(rsid.length - 1) === QUOTE ? -1 : rsid.length);

                // Fast 'rs' prefix check using char codes
                if (rsid.charCodeAt(0) !== RS_R || rsid.charCodeAt(1) !== RS_S) continue;

                total++;

                // Skip if not a trait SNP we care about — ~99.97% of lines end here
                if (!target.has(rsid)) continue;

                // ── Full parse only for the ~200 target SNPs ─────────────────
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
            }

            // Update progress UI
            const pct = Math.round((idx / len) * 45 + 30);
            if (barFill) barFill.style.width = pct + '%';
            if (labelEl) labelEl.textContent =
                `Parsing SNPs… ${total.toLocaleString()} scanned, ${Object.keys(snps).length} matched`;

            if (idx < len) {
                requestAnimationFrame(tick);
            } else {
                resolve({ snps, total });
            }
        }

        requestAnimationFrame(tick);
    });
}
