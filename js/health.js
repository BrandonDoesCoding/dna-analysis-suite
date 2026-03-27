// =============================================
// GENETICS & HEALTH REPORT BUILDER
// =============================================

function buildHealthReport(parsedSNPs) {
    const c = document.getElementById('healthSections');
    c.innerHTML = '';

    const matchedTotal = Object.keys(parsedSNPs).length;
    const dbTotal = Object.keys(SNP_DB).length;

    // ── Toolbar ──────────────────────────────────────────────────────────────
    const toolbar = `<div class="report-toolbar">
        <div class="report-toolbar-left">
            <span class="report-stat"><strong>${matchedTotal}</strong> markers found</span>
            <span class="report-stat-sep">·</span>
            <span class="report-stat"><strong>${dbTotal}</strong> in database</span>
        </div>
        <div class="report-toolbar-right">
            <label class="toggle-switch" title="Hide SNPs not in your file">
                <input type="checkbox" id="matchedOnlyToggle" onchange="filterMatchedOnly(this.checked)">
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
                <span class="toggle-label-text">Matched only</span>
            </label>
            <button class="btn-collapse-all" onclick="collapseAll()">Collapse all</button>
        </div>
    </div>`;

    // ── Haplogroup detection (always visible at top) ──────────────────────────
    let html = toolbar + buildHaplotypSection(parsedSNPs) + buildNeanderthalSection(parsedSNPs);

    // ── All SNP category sections ─────────────────────────────────────────────
    const allCats = [
        'metabolism', 'brain', 'mental', 'nutrition',
        'cardiovascular', 'immune', 'autoimmune', 'bone',
        'hormonal', 'athletic', 'sleep', 'longevity',
        'vision', 'skin_health', 'cancer', 'disease',
        'haplogroup', 'ancestry',
    ];

    allCats.forEach(cat => {
        const ci = CATEGORIES[cat];
        if (!ci) return;
        const items = Object.entries(SNP_DB).filter(([, v]) => v.category === cat);
        if (!items.length) return;

        const matched = items.filter(([rsid]) => parsedSNPs[rsid]);
        const matchedCount = matched.length;
        const total = items.length;
        const pct = Math.round(matchedCount / total * 100);

        // Build all card HTML before inserting into DOM
        let cardsHTML = '';
        items.forEach(([rsid, info]) => {
            const g = parsedSNPs[rsid];
            if (!g) {
                cardsHTML += `<div class="snp-card not-genotyped" data-matched="0">
                    <div class="snp-emoji">❓</div>
                    <div class="snp-info">
                        <div class="snp-trait-name">${info.trait}</div>
                        <div class="snp-prediction">Not in this file</div>
                        <div class="snp-rsid">${rsid} · ${info.gene}</div>
                    </div>
                    <div class="snp-right"><span class="confidence-badge conf-low">N/A</span></div>
                </div>`;
                return;
            }
            const r = info.interpret(g);
            const cc = r.conf >= 65 ? 'conf-high' : r.conf >= 40 ? 'conf-mid' : 'conf-low';
            // Risk border color — red/amber/green based on emoji signals
            const riskClass = r.emoji === '🔴' || r.emoji === '⚠️' || r.emoji === '🚫' ? 'risk-high'
                : r.emoji === '🟡' || r.emoji === '🔸' ? 'risk-mid'
                : r.emoji === '🟢' || r.emoji === '✅' || r.emoji === '💚' ? 'risk-low'
                : '';

            cardsHTML += `<div class="snp-card ${riskClass}" data-matched="1">
                <div class="snp-emoji">${r.emoji}</div>
                <div class="snp-info">
                    <div class="snp-trait-name">${info.trait}</div>
                    <div class="snp-prediction">${r.pred}</div>
                    <div class="snp-detail">${r.detail}</div>
                    <div class="snp-rsid">${rsid} · ${info.gene} · <strong>${g}</strong></div>
                </div>
                <div class="snp-right">
                    <span class="confidence-badge ${cc}">${r.conf}%</span>
                    <span class="snp-genotype">${g}</span>
                </div>
            </div>`;
        });

        html += `<div class="trait-section fade-in" id="section-${cat}">
            <div class="trait-section-header" onclick="toggleSection('${cat}')" role="button" tabindex="0">
                <span class="trait-section-icon">${ci.icon}</span>
                <span class="trait-section-title">${ci.title}</span>
                <span class="snp-match-badge ${matchedCount === 0 ? 'badge-zero' : ''}">${matchedCount}/${total}</span>
                <div class="match-bar-mini"><div class="match-bar-fill" style="width:${pct}%"></div></div>
                <span class="section-chevron" id="chev-${cat}">▾</span>
            </div>
            ${ci.note ? `<div class="trait-section-note">${ci.note}</div>` : ''}
            <div class="section-body" id="body-${cat}">
                <div class="snp-grid">${cardsHTML}</div>
            </div>
        </div>`;
    });

    html += `<div class="disclaimer fade-in" style="margin-top:32px;">
        <strong>Health &amp; Genetics Disclaimer:</strong> Educational and informational purposes only —
        NOT medical advice. Consult a healthcare provider for clinical interpretation.
        Polygenic traits depend on thousands of variants; single-SNP results are partial estimates.
        Lifestyle and environment often outweigh individual genetic markers.
    </div>`;

    c.innerHTML = html;
}

// ── Section collapse/expand ───────────────────────────────────────────────────
function toggleSection(cat) {
    const body = document.getElementById('body-' + cat);
    const chev = document.getElementById('chev-' + cat);
    if (!body) return;
    const collapsed = body.classList.toggle('collapsed');
    if (chev) chev.textContent = collapsed ? '▸' : '▾';
}

function collapseAll() {
    document.querySelectorAll('.section-body').forEach(b => {
        b.classList.add('collapsed');
    });
    document.querySelectorAll('.section-chevron').forEach(c => { c.textContent = '▸'; });
    // Toggle button text
    const btn = document.querySelector('.btn-collapse-all');
    if (btn) {
        const anyCollapsed = true;
        btn.textContent = anyCollapsed ? 'Expand all' : 'Collapse all';
        btn.onclick = () => expandAll();
    }
}

function expandAll() {
    document.querySelectorAll('.section-body').forEach(b => b.classList.remove('collapsed'));
    document.querySelectorAll('.section-chevron').forEach(c => { c.textContent = '▾'; });
    const btn = document.querySelector('.btn-collapse-all');
    if (btn) { btn.textContent = 'Collapse all'; btn.onclick = () => collapseAll(); }
}

// ── Matched-only filter ───────────────────────────────────────────────────────
function filterMatchedOnly(showMatchedOnly) {
    document.querySelectorAll('.snp-card[data-matched="0"]').forEach(card => {
        card.style.display = showMatchedOnly ? 'none' : '';
    });
    // Update per-section match badge visibility
    document.querySelectorAll('.snp-grid').forEach(grid => {
        const visible = grid.querySelectorAll('.snp-card:not([style*="display: none"])').length;
        const badge = grid.closest('.trait-section')?.querySelector('.snp-match-badge');
        if (badge) badge.title = `${visible} visible`;
    });
}
