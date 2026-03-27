// =============================================
// CARRIER STATUS REPORT BUILDER
// =============================================

function buildCarrierReport(parsedSNPs) {
    let html = '';

    html += buildCysticFibrosis(parsedSNPs);
    html += buildSickleCellAndBeta(parsedSNPs);
    html += buildRecessive(parsedSNPs);

    // ═══ DISCLAIMER ═══
    html += `<div class="disclaimer" style="margin-top:32px;">
        <strong>🧬 CARRIER STATUS DISCLAIMER:</strong>
        <ul style="margin: 12px 0; padding-left: 20px;">
            <li><strong>Carrier = Heterozygous:</strong> One normal + one mutation copy. You are healthy but have a 50% chance to pass the mutation to offspring.</li>
            <li><strong>Risk to child:</strong> If both parents are carriers, ~25% chance child is affected (homozygous).</li>
            <li><strong>Genetic counseling:</strong> Discuss carrier status with a genetic counselor before planning pregnancy.</li>
            <li><strong>Limitations:</strong> Array-based carrier screening tests only common mutations. Rare variants may be missed. Clinical-grade carrier panel recommended for pregnancy planning.</li>
        </ul>
    </div>`;

    return html;
}

function buildCysticFibrosis(parsedSNPs) {
    const cfSnp = parsedSNPs['rs75527207'];

    let carrierRisk = 'Not a CF carrier';
    let detail = 'Normal homozygous genotype — low recessive risk.';
    let icon = '✅';

    if (cfSnp === 'GT' || cfSnp === 'TG') {
        carrierRisk = 'CF Carrier (Heterozygous)';
        detail = 'One CF mutation (Delta-F508 or similar). You are healthy but can pass to children. ~2% risk of affected child if partner also carrier.';
        icon = '⚠️';
    } else if (cfSnp === 'TT') {
        carrierRisk = 'Cystic Fibrosis Risk';
        detail = 'Likely homozygous or compound heterozygous for CF mutations — disease possible. Contact genetic counselor.';
        icon = '🔴';
    }

    return `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🫁</span>
            <span class="trait-section-title">Cystic Fibrosis (CFTR)</span>
        </div>
        <div class="snp-card">
            <div class="snp-emoji">${icon}</div>
            <div class="snp-info">
                <div class="snp-trait-name">CF Carrier Status</div>
                <div class="snp-prediction">${carrierRisk}</div>
                <div class="snp-detail">${detail}</div>
                <div class="snp-rsid">rs75527207 (CFTR Delta-F508) · ${cfSnp}</div>
            </div>
            <div class="snp-right"><span class="confidence-badge conf-mid">Informational</span></div>
        </div>
    </div>`;
}

function buildSickleCellAndBeta(parsedSNPs) {
    const sickleSnp = parsedSNPs['rs334'];
    const thalSnp = parsedSNPs['rs33930165'];

    let sickleRisk = 'Not a sickle cell carrier';
    let sickleDetail = 'Normal hemoglobin (HbA/HbA).';
    let sickleIcon = '✅';

    if (sickleSnp === 'AG' || sickleSnp === 'GA') {
        sickleRisk = 'Sickle Cell Trait (Carrier)';
        sickleDetail = 'One sickle cell allele (HbA/HbS). You are healthy; historically provided malaria protection in Africa. Risk of pain crises only under extreme hypoxia (high altitude, aviation).';
        sickleIcon = '⚠️';
    } else if (sickleSnp === 'GG') {
        sickleRisk = 'Sickle Cell Disease';
        sickleDetail = 'Homozygous HbS/HbS — sickle cell disease. Recurrent pain crises, hemolysis, organ damage. Requires ongoing medical care.';
        sickleIcon = '🔴';
    }

    let betaRisk = 'Not a beta-thalassemia carrier';
    let betaDetail = 'Normal beta-globin genes.';
    let betaIcon = '✅';

    if (thalSnp === 'GA' || thalSnp === 'AG') {
        betaRisk = 'Beta-Thalassemia Carrier (Trait)';
        betaDetail = 'One thalassemia mutation. You are healthy with mild anemia (microcytic); usually asymptomatic. Affects ~25% of offspring if partner is also carrier.';
        betaIcon = '⚠️';
    } else if (thalSnp === 'GG') {
        betaRisk = 'Beta-Thalassemia Major/Intermedia';
        betaDetail = 'Homozygous — thalassemia major or intermedia. Requires regular blood transfusions and chelation therapy.';
        betaIcon = '🔴';
    }

    return `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🩸</span>
            <span class="trait-section-title">Hemoglobinopathies (Sickle Cell & Thalassemia)</span>
        </div>
        <div class="snp-grid">
            <div class="snp-card">
                <div class="snp-emoji">${sickleIcon}</div>
                <div class="snp-info">
                    <div class="snp-trait-name">Sickle Cell Status</div>
                    <div class="snp-prediction">${sickleRisk}</div>
                    <div class="snp-detail">${sickleDetail}</div>
                    <div class="snp-rsid">rs334 (HBB E6V) · ${sickleSnp}</div>
                </div>
                <div class="snp-right"><span class="confidence-badge conf-high">Important</span></div>
            </div>
            <div class="snp-card">
                <div class="snp-emoji">${betaIcon}</div>
                <div class="snp-info">
                    <div class="snp-trait-name">Beta-Thalassemia Status</div>
                    <div class="snp-prediction">${betaRisk}</div>
                    <div class="snp-detail">${betaDetail}</div>
                    <div class="snp-rsid">rs33930165 (HBB) · ${thalSnp}</div>
                </div>
                <div class="snp-right"><span class="confidence-badge conf-high">Important</span></div>
            </div>
        </div>
    </div>`;
}

function buildRecessive(parsedSNPs) {
    let html = `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🧬</span>
            <span class="trait-section-title">Other Recessive Conditions</span>
        </div>
        <div class="snp-grid">`;

    // Phenylketonuria
    const pkuSnp = parsedSNPs['rs112414582'];
    let pkuStatus = '✅ Not PKU carrier';
    let pkuDetail = 'Normal PAH gene.';
    if (pkuSnp === 'GT' || pkuSnp === 'TG') {
        pkuStatus = '⚠️ PKU Carrier';
        pkuDetail = 'Carrier for phenylketonuria (inherited amino acid metabolism disorder). Normally asymptomatic.';
    }

    html += `<div class="snp-card">
        <div class="snp-emoji">🧠</div>
        <div class="snp-info">
            <div class="snp-trait-name">Phenylketonuria (PKU)</div>
            <div class="snp-prediction">${pkuStatus}</div>
            <div class="snp-detail">${pkuDetail}</div>
            <div class="snp-rsid">rs112414582 (PAH)</div>
        </div>
        <div class="snp-right"><span class="confidence-badge conf-mid">Informational</span></div>
    </div>`;

    // Gaucher Disease
    const gaucherSnp = parsedSNPs['rs11558492'];
    let gaucherStatus = '✅ Not Gaucher carrier';
    let gaucherDetail = 'Normal GBA gene.';
    if (gaucherSnp === 'CT' || gaucherSnp === 'TC') {
        gaucherStatus = '⚠️ Gaucher Disease Carrier';
        gaucherDetail = 'Carrier for Gaucher disease (lysosomal lipid storage disorder). Rare; usually asymptomatic in carriers.';
    }

    html += `<div class="snp-card">
        <div class="snp-emoji">🧬</div>
        <div class="snp-info">
            <div class="snp-trait-name">Gaucher Disease (GBA)</div>
            <div class="snp-prediction">${gaucherStatus}</div>
            <div class="snp-detail">${gaucherDetail}</div>
            <div class="snp-rsid">rs11558492 (GBA N370S)</div>
        </div>
        <div class="snp-right"><span class="confidence-badge conf-mid">Informational</span></div>
    </div>`;

    // FMF
    const fmfSnp = parsedSNPs['rs121908035'];
    let fmfStatus = '✅ Not FMF carrier';
    let fmfDetail = 'Normal MEFV gene.';
    if (fmfSnp === 'GA' || fmfSnp === 'AG') {
        fmfStatus = '⚠️ FMF Carrier';
        fmfDetail = 'Carrier for Familial Mediterranean Fever (periodic fever syndrome). Rare; carriers usually asymptomatic.';
    }

    html += `<div class="snp-card">
        <div class="snp-emoji">🌡️</div>
        <div class="snp-info">
            <div class="snp-trait-name">Familial Mediterranean Fever (MEFV)</div>
            <div class="snp-prediction">${fmfStatus}</div>
            <div class="snp-detail">${fmfDetail}</div>
            <div class="snp-rsid">rs121908035 (MEFV)</div>
        </div>
        <div class="snp-right"><span class="confidence-badge conf-mid">Informational</span></div>
    </div>`;

    // Hereditary Deafness
    const deafSnp = parsedSNPs['rs104895487'];
    let deafStatus = '✅ Not GJB2 carrier';
    let deafDetail = 'Normal connexin-26 gene.';
    if (deafSnp === 'CA' || deafSnp === 'AC') {
        deafStatus = '⚠️ Hereditary Deafness Carrier';
        deafDetail = 'Carrier for recessive hearing loss (GJB2/connexin-26). Carriers have normal hearing; ~25% affected child if both parents carriers.';
    }

    html += `<div class="snp-card">
        <div class="snp-emoji">👂</div>
        <div class="snp-info">
            <div class="snp-trait-name">Hereditary Deafness (GJB2)</div>
            <div class="snp-prediction">${deafStatus}</div>
            <div class="snp-detail">${deafDetail}</div>
            <div class="snp-rsid">rs104895487 (GJB2)</div>
        </div>
        <div class="snp-right"><span class="confidence-badge conf-mid">Informational</span></div>
    </div>`;

    html += '</div></div>';
    return html;
}
