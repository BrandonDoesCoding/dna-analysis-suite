// =============================================
// HAPLOGROUP DETECTION & REPORTING
// =============================================
// IMPORTANT: Consumer SNP arrays (23andMe, AncestryDNA, MyHeritage, FTDNA)
// cannot reliably determine Y-DNA haplogroups from autosomal rs numbers.
// The Y-chromosome markers (M269, M343, M170, etc.) are NOT standard
// autosomal SNPs — they require reading actual Y-chromosome positions.
// Previous versions used rs numbers (rs9786153, rs9786184, etc.) that
// appeared to correspond to Y-DNA markers but were actually triggering
// on common autosomal genotypes, producing false positives.
//
// For accurate Y-DNA haplogroup determination, use:
//  - FamilyTreeDNA Big Y-700
//  - YFull (upload BAM/FASTQ)
//  - Cladefinder (free Y-SNP predictor)
//  - ISOGG Y-DNA Haplogroup Tree
// =============================================

function buildHaplotypSection(parsedSNPs) {
    return `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🧬</span>
            <span class="trait-section-title">Y-DNA Haplogroup (Patrilineal Lineage)</span>
        </div>
        <div class="haplogroup-card">
            <div class="haplogroup-main">Use Dedicated Tools</div>
            <div class="haplogroup-detail">
                Consumer SNP arrays (23andMe, AncestryDNA, MyHeritage, FTDNA, LivingDNA)
                <strong>cannot reliably determine Y-DNA or mtDNA haplogroups</strong> from
                autosomal genotype data alone. The Y-chromosome and mitochondrial markers
                require specialized sequencing or targeted SNP panels.
            </div>
            <div style="margin-top:16px; display:flex; flex-direction:column; gap:8px;">
                <div style="font-size:0.9rem; font-weight:700; color:var(--txw); margin-bottom:4px;">Recommended tools:</div>
                <a href="https://cladefinder.yseq.net/" target="_blank" style="color:var(--pri-l); font-size:0.85rem;">
                    🔬 Cladefinder — Free Y-SNP haplogroup predictor
                </a>
                <a href="https://www.familytreedna.com/products/y-dna" target="_blank" style="color:var(--pri-l); font-size:0.85rem;">
                    🧪 FamilyTreeDNA Big Y-700 — Deep Y-DNA sequencing
                </a>
                <a href="https://www.yseq.net/" target="_blank" style="color:var(--pri-l); font-size:0.85rem;">
                    📊 YSEQ — Y-SNP testing
                </a>
                <a href="https://dna.jameslick.com/mthap/" target="_blank" style="color:var(--pri-l); font-size:0.85rem;">
                    🧬 James Lick's mthap — mtDNA haplogroup prediction
                </a>
            </div>
        </div>
        <div class="disclaimer" style="margin-top:16px;">
            <strong>Why can't this tool predict your haplogroup?</strong>
            Y-DNA haplogroups are determined by mutations on the Y chromosome (inherited father → son).
            Consumer DNA chips genotype ~600K–900K autosomal SNPs but only include a small, incomplete
            subset of Y-chromosome positions. The rs numbers sometimes associated with haplogroup-defining
            mutations (like M269, M343, M170) often map to unrelated autosomal loci in consumer data,
            producing false positives — e.g., showing "R1b" for someone who is actually E1b.
            Dedicated Y-DNA tests sequence thousands of Y-chromosome positions and use phylogenetic
            tree placement for accurate subclade assignment.
        </div>
    </div>`;
}

// ── Neanderthal Ancestry Estimate ────────────────────────────────

function buildNeanderthalSection(parsedSNPs) {
    // Check known Neanderthal introgression markers
    const neanderSNPs = Object.entries(SNP_DB).filter(([, v]) => v.category === 'ancestry');
    let nSignals = 0, nTotal = 0;

    neanderSNPs.forEach(([rsid]) => {
        const g = parsedSNPs[rsid];
        if (!g || g === '--') return;
        nTotal++;
        const r = SNP_DB[rsid].interpret(g);
        if (r.emoji === '🧬') nSignals += 2;
        else if (r.emoji === '🔸') nSignals += 1;
    });

    // Estimate: average non-African is ~2%, range 1–4%
    let pct, label;
    if (nTotal === 0) {
        pct = '~2%'; label = 'Estimated (no introgression markers genotyped — using population average for non-African ancestry)';
    } else {
        const ratio = nSignals / (nTotal * 2);
        const est = (1.5 + ratio * 3).toFixed(1);
        pct = est + '%';
        label = `Based on ${nTotal} introgression marker${nTotal > 1 ? 's' : ''} in your file`;
    }

    return `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🦴</span>
            <span class="trait-section-title">Neanderthal Ancestry</span>
        </div>
        <div class="neanderthal-card">
            <div class="neanderthal-percent">${pct}</div>
            <div class="neanderthal-detail">${label}</div>
            <div class="neanderthal-note">
                Modern non-African humans carry ~1.5–2.1% Neanderthal DNA on average.
                Neanderthal variants influence immune response, skin/hair pigmentation, pain sensitivity,
                and sleep chronotype. Higher-than-average Neanderthal ancestry is common in European
                and East Asian populations. For precise estimates, use 23andMe's Neanderthal Ancestry
                report or dedicated ancient DNA analysis tools.
            </div>
        </div>
    </div>`;
}
