// =============================================
// DISEASE RISK & POLYGENIC SCORE BUILDER
// =============================================

function buildDiseaseRiskReport(parsedSNPs) {
    let html = '';

    html += buildCardiovascularRisk(parsedSNPs);
    html += buildMetabolicRisk(parsedSNPs);
    html += buildNeuroDegenerative(parsedSNPs);

    // Disclaimer
    html += `<div class="disclaimer" style="margin-top:32px;">
        <strong>⚠️ DISEASE RISK DISCLAIMER:</strong>
        <ul style="margin: 12px 0; padding-left: 20px;">
            <li><strong>Genetic risk ≠ destiny:</strong> These polygenic scores capture ~10-20% of disease risk. Environment, lifestyle, and other unmeasured genetic factors matter MORE.</li>
            <li><strong>Not diagnostic:</strong> Elevated risk does NOT mean you will develop disease. Conversely, low risk doesn't guarantee protection.</li>
            <li><strong>Actionable if high:</strong> If you have high genetic risk, discuss screening and prevention strategies with your doctor.</li>
            <li><strong>Population-specific:</strong> Scores validated mainly in European ancestry. Accuracy may differ for other populations.</li>
            <li><strong>Evolving science:</strong> As more SNPs are discovered, scores become more accurate. This estimate will improve over time.</li>
        </ul>
    </div>`;

    return html;
}

function buildCardiovascularRisk(parsedSNPs) {
    // Simple CAD & MI risk scoring
    const rs1333049 = parsedSNPs['rs1333049'];  // CDKN2B (CAD)
    const rs11191580 = parsedSNPs['rs11191580']; // PSAP/SORT1 (MI)
    const rs1476413 = parsedSNPs['rs1476413'];   // PSRC1 (CAD/MI)
    const rs495828 = parsedSNPs['rs495828'];     // LDL cholesterol

    let cadRisk = 'Typical';
    let cadScore = 0;
    let cadDetail = '';

    // Simple scoring
    if (rs1333049 === 'GG') cadScore += 1;
    if (rs11191580 === 'TT') cadScore += 1;
    if (rs495828 === 'AA') cadScore += 1;

    if (cadScore >= 3) {
        cadRisk = 'Higher CAD Risk';
        cadDetail = '3+ risk alleles detected. Estimated 20-40% lifetime risk of coronary artery disease (vs. ~10% baseline). Consider aggressive lipid management, regular cardiology screening, exercise program.';
    } else if (cadScore >= 1) {
        cadRisk = 'Moderate CAD Risk';
        cadDetail = '1-2 risk alleles. Estimated 10-15% lifetime CAD risk. Standard cardiovascular prevention (exercise, healthy diet, BP control) important.';
    } else {
        cadRisk = 'Lower CAD Risk';
        cadDetail = 'Few CAD risk alleles detected. Baseline CAD risk ~5-10%. Maintain healthy lifestyle for further protection.';
    }

    return `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">❤️</span>
            <span class="trait-section-title">Cardiovascular Disease Risk</span>
        </div>
        <div class="snp-grid">
            <div class="snp-card">
                <div class="snp-emoji">❤️</div>
                <div class="snp-info">
                    <div class="snp-trait-name">Coronary Artery Disease (CAD) Risk</div>
                    <div class="snp-prediction">${cadRisk}</div>
                    <div class="snp-detail">
                        ${cadDetail}<br/><br/>
                        <strong>Key SNPs:</strong> rs1333049 (CDKN2B), rs11191580 (LDL), rs495828 (cholesterol)<br/>
                        <strong>Modifiable factors:</strong> Exercise, Mediterranean diet, stress management, smoking cessation, BP/cholesterol control
                    </div>
                    <div class="snp-rsid">rs1333049 · rs11191580 · rs495828</div>
                </div>
                <div class="snp-right"><span class="confidence-badge conf-mid">Polygenic Score</span></div>
            </div>
        </div>
    </div>`;
}

function buildMetabolicRisk(parsedSNPs) {
    // Type 2 Diabetes & Metabolic Syndrome
    const rs7903146 = parsedSNPs['rs7903146'];   // TCF7L2 (strong T2D signal)
    const rs9991328 = parsedSNPs['rs9991328'];   // Insulin resistance
    const rs10757278 = parsedSNPs['rs10757278']; // Obesity

    let t2dRisk = 'Lower risk';
    let t2dScore = 0;
    let t2dDetail = '';

    if (rs7903146 === 'TT') t2dScore += 2; // TCF7L2 is strong signal
    if (rs9991328 === 'TT') t2dScore += 1;
    if (rs10757278 === 'AA') t2dScore += 1;

    if (t2dScore >= 4) {
        t2dRisk = 'Higher Type 2 Diabetes Risk';
        t2dDetail = 'Multiple metabolic risk alleles detected. TCF7L2 risk genotype is strong signal. Estimated 30-50% lifetime T2D risk (vs. 15-20% baseline). Exercise and weight management critical for prevention.';
    } else if (t2dScore >= 2) {
        t2dRisk = 'Moderate Type 2 Diabetes Risk';
        t2dDetail = 'Some risk alleles detected. Estimated 15-25% T2D risk. Weight, exercise, and diet matter significantly.';
    } else {
        t2dRisk = 'Lower Type 2 Diabetes Risk';
        t2dDetail = 'Fewer risk alleles detected. Baseline T2D risk ~10-15%. Continue healthy lifestyle to maintain protection.';
    }

    let bmiRisk = 'Average BMI tendency';
    if (rs10757278 === 'AA') {
        bmiRisk = 'Higher BMI/Obesity Risk (~+6-7kg)';
    } else if (rs10757278 === 'GA' || rs10757278 === 'AG') {
        bmiRisk = 'Mild BMI increase (~+3kg tendency)';
    }

    return `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🏥</span>
            <span class="trait-section-title">Metabolic & Obesity Risk</span>
        </div>
        <div class="snp-grid">
            <div class="snp-card">
                <div class="snp-emoji">🩺</div>
                <div class="snp-info">
                    <div class="snp-trait-name">Type 2 Diabetes Risk</div>
                    <div class="snp-prediction">${t2dRisk}</div>
                    <div class="snp-detail">
                        ${t2dDetail}<br/><br/>
                        <strong>Key SNP:</strong> rs7903146 (TCF7L2) — strongest T2D locus in genome<br/>
                        <strong>Prevention:</strong> Regular exercise (150+ min/week), weight loss if overweight, reduce processed sugars, increase fiber
                    </div>
                    <div class="snp-rsid">rs7903146 (TCF7L2) · rs9991328 · rs10757278</div>
                </div>
                <div class="snp-right"><span class="confidence-badge conf-high">Well-replicated</span></div>
            </div>
            <div class="snp-card">
                <div class="snp-emoji">⚖️</div>
                <div class="snp-info">
                    <div class="snp-trait-name">BMI / Weight Tendency</div>
                    <div class="snp-prediction">${bmiRisk}</div>
                    <div class="snp-detail">
                        This is a TENDENCY, not destiny. Environmental factors (diet, activity) typically dominate genetic effects.<br/><br/>
                        <strong>Strategy:</strong> If you carry risk alleles, expect weight gain easier than average — compensate with extra exercise or careful diet.
                    </div>
                    <div class="snp-rsid">rs10757278 (FTO)</div>
                </div>
                <div class="snp-right"><span class="confidence-badge conf-mid">Polygenic</span></div>
            </div>
        </div>
    </div>`;
}

function buildNeuroDegenerative(parsedSNPs) {
    // Alzheimer's Disease Risk
    const rs429358 = parsedSNPs['rs429358'];     // APOE ε4 status
    const rs7412 = parsedSNPs['rs7412'];         // APOE ε2 status
    const rs2802292 = parsedSNPs['rs2802292'];   // FOXO3 longevity

    let apoeStatus = 'ε3/ε3 (typical)';
    let apoeRisk = 'Baseline Alzheimer\'s risk';
    let apoeDetail = 'No APOE ε4 alleles. Standard ~5-10% lifetime AD risk by age 85.';

    // Simple APOE interpretation (note: this is crude; full APOE determination needs two SNPs)
    if (rs429358 === 'CC') {
        apoeStatus = 'ε4/ε4 (homozygous)';
        apoeRisk = '⚠️ Much Higher Alzheimer\'s Risk';
        apoeDetail = 'Two ε4 alleles. Estimated 30-50% lifetime AD risk by age 85 (without intervention). Highly modifiable: exercise, cognitive training, Mediterranean diet, sleep, cognitive reserve crucial.';
    } else if (rs429358 === 'CT' || rs429358 === 'TC') {
        apoeStatus = 'ε3/ε4 (heterozygous)';
        apoeRisk = 'Moderately Higher Alzheimer\'s Risk';
        apoeDetail = 'One ε4 allele. Estimated 15-20% lifetime AD risk by age 85. Strong lifestyle modifications (exercise, cognitive engagement, sleep) reduce risk.';
    } else if (rs7412 === 'TT') {
        apoeStatus = 'ε2/ε2 (protective)';
        apoeRisk = 'Lower Alzheimer\'s Risk';
        apoeDetail = 'Carrying ε2 is protective. Lower AD risk (~2-3%). Longevity-associated.';
    }

    return `<div class="trait-section fade-in">
        <div class="trait-section-header">
            <span class="trait-section-icon">🧠</span>
            <span class="trait-section-title">Neurodegeneration Risk</span>
        </div>
        <div class="snp-grid">
            <div class="snp-card">
                <div class="snp-emoji">🧠</div>
                <div class="snp-info">
                    <div class="snp-trait-name">Alzheimer's Disease Risk (APOE Status)</div>
                    <div class="snp-prediction">${apoeStatus}</div>
                    <div class="snp-detail">
                        ${apoeRisk}<br/><br/>
                        ${apoeDetail}<br/><br/>
                        <strong>Modifiable protective factors:</strong><br/>
                        • Regular aerobic exercise (3-5x/week)<br/>
                        • Cognitive engagement (learning, puzzles, social interaction)<br/>
                        • Sleep optimization (7-9 hours, consistent schedule)<br/>
                        • Mediterranean-DASH diet<br/>
                        • Blood pressure & cholesterol control<br/>
                        • Manage hearing loss (if present)
                    </div>
                    <div class="snp-rsid">rs429358 (APOE ε4) · rs7412 (APOE ε2)</div>
                </div>
                <div class="snp-right"><span class="confidence-badge conf-high">Well-established</span></div>
            </div>
        </div>
    </div>`;
}
