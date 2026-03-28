// =============================================
// DISEASE RISK & POLYGENIC SCORE BUILDER
// =============================================

function buildDiseaseRiskReport(parsedSNPs) {
    let html = '';

    html += buildLifeExpectancyEstimate(parsedSNPs);
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

// =============================================
// LIFE EXPECTANCY ESTIMATE
// =============================================
function buildLifeExpectancyEstimate(parsedSNPs) {
    // Base: US average life expectancy
    let base = 79;
    let delta = 0;
    const factors = [];

    // --- FOXO3 longevity gene (rs2802292) ---
    const foxo3 = parsedSNPs['rs2802292'];
    if (foxo3 === 'GG') {
        delta += 3;
        factors.push({ icon: '✅', label: 'FOXO3 (rs2802292)', val: '+3 yrs', note: 'GG genotype — strongest replicated longevity locus. Associated with centenarian lifespan.', color: 'green' });
    } else if (foxo3 === 'GT' || foxo3 === 'TG') {
        delta += 1.5;
        factors.push({ icon: '✅', label: 'FOXO3 (rs2802292)', val: '+1.5 yrs', note: 'GT genotype — partial longevity benefit.', color: 'green' });
    } else if (foxo3) {
        factors.push({ icon: '➖', label: 'FOXO3 (rs2802292)', val: '±0 yrs', note: 'TT genotype — no longevity allele.', color: 'neutral' });
    }

    // --- APOE status (rs429358 + rs7412) ---
    const apoe4 = parsedSNPs['rs429358'];
    const apoe2 = parsedSNPs['rs7412'];
    if (apoe4 === 'CC') {
        delta -= 5;
        factors.push({ icon: '⚠️', label: 'APOE ε4/ε4 (rs429358)', val: '−5 yrs', note: 'Homozygous ε4 — highest AD & cardiovascular risk genotype. Strongly modifiable via lifestyle.', color: 'red' });
    } else if (apoe4 === 'CT' || apoe4 === 'TC') {
        delta -= 2;
        factors.push({ icon: '🔶', label: 'APOE ε3/ε4 (rs429358)', val: '−2 yrs', note: 'One ε4 allele. Moderate AD/CVD risk. Lifestyle can substantially offset this.', color: 'amber' });
    } else if (apoe2 === 'TT') {
        delta += 2;
        factors.push({ icon: '✅', label: 'APOE ε2/ε2 (rs7412)', val: '+2 yrs', note: 'ε2 is protective — lowest AD risk APOE genotype. Associated with longevity.', color: 'green' });
    } else if (apoe2 === 'CT' || apoe2 === 'TC') {
        delta += 1;
        factors.push({ icon: '✅', label: 'APOE ε2/ε3 (rs7412)', val: '+1 yr', note: 'Partial ε2 protection. Slightly lower AD & cardiovascular risk.', color: 'green' });
    }

    // --- Cardiovascular: CDKN2B (rs1333049) ---
    const cad = parsedSNPs['rs1333049'];
    if (cad === 'GG') {
        delta -= 2;
        factors.push({ icon: '🔶', label: 'CAD Risk (rs1333049)', val: '−2 yrs', note: 'GG genotype at CDKN2B — elevated coronary artery disease risk allele.', color: 'amber' });
    } else if (cad === 'CG' || cad === 'GC') {
        delta -= 1;
        factors.push({ icon: '➖', label: 'CAD Risk (rs1333049)', val: '−1 yr', note: 'Heterozygous CDKN2B. Moderate CAD signal.', color: 'amber' });
    } else if (cad) {
        factors.push({ icon: '✅', label: 'CAD Risk (rs1333049)', val: '±0 yrs', note: 'CC genotype — lower CAD risk allele burden.', color: 'green' });
    }

    // --- T2D: TCF7L2 (rs7903146) ---
    const t2d = parsedSNPs['rs7903146'];
    if (t2d === 'TT') {
        delta -= 2;
        factors.push({ icon: '🔶', label: 'Diabetes Risk (TCF7L2)', val: '−2 yrs', note: 'TT at TCF7L2 — strongest T2D risk allele. Diet and exercise significantly reduce impact.', color: 'amber' });
    } else if (t2d === 'CT' || t2d === 'TC') {
        delta -= 1;
        factors.push({ icon: '➖', label: 'Diabetes Risk (TCF7L2)', val: '−1 yr', note: 'Heterozygous TCF7L2. Moderate T2D risk.', color: 'amber' });
    } else if (t2d) {
        factors.push({ icon: '✅', label: 'Diabetes Risk (TCF7L2)', val: '±0 yrs', note: 'CC genotype — lower TCF7L2 T2D risk.', color: 'green' });
    }

    // --- Obesity: FTO (rs10757278) ---
    const fto = parsedSNPs['rs10757278'];
    if (fto === 'AA') {
        delta -= 1.5;
        factors.push({ icon: '🔶', label: 'Obesity Risk (FTO)', val: '−1.5 yrs', note: 'AA at FTO — highest obesity allele burden. ~6-7kg weight tendency above average.', color: 'amber' });
    } else if (fto === 'GA' || fto === 'AG') {
        delta -= 0.5;
        factors.push({ icon: '➖', label: 'Obesity Risk (FTO)', val: '−0.5 yr', note: 'Heterozygous FTO. Mild weight gain tendency.', color: 'neutral' });
    } else if (fto) {
        factors.push({ icon: '✅', label: 'Obesity Risk (FTO)', val: '±0 yrs', note: 'GG genotype — no elevated FTO obesity risk.', color: 'green' });
    }

    // --- CETP / HDL (rs708272) ---
    const cetp = parsedSNPs['rs708272'];
    if (cetp === 'AA') {
        delta += 1;
        factors.push({ icon: '✅', label: 'HDL Cholesterol (CETP)', val: '+1 yr', note: 'AA at CETP — higher HDL cholesterol tendency. Cardioprotective.', color: 'green' });
    } else if (cetp === 'AG' || cetp === 'GA') {
        factors.push({ icon: '➖', label: 'HDL Cholesterol (CETP)', val: '±0 yrs', note: 'Heterozygous CETP. Average HDL effect.', color: 'neutral' });
    }

    // Final estimate (always shown as a range ±4 years)
    const est   = Math.round(base + delta);
    const low   = est - 4;
    const high  = est + 4;
    const pct   = Math.min(100, Math.max(0, ((est - 60) / 50) * 100)); // 60–110 scale
    const genotyped = factors.length;

    // Colour thematic
    let gaugeColor, outlook, outlookIcon;
    if (delta >= 3)        { gaugeColor = '#10B981'; outlook = 'Favorable';   outlookIcon = '🌟'; }
    else if (delta >= 0)   { gaugeColor = '#6C3AED'; outlook = 'Average';     outlookIcon = '✅'; }
    else if (delta >= -3)  { gaugeColor = '#F59E0B'; outlook = 'Moderate risk'; outlookIcon = '🔶'; }
    else                   { gaugeColor = '#EF4444'; outlook = 'Elevated risk'; outlookIcon = '⚠️'; }

    const factorRows = factors.length
        ? factors.map(f => {
            const chip = f.color === 'green' ? 'conf-high' : f.color === 'red' ? 'conf-low' : f.color === 'amber' ? 'conf-mid' : 'conf-low';
            return `<div class="le-factor-row">
                <span class="le-factor-icon">${f.icon}</span>
                <div class="le-factor-info">
                    <span class="le-factor-label">${f.label}</span>
                    <span class="le-factor-note">${f.note}</span>
                </div>
                <span class="confidence-badge ${chip}" style="flex-shrink:0">${f.val}</span>
            </div>`;
        }).join('')
        : `<div class="le-no-data">No longevity SNPs detected in your file. Showing population baseline.</div>`;

    return `<div class="le-card fade-in">
        <!-- Header -->
        <div class="le-header">
            <div class="le-header-left">
                <span class="le-header-icon">⏳</span>
                <div>
                    <div class="le-header-title">Genetic Life Expectancy Estimate</div>
                    <div class="le-header-sub">Polygenic longevity model · ${genotyped} markers scored</div>
                </div>
            </div>
            <div class="le-outlook-badge" style="--oc:${gaugeColor}">${outlookIcon} ${outlook}</div>
        </div>

        <!-- Estimate display -->
        <div class="le-estimate-row">
            <div class="le-big-number" style="color:${gaugeColor}">${est}</div>
            <div class="le-estimate-meta">
                <div class="le-estimate-years">years estimated</div>
                <div class="le-estimate-range">Likely range: <strong>${low}–${high} yrs</strong></div>
                <div class="le-estimate-base">US baseline: <strong>79 yrs</strong> &nbsp;·&nbsp; Genetic delta: <strong style="color:${gaugeColor}">${delta >= 0 ? '+' : ''}${delta.toFixed(1)} yrs</strong></div>
            </div>
        </div>

        <!-- Gauge bar -->
        <div class="le-gauge-wrap">
            <div class="le-gauge-labels">
                <span>60</span><span>70</span><span>80</span><span>90</span><span>100+</span>
            </div>
            <div class="le-gauge-track">
                <div class="le-gauge-fill" style="width:${pct}%; background:${gaugeColor}; box-shadow:0 0 16px ${gaugeColor}60"></div>
                <div class="le-gauge-marker" style="left:calc(${pct}% - 6px)"></div>
            </div>
        </div>

        <!-- Factor breakdown -->
        <div class="le-factors-title">Genetic Factors Scored</div>
        <div class="le-factors-list">${factorRows}</div>

        <!-- Lifestyle boost -->
        <div class="le-lifestyle-box">
            <div class="le-lifestyle-title">🚀 Lifestyle adds up to +10–14 years on top of genetics</div>
            <div class="le-lifestyle-grid">
                <div class="le-lifestyle-item"><span>🏃</span><span>Exercise regularly</span><strong>+3–5 yrs</strong></div>
                <div class="le-lifestyle-item"><span>🚭</span><span>Never smoking</span><strong>+4–5 yrs</strong></div>
                <div class="le-lifestyle-item"><span>🥗</span><span>Mediterranean diet</span><strong>+1–3 yrs</strong></div>
                <div class="le-lifestyle-item"><span>😴</span><span>Quality sleep</span><strong>+1–2 yrs</strong></div>
                <div class="le-lifestyle-item"><span>🧘</span><span>Stress management</span><strong>+1–2 yrs</strong></div>
                <div class="le-lifestyle-item"><span>🏥</span><span>Regular checkups</span><strong>+1–2 yrs</strong></div>
            </div>
        </div>

        <div class="disclaimer" style="margin-top:0; border-radius:var(--r); font-size:0.76rem;">
            <strong>⚠️ Important:</strong> This is an <em>educational estimate</em> based on a small number of well-studied SNPs.
            Genetics account for ~25% of lifespan variation; lifestyle and environment dominate the rest.
            This is NOT a medical prognosis. Consult a physician for health planning.
        </div>
    </div>`;
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
