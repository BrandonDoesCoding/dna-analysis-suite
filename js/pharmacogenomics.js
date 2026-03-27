// =============================================
// PHARMACOGENOMICS REPORT BUILDER
// =============================================

// Returns HTML string — caller appends to DOM (avoids repeated innerHTML += reflows)
function buildPharmacoHTML(parsedSNPs) {
    return buildDrugMetabolismSection(parsedSNPs)
        + buildAnticoagulantSection(parsedSNPs)
        + buildAdverseDrugReactionSection(parsedSNPs)
        + buildBloodTypeSection(parsedSNPs)
        + `<div class="disclaimer" style="margin-top:32px;">
        <strong>⚖️ PHARMACOGENOMICS DISCLAIMER:</strong> Educational only — NOT medical advice.
        <ul style="margin: 12px 0; padding-left: 20px;">
            <li>Always consult your physician or pharmacist before making ANY medication changes</li>
            <li>Genetic variants interact with age, liver/kidney function, and other factors</li>
            <li>Dosing decisions require professional clinical judgment, not genetic results alone</li>
            <li>Guidelines evolve — confirm clinical decisions against current CPIC guidelines</li>
        </ul>
    </div>`;
}

// Legacy shim — kept for compatibility if called directly
function buildPharmacoReport(parsedSNPs) {
    const c = document.getElementById('healthSections');
    if (c) c.insertAdjacentHTML('beforeend', buildPharmacoHTML(parsedSNPs));
}

function buildDrugMetabolismSection(parsedSNPs) {
    let html = `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">💊</span>
            <span class="trait-section-title">CYP450 Drug Metabolism</span>
        </div>
        <div class="snp-grid">`;

    // CYP2C9 (Warfarin, NSAIDs)
    const cyp2c9_status = analyzeCYP2C9(parsedSNPs);
    html += `<div class="snp-card">
        <div class="snp-emoji">💊</div>
        <div class="snp-info">
            <div class="snp-trait-name">CYP2C9 Status</div>
            <div class="snp-prediction">${cyp2c9_status.pred}</div>
            <div class="snp-detail">
                <strong>Affected drugs:</strong> Warfarin, NSAIDs (ibuprofen, naproxen), sulfonylureas, phenytoin<br/>
                <strong>Implication:</strong> ${cyp2c9_status.implication}
            </div>
            <div class="snp-rsid">${cyp2c9_status.snps}</div>
        </div>
        <div class="snp-right"><span class="confidence-badge conf-high">Clinical</span></div>
    </div>`;

    // CYP2C19 (Clopidogrel, PPIs, SSRIs)
    const cyp2c19_status = analyzeCYP2C19(parsedSNPs);
    html += `<div class="snp-card">
        <div class="snp-emoji">💊</div>
        <div class="snp-info">
            <div class="snp-trait-name">CYP2C19 Status (Clopidogrel)</div>
            <div class="snp-prediction">${cyp2c19_status.pred}</div>
            <div class="snp-detail">
                <strong>Affected drugs:</strong> Clopidogrel (Plavix), omeprazole, PPIs, SSRIs (sertraline, citalopram)<br/>
                <strong>Implication:</strong> ${cyp2c19_status.implication}
            </div>
            <div class="snp-rsid">rs4244285 (CYP2C19*2)</div>
        </div>
        <div class="snp-right"><span class="confidence-badge conf-high">Clinical</span></div>
    </div>`;

    // CYP2B6 (Efavirenz, Bupropion)
    const cyp2b6_stat = parsedSNPs['rs681744'];
    const cyp2b6_pred = cyp2b6_stat === 'TT' ? 'Extensive metabolizer' : cyp2b6_stat === 'GA' || cyp2b6_stat === 'AG' ? 'Intermediate metabolizer' : 'Poor metabolizer';
    html += `<div class="snp-card">
        <div class="snp-emoji">💊</div>
        <div class="snp-info">
            <div class="snp-trait-name">CYP2B6 (Efavirenz)</div>
            <div class="snp-prediction">${cyp2b6_pred}</div>
            <div class="snp-detail">
                <strong>Affected drugs:</strong> Efavirenz (HIV), bupropion (Wellbutrin), methadone<br/>
                <strong>Note:</strong> Poor metabolizers risk CNS toxicity with efavirenz
            </div>
            <div class="snp-rsid">rs681744</div>
        </div>
        <div class="snp-right"><span class="confidence-badge conf-mid">Clinical</span></div>
    </div>`;

    html += '</div></div>';
    return html;
}

function analyzeCYP2C9(parsedSNPs) {
    const rs1065852 = parsedSNPs['rs1065852']; // Functional
    const rs1057910 = parsedSNPs['rs1057910']; // *3 allele

    let activity = 100; // Normal = 100%
    let starType = '*1/*1';
    let implication = 'Normal warfarin sensitivity. Standard dosing appropriate.';

    if (rs1057910 === 'AA') {
        activity = 10;
        starType = '*3/*3 (poor)';
        implication = 'POOR metabolizer (~10% activity). High bleeding risk with warfarin. Start low dose (3-5mg), monitor INR closely. Consider alternatives.';
    } else if (rs1057910 === 'GA' || rs1057910 === 'AG') {
        activity = 30;
        starType = '*1/*3 (intermediate)';
        implication = 'INTERMEDIATE metabolizer. Reduce warfarin dose by 20-30%. Monitor INR frequently.';
    } else if (rs1065852 === 'TT' || rs1065852 === 'CT') {
        activity = 50;
        starType = '*1/*2 (intermediate)';
        implication = 'Slightly reduced CYP2C9 activity. May need 10-20% dose reduction.';
    }

    return {
        pred: starType,
        activity: activity,
        implication: implication,
        snps: 'rs1065852 · rs1057910'
    };
}

function analyzeCYP2C19(parsedSNPs) {
    const rs4244285 = parsedSNPs['rs4244285']; // CYP2C19*2 (poor metabolizer allele)

    let phenotype = 'Extensive metabolizer';
    let implication = 'Normal clopidogrel activation. Standard dosing. PPIs safe.';

    if (rs4244285 === 'AA') {
        phenotype = 'Poor metabolizer (*2/*2)';
        implication = '⚠️ CRITICAL: Clopidogrel NOT converted to active form — INEFFECTIVE for stents. Switch to prasugrel or ticagrelor. Avoid PPIs (omeprazole, lansoprazole).';
    } else if (rs4244285 === 'GA' || rs4244285 === 'AG') {
        phenotype = 'Intermediate metabolizer (*1/*2)';
        implication = 'Reduced clopidogrel activation (~50% activity). Consider prasugrel/ticagrelor for stents. Avoid strong PPIs.';
    }

    return {
        pred: phenotype,
        implication: implication,
        snps: 'rs4244285'
    };
}

function buildAnticoagulantSection(parsedSNPs) {
    const vkorc1 = parsedSNPs['rs1801028'];
    let html = `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🩸</span>
            <span class="trait-section-title">Anticoagulation (Warfarin)</span>
        </div>
        <div class="snp-grid">`;

    let warfarinSens = 'Normal sensitivity';
    let warfarinNote = 'Standard warfarin dosing (5-10mg daily expected).';

    if (vkorc1 === 'AA') {
        warfarinSens = 'HIGH sensitivity (VKORC1*2)';
        warfarinNote = '⚠️ SENSITIVE to warfarin. Start VERY LOW (2-4mg), increase slowly. Target INR may require 2-5mg weekly dose. Increased bleeding risk.';
    } else if (vkorc1 === 'GA' || vkorc1 === 'AG') {
        warfarinSens = 'Intermediate sensitivity';
        warfarinNote = 'Moderately sensitive. Reduce standard dose by 20-30%. Monitor INR every 2-3 days initially.';
    }

    html += `<div class="snp-card">
        <div class="snp-emoji">⚕️</div>
        <div class="snp-info">
            <div class="snp-trait-name">VKORC1 (Warfarin Sensitivity)</div>
            <div class="snp-prediction">${warfarinSens}</div>
            <div class="snp-detail">${warfarinNote}</div>
            <div class="snp-rsid">rs1801028 (VKORC1 -1639G>A)</div>
        </div>
        <div class="snp-right"><span class="confidence-badge conf-high">Clinical ⚠️</span></div>
    </div>`;

    html += '</div></div>';
    return html;
}

function buildAdverseDrugReactionSection(parsedSNPs) {
    let html = `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🚫</span>
            <span class="trait-section-title">Severe Drug Reactions (HLA-Based)</span>
        </div>
        <div class="snp-grid">`;

    // HLA-A*31:01 (Carbamazepine)
    const hlaA31 = parsedSNPs['rs3099386'];
    if (hlaA31 === 'AA') {
        html += `<div class="snp-card" style="background-color: #8B0000; color: white;">
            <div class="snp-emoji">🚫</div>
            <div class="snp-info">
                <div class="snp-trait-name">HLA-A*31:01 (Carbamazepine SJS/TEN)</div>
                <div class="snp-prediction">POSITIVE — CONTRAINDICATED</div>
                <div class="snp-detail">
                    <strong>⚠️ SEVERE:</strong> Stevens-Johnson Syndrome / Toxic Epidermal Necrolysis risk<br/>
                    <strong>AVOID:</strong> Carbamazepine, oxcarbazepine (cross-reactivity)<br/>
                    <strong>Alternatives:</strong> Lamotrigine, valproate, levetiracetam
                </div>
                <div class="snp-rsid">rs3099386</div>
            </div>
            <div class="snp-right"><span class="confidence-badge" style="background: #FF6347;">CRITICAL</span></div>
        </div>`;
    }

    // HLA-B*15:02 (Carbamazepine in SE Asian)
    const hlaB1502 = parsedSNPs['rs1800944'];
    if (hlaB1502 === 'AA') {
        html += `<div class="snp-card" style="background-color: #8B0000; color: white;">
            <div class="snp-emoji">🚫</div>
            <div class="snp-info">
                <div class="snp-trait-name">HLA-B*15:02 (Carbamazepine SJS/TEN)</div>
                <div class="snp-prediction">POSITIVE — CONTRAINDICATED</div>
                <div class="snp-detail">
                    <strong>⚠️ CRITICAL in Han Chinese & SE Asians:</strong> Very high SJS/TEN risk with carbamazepine<br/>
                    <strong>AVOID:</strong> Carbamazepine completely<br/>
                    <strong>Alternatives:</strong> Different anticonvulsant (lamotrigine, valproate, etc.)
                </div>
                <div class="snp-rsid">rs1800944 (HLA-B*15:02)</div>
            </div>
            <div class="snp-right"><span class="confidence-badge" style="background: #FF6347;">CRITICAL</span></div>
        </div>`;
    }

    // HLA-B*58:01 (Allopurinol)
    const hlaB5801 = parsedSNPs['rs3135501'];
    if (hlaB5801 === 'AA') {
        html += `<div class="snp-card" style="background-color: #8B0000; color: white;">
            <div class="snp-emoji">🚫</div>
            <div class="snp-info">
                <div class="snp-trait-name">HLA-B*58:01 (Allopurinol SJS/TEN)</div>
                <div class="snp-prediction">POSITIVE — CONTRAINDICATED</div>
                <div class="snp-detail">
                    <strong>⚠️ SEVERE:</strong> SJS/TEN risk with allopurinol<br/>
                    <strong>AVOID:</strong> Allopurinol<br/>
                    <strong>Alternatives:</strong> Febuxostat (Uloric) for gout urate-lowering therapy
                </div>
                <div class="snp-rsid">rs3135501 (HLA-B*58:01)</div>
            </div>
            <div class="snp-right"><span class="confidence-badge" style="background: #FF6347;">CRITICAL</span></div>
        </div>`;
    }

    // HLA-B*57:01 (Abacavir)
    const hlaB5701 = parsedSNPs['rs2042052'];
    if (hlaB5701 === 'AA') {
        html += `<div class="snp-card" style="background-color: #8B0000; color: white;">
            <div class="snp-emoji">🚫</div>
            <div class="snp-info">
                <div class="snp-trait-name">HLA-B*57:01 (Abacavir Hypersensitivity)</div>
                <div class="snp-prediction">POSITIVE — CONTRAINDICATED</div>
                <div class="snp-detail">
                    <strong>⚠️ SEVERE:</strong> Abacavir hypersensitivity syndrome (fever, rash, GI, liver damage)<br/>
                    <strong>AVOID:</strong> Abacavir (AIDS drug)<br/>
                    <strong>Alternatives:</strong> Other antiretrovirals (integrase inhibitors, PI, etc.)
                </div>
                <div class="snp-rsid">rs2042052 (HLA-B*57:01)</div>
            </div>
            <div class="snp-right"><span class="confidence-badge" style="background: #FF6347;">CRITICAL</span></div>
        </div>`;
    }

    if (hlaA31 !== 'AA' && hlaB1502 !== 'AA' && hlaB5801 !== 'AA' && hlaB5701 !== 'AA') {
        html += `<div class="snp-card">
            <div class="snp-emoji">✅</div>
            <div class="snp-info">
                <div class="snp-trait-name">No Critical HLA Contraindications</div>
                <div class="snp-prediction">No severe drug reaction risks detected</div>
                <div class="snp-detail">You don't carry the high-risk HLA alleles for carbamazepine, allopurinol, or abacavir.</div>
            </div>
        </div>`;
    }

    html += '</div></div>';
    return html;
}

function buildBloodTypeSection(parsedSNPs) {
    // Decode blood type from SNPs
    const rs8176695 = parsedSNPs['rs8176695']; // RhD
    const rs8176746 = parsedSNPs['rs8176746']; // ABO B allele
    const rs8176719 = parsedSNPs['rs8176719']; // ABO O allele

    let rhType = 'Unknown';
    let aboType = 'Unknown';

    // RhD typing
    if (rs8176695 === 'GG' || rs8176695 === 'GA') {
        rhType = 'Rh D Positive (+)';
    } else if (rs8176695 === 'AA') {
        rhType = 'Rh D Negative (-)';
    }

    // ABO typing (simplified)
    if (rs8176746 === 'TT' || rs8176746 === 'GG') {
        aboType = 'Type B';
    } else if (rs8176719 === 'CT' || rs8176719 === 'AT') {
        aboType = 'Type O';
    } else {
        aboType = 'Type A or AB (check other markers)';
    }

    let html = `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🩸</span>
            <span class="trait-section-title">Blood Type & Transfusion</span>
        </div>
        <div class="snp-grid">
            <div class="snp-card">
                <div class="snp-emoji">🩸</div>
                <div class="snp-info">
                    <div class="snp-trait-name">Blood Type (Predicted)</div>
                    <div class="snp-prediction">${aboType} ${rhType}</div>
                    <div class="snp-detail">
                        <strong>Prediction based on:</strong> SNP markers rs8176746, rs8176719, rs8176695<br/>
                        <strong>Note:</strong> Array SNPs are proxies. For transfusion, medical-grade blood typing is required.
                    </div>
                    <div class="snp-rsid">rs8176746 · rs8176719 · rs8176695</div>
                </div>
                <div class="snp-right"><span class="confidence-badge conf-mid">Informational</span></div>
            </div>
        </div>
    </div>`;

    return html;
}
