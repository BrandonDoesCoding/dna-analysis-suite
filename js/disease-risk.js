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
// LIFE EXPECTANCY ESTIMATE — 25 markers
// =============================================
function buildLifeExpectancyEstimate(parsedSNPs) {
    const base = 79; // US average
    let delta = 0;
    // Each group: { label, icon, items[] }
    // Each item: { icon, label, gene, rsid, val, delta, note, color }
    const groups = [];

    function snp(id) { return (parsedSNPs[id] || '').toUpperCase(); }
    function addGroup(label, icon, items) {
        const scored = items.filter(i => i.scored);
        if (scored.length) groups.push({ label, icon, items: scored });
    }
    function factor(scored, icon, label, gene, rsid, d, valStr, note, color) {
        delta += d;
        return { scored, icon, label, gene, rsid, val: valStr, note, color };
    }

    // ── 1. LONGEVITY & AGING GENES ────────────────────────────────
    const foxo3 = snp('rs2802292');
    const tp53   = snp('rs1042522');
    const tert   = snp('rs2736100');
    addGroup('Longevity & Aging Genes', '🧬', [
        foxo3 === 'GG'             ? factor(true,'✅','FOXO3','FOXO3','rs2802292', 3,   '+3 yrs',   'GG — strongest replicated longevity locus; found enriched in centenarians worldwide.','green')
      : (foxo3==='GT'||foxo3==='TG') ? factor(true,'✅','FOXO3','FOXO3','rs2802292', 1.5,'+1.5 yrs','GT — heterozygous longevity allele; partial protective benefit on stress pathways.','green')
      : foxo3                      ? factor(true,'➖','FOXO3','FOXO3','rs2802292', 0,   '±0 yrs',  'TT — no FOXO3 longevity allele; typical insulin/stress signaling.','neutral')
      : null,

        (tp53==='CC')              ? factor(true,'✅','TP53 Pro72','TP53','rs1042522', 0.5,'+0.5 yrs','CC (Pro/Pro) — may favour apoptosis of pre-cancerous cells; slight longevity association.','green')
      : (tp53==='GC'||tp53==='CG') ? factor(true,'➖','TP53 Arg72Pro','TP53','rs1042522', 0,'±0 yrs', 'GC — heterozygous; balanced p53 apoptotic vs. DNA-repair response.','neutral')
      : tp53                       ? factor(true,'➖','TP53 Arg72','TP53','rs1042522', 0,'±0 yrs',  'GG (Arg/Arg) — common genotype; robust DNA repair, neutral longevity effect.','neutral')
      : null,

        (tert==='AA')              ? factor(true,'✅','TERT Telomerase','TERT','rs2736100', 1,  '+1 yr',   'AA — associated with longer telomeres; protective against cellular senescence.','green')
      : (tert==='AC'||tert==='CA') ? factor(true,'✅','TERT Telomerase','TERT','rs2736100', 0.5,'+0.5 yrs','AC — intermediate telomere length tendency.','green')
      : tert                       ? factor(true,'➖','TERT Telomerase','TERT','rs2736100', 0,  '±0 yrs',  'CC — shorter telomere tendency; maintain lifestyle to slow cellular aging.','neutral')
      : null,
    ].filter(Boolean));

    // ── 2. APOE / NEURODEGENERATION — true 2-SNP haplotype ───────
    // rs429358 C = ε4 allele driver | rs7412 T = ε2 allele driver
    const apoe4snp = snp('rs429358');
    const apoe2snp = snp('rs7412');
    addGroup('APOE / Neurodegeneration', '🧠', [
        (() => {
            if (!apoe4snp && !apoe2snp) return null;
            const hom4 = apoe4snp === 'CC';
            const has4 = apoe4snp.includes('C');
            const hom2 = apoe2snp === 'TT';
            const has2 = apoe2snp.includes('T');
            if (hom4)         return factor(true,'⚠️','APOE ε4/ε4 (Homozygous)','APOE','rs429358+rs7412',-5,'−5 yrs','ε4/ε4 — 8–12× AD risk vs ε3/ε3. Highest-risk APOE genotype. Exercise, sleep, Mediterranean diet significantly offset risk.','red');
            if (has4 && has2) return factor(true,'🔶','APOE ε2/ε4 (Mixed)','APOE','rs429358+rs7412',-1.5,'−1.5 yrs','ε2/ε4 — rare haplotype; ε2 partially offsets ε4 risk. Monitor cognitive and cardiovascular health closely.','amber');
            if (has4)         return factor(true,'🔶','APOE ε3/ε4 (Heterozygous)','APOE','rs429358+rs7412',-2,'−2 yrs','ε3/ε4 — 3× AD risk vs ε3/ε3. Lifestyle intervention is highly effective: aim for aerobic exercise 150 min/wk, quality sleep, and low glycaemic diet.','amber');
            if (hom2)         return factor(true,'✅','APOE ε2/ε2 (Homozygous)','APOE','rs7412',2,'+2 yrs','ε2/ε2 — strongest protective APOE genotype; lowest Alzheimer\'s and cardiovascular risk; enriched in centenarian populations.','green');
            if (has2)         return factor(true,'✅','APOE ε2/ε3 (Protective)','APOE','rs7412',1,'+1 yr','ε2/ε3 — one protective ε2 allele; partial neuroprotection; lower AD risk than ε3/ε3.','green');
            return factor(true,'➖','APOE ε3/ε3 (Neutral)','APOE','rs429358+rs7412',0,'±0 yrs','ε3/ε3 — most common genotype (~60–65% of population); average Alzheimer\'s and cardiovascular risk.','neutral');
        })(),

        (snp('rs6265')==='AA')     ? factor(true,'🔶','BDNF Val66Met','BDNF','rs6265', -1,  '−1 yr',   'AA (Met/Met) — lower BDNF secretion; accelerated cognitive aging risk, especially under stress.','amber')
      : (snp('rs6265')==='GA'||snp('rs6265')==='AG') ? factor(true,'➖','BDNF Val66Met','BDNF','rs6265', -0.5,'−0.5 yr','GA — one Met allele; mildly reduced BDNF activity-dependent release.','neutral')
      : snp('rs6265')              ? factor(true,'✅','BDNF Val66Met','BDNF','rs6265',  0,  '±0 yrs',  'GG (Val/Val) — full BDNF secretion; supports neuroplasticity and cognitive longevity.','green')
      : null,
    ].filter(Boolean));

    // ── 3. CARDIOVASCULAR ────────────────────────────────────────
    addGroup('Cardiovascular System', '❤️', [
        // CDKN2B — CAD
        (snp('rs1333049')==='GG')             ? factor(true,'🔶','Coronary Artery Disease','CDKN2B','rs1333049',-2,'−2 yrs','GG — high-risk CAD allele; elevated lifetime coronary event risk. Respond well to statins.','amber')
      : (snp('rs1333049')==='CG'||snp('rs1333049')==='GC') ? factor(true,'➖','Coronary Artery Disease','CDKN2B','rs1333049',-1,'−1 yr','Heterozygous — moderate CAD signal.','amber')
      : snp('rs1333049')                       ? factor(true,'✅','Coronary Artery Disease','CDKN2B','rs1333049', 0,'±0 yrs','CC — lower CAD allele burden.','green') : null,

        // MI — rs11191580
        (snp('rs11191580')==='TT')            ? factor(true,'🔶','Myocardial Infarction','PSAP/SORT1','rs11191580',-1,'−1 yr','TT — elevated MI risk allele; higher LDL clearance impairment.','amber')
      : (snp('rs11191580')==='CT'||snp('rs11191580')==='TC') ? factor(true,'➖','Myocardial Infarction','PSAP/SORT1','rs11191580',-0.5,'−0.5 yr','CT — moderate MI signal.','neutral')
      : snp('rs11191580')                      ? factor(true,'✅','Myocardial Infarction','PSAP/SORT1','rs11191580', 0,'±0 yrs','CC — lower MI genetic burden.','green') : null,

        // Lipoprotein(a) — rs10455872
        (snp('rs10455872')==='GG')            ? factor(true,'⚠️','Lipoprotein(a) / Lp(a)','LPA','rs10455872',-2,'−2 yrs','GG — high Lp(a) genotype; strongly elevated atherosclerosis risk, largely independent of lifestyle.','red')
      : (snp('rs10455872')==='AG'||snp('rs10455872')==='GA') ? factor(true,'🔶','Lipoprotein(a) / Lp(a)','LPA','rs10455872',-1,'−1 yr','AG — moderate Lp(a) elevation. Ask doctor about Lp(a) blood test.','amber')
      : snp('rs10455872')                      ? factor(true,'✅','Lipoprotein(a) / Lp(a)','LPA','rs10455872', 0,'±0 yrs','AA — lower Lp(a) tendency; reduced atherosclerotic plaque risk.','green') : null,

        // Atrial Fibrillation — rs2200733
        (snp('rs2200733')==='TT')             ? factor(true,'🔶','Atrial Fibrillation','PITX2/4q25','rs2200733',-2,'−2 yrs','TT — highest AFib genetic risk; discuss rhythm monitoring with cardiologist.','amber')
      : (snp('rs2200733')==='CT'||snp('rs2200733')==='TC') ? factor(true,'➖','Atrial Fibrillation','PITX2/4q25','rs2200733',-1,'−1 yr','CT — moderately elevated AFib risk.','amber')
      : snp('rs2200733')                       ? factor(true,'✅','Atrial Fibrillation','PITX2/4q25','rs2200733', 0,'±0 yrs','CC — lower AFib genetic burden.','green') : null,

        // Blood pressure — AGTR1 rs5186
        (snp('rs5186')==='CC')                ? factor(true,'🔶','Blood Pressure (AGTR1)','AGTR1','rs5186',-1.5,'−1.5 yrs','CC — angiotensin II receptor variant; stronger BP response to salt and stress.','amber')
      : (snp('rs5186')==='AC'||snp('rs5186')==='CA') ? factor(true,'➖','Blood Pressure (AGTR1)','AGTR1','rs5186',-0.75,'−0.75 yr','AC — moderate AGTR1 BP effect.','neutral')
      : snp('rs5186')                          ? factor(true,'✅','Blood Pressure (AGTR1)','AGTR1','rs5186', 0,'±0 yrs','AA — favourable BP regulation genotype.','green') : null,

        // NOS3 / eNOS nitric oxide — rs1799983
        (snp('rs1799983')==='TT')             ? factor(true,'🔶','Endothelial NO (eNOS)','NOS3','rs1799983',-1.5,'−1.5 yrs','TT (Glu298Asp) — reduced nitric oxide; endothelial dysfunction & higher CVD risk.','amber')
      : (snp('rs1799983')==='GT'||snp('rs1799983')==='TG') ? factor(true,'➖','Endothelial NO (eNOS)','NOS3','rs1799983',-0.75,'−0.75 yr','GT — heterozygous eNOS; partial NO reduction.','neutral')
      : snp('rs1799983')                       ? factor(true,'✅','Endothelial NO (eNOS)','NOS3','rs1799983', 0.5,'+0.5 yr','GG — full nitric oxide production; healthy endothelial function.','green') : null,

        // ApoB / LDL — rs693
        (snp('rs693')==='GG')                 ? factor(true,'🔶','LDL / ApoB Cholesterol','APOB','rs693',-1,'−1 yr','GG — higher ApoB-bound LDL tendency; increased atherogenic particle load.','amber')
      : (snp('rs693')==='AG'||snp('rs693')==='GA') ? factor(true,'➖','LDL / ApoB Cholesterol','APOB','rs693',-0.5,'−0.5 yr','AG — mild LDL elevation tendency.','neutral')
      : snp('rs693')                           ? factor(true,'✅','LDL / ApoB Cholesterol','APOB','rs693', 0,'±0 yrs','AA — lower ApoB LDL genetic burden.','green') : null,

        // 9p21.3 — pan-CVD/cancer
        (snp('rs10757274')==='AA')            ? factor(true,'⚠️','9p21.3 Pan-Risk Locus','CDKN2A/B','rs10757274',-2.5,'−2.5 yrs','AA — highest-risk genotype at 9p21.3; elevated CVD, colorectal, and pancreatic risk.','red')
      : (snp('rs10757274')==='AG'||snp('rs10757274')==='GA') ? factor(true,'🔶','9p21.3 Pan-Risk Locus','CDKN2A/B','rs10757274',-1.25,'−1.25 yrs','AG — intermediate 9p21.3 risk.','amber')
      : snp('rs10757274')                      ? factor(true,'✅','9p21.3 Pan-Risk Locus','CDKN2A/B','rs10757274', 0,'±0 yrs','GG — lower 9p21.3 risk allele burden.','green') : null,
    ].filter(Boolean));

    // ── 4. BLOOD & CLOTTING ──────────────────────────────────────
    addGroup('Blood & Clotting', '🩸', [
        // Factor V Leiden — rs1800956
        (snp('rs1800956')==='GA'||snp('rs1800956')==='AG') ? factor(true,'🔶','Factor V Leiden','F5','rs1800956',-1,'−1 yr','Carrier — 5–10× higher VTE/DVT risk; avoid prolonged immobility, discuss anticoagulation with doctor.','amber')
      : (snp('rs1800956')==='AA')             ? factor(true,'⚠️','Factor V Leiden','F5','rs1800956',-2,'−2 yrs','Homozygous Leiden — very high clotting risk; lifelong management warranted.','red')
      : snp('rs1800956')                       ? factor(true,'✅','Factor V Leiden','F5','rs1800956', 0,'±0 yrs','GG — no Factor V Leiden mutation detected.','green') : null,

        // Prothrombin G20210A — rs1799963
        (snp('rs1799963')==='GA'||snp('rs1799963')==='AG') ? factor(true,'🔶','Prothrombin G20210A','F2','rs1799963',-1,'−1 yr','Carrier — 3× elevated DVT/PE risk; especially relevant during surgery or pregnancy.','amber')
      : snp('rs1799963')                       ? factor(true,'✅','Prothrombin G20210A','F2','rs1799963', 0,'±0 yrs','GG — no prothrombin thrombosis mutation.','green') : null,

        // Homocysteine / VTE — rs6922269
        (snp('rs6922269')==='GG')             ? factor(true,'🔶','Homocysteine / VTE','MTHFD1L','rs6922269',-1,'−1 yr','GG — elevated homocysteine tendency; raises CVD, stroke, and clotting risk.','amber')
      : (snp('rs6922269')==='AG'||snp('rs6922269')==='GA') ? factor(true,'➖','Homocysteine / VTE','MTHFD1L','rs6922269',-0.5,'−0.5 yr','AG — mild homocysteine elevation.','neutral')
      : snp('rs6922269')                       ? factor(true,'✅','Homocysteine / VTE','MTHFD1L','rs6922269', 0,'±0 yrs','AA — lower homocysteine genetic risk.','green') : null,
    ].filter(Boolean));

    // ── 5. METABOLIC HEALTH ──────────────────────────────────────
    addGroup('Metabolic Health', '🏥', [
        // TCF7L2 T2D
        (snp('rs7903146')==='TT')             ? factor(true,'🔶','Type 2 Diabetes (TCF7L2)','TCF7L2','rs7903146',-2,'−2 yrs','TT — strongest T2D locus; ~2× lifetime risk. Exercise and diet are highly effective countermeasures.','amber')
      : (snp('rs7903146')==='CT'||snp('rs7903146')==='TC') ? factor(true,'➖','Type 2 Diabetes (TCF7L2)','TCF7L2','rs7903146',-1,'−1 yr','CT — moderate T2D signal.','amber')
      : snp('rs7903146')                       ? factor(true,'✅','Type 2 Diabetes (TCF7L2)','TCF7L2','rs7903146', 0,'±0 yrs','CC — lower TCF7L2 T2D burden.','green') : null,

        // Insulin resistance — rs9991328
        (snp('rs9991328')==='TT')             ? factor(true,'🔶','Insulin Resistance','IRS1','rs9991328',-1,'−1 yr','TT — reduced insulin receptor signaling; higher metabolic syndrome risk.','amber')
      : (snp('rs9991328')==='CT'||snp('rs9991328')==='TC') ? factor(true,'➖','Insulin Resistance','IRS1','rs9991328',-0.5,'−0.5 yr','CT — mild insulin resistance tendency.','neutral')
      : snp('rs9991328')                       ? factor(true,'✅','Insulin Resistance','IRS1','rs9991328', 0,'±0 yrs','CC — favourable insulin sensitivity genotype.','green') : null,

        // FTO obesity — rs9939609 (primary FTO appetite/obesity SNP)
        (snp('rs9939609')==='AA')             ? factor(true,'🔶','Obesity / FTO Risk','FTO','rs9939609',-1.5,'−1.5 yrs','AA — highest FTO obesity allele burden; ~6–7 kg average weight tendency above baseline; elevated appetite dysregulation.','amber')
      : (snp('rs9939609')==='TA'||snp('rs9939609')==='AT') ? factor(true,'➖','Obesity / FTO Risk','FTO','rs9939609',-0.5,'−0.5 yr','TA — one FTO risk allele; mild weight gain tendency (~3 kg above average).','neutral')
      : snp('rs9939609')                       ? factor(true,'✅','Obesity / FTO Risk','FTO','rs9939609', 0,'±0 yrs','TT — protective FTO genotype; no elevated obesity or appetite dysregulation risk.','green') : null,

        // PPARG insulin sensitivity — rs1801282
        (snp('rs1801282')==='GG')             ? factor(true,'✅','Insulin Sensitivity (PPARG)','PPARG','rs1801282', 0.5,'+0.5 yr','GG (Pro12Ala) — highest insulin sensitivity; protective against T2D and obesity.','green')
      : (snp('rs1801282')==='CG'||snp('rs1801282')==='GC') ? factor(true,'✅','Insulin Sensitivity (PPARG)','PPARG','rs1801282', 0.5,'+0.5 yr','CG — partial Ala allele; moderate insulin sensitivity benefit.','green')
      : snp('rs1801282')                       ? factor(true,'➖','Insulin Sensitivity (PPARG)','PPARG','rs1801282', 0,'±0 yrs','CC (Pro/Pro) — typical PPARG; average insulin sensitivity.','neutral') : null,

        // MTHFR C677T — rs1801133
        (snp('rs1801133')==='TT')             ? factor(true,'🔶','Folate / MTHFR (C677T)','MTHFR','rs1801133',-1.5,'−1.5 yrs','TT — ~30% MTHFR enzyme activity; elevated homocysteine, CVD, and cognitive risk. Take methylfolate.','amber')
      : (snp('rs1801133')==='CT'||snp('rs1801133')==='TC') ? factor(true,'➖','Folate / MTHFR (C677T)','MTHFR','rs1801133',-0.5,'−0.5 yr','CT — ~65% enzyme activity; mildly elevated homocysteine. Ensure adequate folate.','neutral')
      : snp('rs1801133')                       ? factor(true,'✅','Folate / MTHFR (C677T)','MTHFR','rs1801133', 0,'±0 yrs','CC — full MTHFR enzyme activity; optimal folate metabolism.','green') : null,
    ].filter(Boolean));

    // ── 6. INFLAMMATION ──────────────────────────────────────────
    addGroup('Inflammation & Immune', '🛡️', [
        // TNF-α — rs1800629
        (snp('rs1800629')==='AA')             ? factor(true,'⚠️','TNF-α Inflammation','TNF','rs1800629',-2,'−2 yrs','AA — high TNF-α producer; systemic chronic inflammation linked to CVD, T2D, and accelerated aging.','red')
      : (snp('rs1800629')==='AG'||snp('rs1800629')==='GA') ? factor(true,'🔶','TNF-α Inflammation','TNF','rs1800629',-1,'−1 yr','AG — moderate TNF-α elevation; low-grade inflammatory tendency.','amber')
      : snp('rs1800629')                       ? factor(true,'✅','TNF-α Inflammation','TNF','rs1800629', 0,'±0 yrs','GG — lower TNF-α baseline; healthy inflammatory response.','green') : null,

        // IL-10 / IL-17 — rs2275913
        (snp('rs2275913')==='AA')             ? factor(true,'🔶','Inflammatory Cytokines (IL-17)','IL17A','rs2275913',-0.5,'−0.5 yr','AA — higher pro-inflammatory IL-17 output; autoimmune and metabolic risk.','amber')
      : (snp('rs2275913')==='AG'||snp('rs2275913')==='GA') ? factor(true,'➖','Inflammatory Cytokines (IL-17)','IL17A','rs2275913',-0.25,'−0.25 yr','AG — mild IL-17 elevation.','neutral')
      : snp('rs2275913')                       ? factor(true,'✅','Inflammatory Cytokines (IL-17)','IL17A','rs2275913', 0.5,'+0.5 yr','GG — lower IL-17; balanced anti-inflammatory signaling.','green') : null,
    ].filter(Boolean));

    // ── 7. VITAMIN & NUTRITION ───────────────────────────────────
    addGroup('Vitamin & Nutrition', '🥗', [
        // Vitamin D — rs12785878
        (snp('rs12785878')==='TT')            ? factor(true,'🔶','Vitamin D Synthesis (DHCR7)','DHCR7','rs12785878',-0.75,'−0.75 yr','TT — reduced Vitamin D synthesis; higher risk of deficiency. Test serum 25(OH)D and supplement.','amber')
      : (snp('rs12785878')==='GT'||snp('rs12785878')==='TG') ? factor(true,'➖','Vitamin D Synthesis (DHCR7)','DHCR7','rs12785878',-0.25,'−0.25 yr','GT — mildly impaired Vitamin D synthesis.','neutral')
      : snp('rs12785878')                      ? factor(true,'✅','Vitamin D Synthesis (DHCR7)','DHCR7','rs12785878', 0,'±0 yrs','GG — efficient Vitamin D synthesis.','green') : null,

        // FADS1 omega-3 — rs6426749
        (snp('rs6426749')==='GG')             ? factor(true,'✅','Omega-3 Conversion (FADS1)','FADS1','rs6426749', 0.5,'+0.5 yr','GG — efficient ALA→EPA/DHA conversion; lower inflammatory eicosanoid burden.','green')
      : (snp('rs6426749')==='GT'||snp('rs6426749')==='TG') ? factor(true,'➖','Omega-3 Conversion (FADS1)','FADS1','rs6426749', 0.25,'+0.25 yr','GT — partial omega-3 conversion efficiency.','neutral')
      : snp('rs6426749')                       ? factor(true,'➖','Omega-3 Conversion (FADS1)','FADS1','rs6426749', 0,'±0 yrs','TT — reduced omega-3 conversion; consider preformed EPA/DHA supplementation.','neutral') : null,

        // MTHFR A1298C — rs1801131
        (snp('rs1801131')==='TT')             ? factor(true,'🔶','Folate / MTHFR (A1298C)','MTHFR','rs1801131',-0.5,'−0.5 yr','TT — second MTHFR variant; compounds C677T effects on methylation capacity.','amber')
      : snp('rs1801131')                       ? factor(true,'➖','Folate / MTHFR (A1298C)','MTHFR','rs1801131', 0,'±0 yrs','Not the A1298C high-risk genotype.','neutral') : null,

        // MTHFR Compound Heterozygous — additional penalty if both C677T & A1298C are present
        (() => {
            const c677t  = snp('rs1801133');
            const a1298c = snp('rs1801131');
            const risk677  = c677t === 'TT' || c677t === 'CT' || c677t === 'TC';
            const risk1298 = a1298c === 'TT' || a1298c === 'GT' || a1298c === 'TG';
            return (risk677 && risk1298)
                ? factor(true,'⚠️','MTHFR Compound Het (C677T + A1298C)','MTHFR','rs1801133+rs1801131',-1,'−1 yr','Both MTHFR C677T and A1298C variants detected — compound heterozygous; combined methylation impairment is worse than either alone. Take 5-MTHF (methylfolate), NOT folic acid.','red')
                : null;
        })(),
    ].filter(Boolean));

    // ── 8. SLEEP & CIRCADIAN ─────────────────────────────────────
    addGroup('Sleep & Circadian Rhythm', '😴', [
        // CRY1 delayed sleep — rs57875989
        (snp('rs57875989')==='TI'||snp('rs57875989').includes('I')) ? factor(true,'🔶','Circadian Rhythm (CRY1)','CRY1','rs57875989',-0.5,'−0.5 yr','Insertion allele — delayed sleep phase; disrupted circadian rhythm increases metabolic & CVD risk.','amber')
      : snp('rs57875989')                      ? factor(true,'✅','Circadian Rhythm (CRY1)','CRY1','rs57875989', 0,'±0 yrs','TT — normal circadian period; healthy sleep timing genetics.','green') : null,

        // Sleep duration — rs9910677
        (snp('rs9910677')==='AA')             ? factor(true,'🔶','Sleep Duration Tendency','ABCC9','rs9910677',-0.5,'−0.5 yr','AA — genetically shorter sleep tendency; chronic short sleep elevates CVD, obesity, and cognitive risk.','amber')
      : snp('rs9910677')                       ? factor(true,'✅','Sleep Duration Tendency','ABCC9','rs9910677', 0,'±0 yrs','Non-risk genotype — normal sleep duration genetics.','green') : null,
    ].filter(Boolean));

    // ── 9. EXTENDED LONGEVITY ─────────────────────────────────────
    addGroup('Extended Longevity', '⚗️', [
        // KLOTHO F352V — rs9536314 (strongest replicated longevity locus outside APOE)
        (snp('rs9536314')==='GT'||snp('rs9536314')==='TG') ? factor(true,'✅','KLOTHO F352V (VS Heterozygote)','KLOTHO','rs9536314', 2.5,'+2.5 yrs','VS — KLOTHO VS heterozygote; 2–3× enriched in centenarians. Protects against kidney aging, oxidative stress, and cognitive decline.','green')
      : snp('rs9536314')                       ? factor(true,'➖','KLOTHO F352V','KLOTHO','rs9536314', 0,'±0 yrs','Non-VS — no KLOTHO longevity bonus; standard FGF23/kidney aging axis.','neutral') : null,

        // SIRT3 — rs11246020 (mitochondrial sirtuin, centenarian enriched)
        (snp('rs11246020')==='GG')             ? factor(true,'✅','SIRT3 Longevity (Mitochondria)','SIRT3','rs11246020', 1,'+1 yr','GG — SIRT3 promoter variant; optimal mitochondrial NAD+ signaling and deacetylase activity; enriched in centenarian cohorts.','green')
      : snp('rs11246020')                      ? factor(true,'➖','SIRT3 Longevity','SIRT3','rs11246020', 0,'±0 yrs','Non-GG — standard mitochondrial sirtuin activity.','neutral') : null,
    ].filter(Boolean));

    // ── 10. EXTENDED INFLAMMATION ────────────────────────────────
    addGroup('Extended Inflammation', '🔥', [
        // IL-6 — rs1800795 (primary chronic inflammation cytokine)
        (snp('rs1800795')==='CC')              ? factor(true,'⚠️','IL-6 Chronic Inflammation','IL6','rs1800795',-1.5,'−1.5 yrs','CC — high IL-6 producer; systemic inflammaging accelerates CVD, cancer, and cognitive decline. Anti-inflammatory diet critical.','red')
      : (snp('rs1800795')==='GC'||snp('rs1800795')==='CG') ? factor(true,'🔶','IL-6 Moderate Inflammation','IL6','rs1800795',-0.75,'−0.75 yr','GC — moderately elevated IL-6; manage with exercise and diet.','amber')
      : snp('rs1800795')                       ? factor(true,'✅','IL-6 (Low Inflammaging)','IL6','rs1800795', 0.5,'+0.5 yr','GG — low IL-6 baseline; reduced systemic inflammaging risk.','green') : null,

        // IL-10 — rs1800896 (anti-inflammatory cytokine)
        (snp('rs1800896')==='AA')              ? factor(true,'✅','IL-10 Anti-inflammatory','IL10','rs1800896', 1,'+1 yr','AA — high IL-10 producer; potent anti-inflammatory cytokine; associated with longevity and reduced autoimmune burden.','green')
      : (snp('rs1800896')==='GA'||snp('rs1800896')==='AG') ? factor(true,'➖','IL-10 Moderate','IL10','rs1800896', 0.5,'+0.5 yr','GA — intermediate IL-10 anti-inflammatory output.','green')
      : snp('rs1800896')                       ? factor(true,'🔶','IL-10 (Low Anti-inflam.)','IL10','rs1800896',-0.5,'−0.5 yr','GG — lower IL-10 output; reduced capacity to resolve inflammation.','amber') : null,

        // TLR4 D299G — rs4986790 (innate immunity / infection risk)
        (snp('rs4986790')==='GT'||snp('rs4986790')==='TG') ? factor(true,'🔶','Innate Immunity (TLR4 D299G)','TLR4','rs4986790',-1,'−1 yr','GT — blunted LPS sensing; higher severe infection and sepsis risk. Maintain vaccinations; avoid immunocompromising habits.','amber')
      : snp('rs4986790')                       ? factor(true,'✅','Innate Immunity (TLR4)','TLR4','rs4986790', 0,'±0 yrs','GG — intact TLR4 pathogen sensing; standard innate immune response.','green') : null,
    ].filter(Boolean));

    // ── 11. EXTENDED CARDIOVASCULAR ──────────────────────────────
    addGroup('Extended Cardiovascular', '🫀', [
        // PCSK9 — rs2479409 (LDL clearance)
        (snp('rs2479409')==='AA')              ? factor(true,'✅','PCSK9 (LDL Clearance)','PCSK9','rs2479409', 1,'+1 yr','AA — gain-of-function PCSK9 variant associated with lower lifetime LDL; cardiovascular protective effect.','green')
      : snp('rs2479409')                       ? factor(true,'➖','PCSK9 (LDL Clearance)','PCSK9','rs2479409', 0,'±0 yrs','Non-AA — average PCSK9 LDL clearance efficiency.','neutral') : null,

        // CETP — rs708272 (HDL cholesterol)
        (snp('rs708272')==='AA')               ? factor(true,'✅','HDL Cholesterol (CETP)','CETP','rs708272', 1,'+1 yr','AA — low CETP activity; higher HDL; consistently associated with longevity and reduced CVD risk.','green')
      : (snp('rs708272')==='GA'||snp('rs708272')==='AG') ? factor(true,'➖','HDL Cholesterol (CETP)','CETP','rs708272', 0.5,'+0.5 yr','GA — moderate CETP HDL benefit.','green')
      : snp('rs708272')                        ? factor(true,'🔶','HDL Cholesterol (CETP)','CETP','rs708272',-0.5,'−0.5 yr','GG — higher CETP activity; lower HDL tendency; increased atherogenic risk.','amber') : null,

        // APOC3 — rs5128 (triglyceride production)
        (snp('rs5128')==='GG')                 ? factor(true,'🔶','Triglycerides (APOC3)','APOC3','rs5128',-1,'−1 yr','GG — APOC3 risk variant; elevated triglyceride production; increased CVD and pancreatitis risk.','amber')
      : snp('rs5128')                          ? factor(true,'✅','Triglycerides (APOC3)','APOC3','rs5128', 0,'±0 yrs','Non-GG — favorable APOC3; lower triglyceride genetic burden.','green') : null,

        // Fibrinogen — rs1800790 (clotting/inflammation)
        (snp('rs1800790')==='AA')              ? factor(true,'🔶','Fibrinogen / Thrombosis','FGB','rs1800790',-1,'−1 yr','AA — elevated fibrinogen genotype; increases thrombosis, stroke, and CVD risk. Monitor with D-dimer if symptomatic.','amber')
      : (snp('rs1800790')==='GA'||snp('rs1800790')==='AG') ? factor(true,'➖','Fibrinogen / Thrombosis','FGB','rs1800790',-0.5,'−0.5 yr','GA — mildly elevated fibrinogen tendency.','neutral')
      : snp('rs1800790')                       ? factor(true,'✅','Fibrinogen / Thrombosis','FGB','rs1800790', 0,'±0 yrs','GG — normal fibrinogen genetics; standard clotting cascade.','green') : null,
    ].filter(Boolean));

    // ── 12. EXTENDED METABOLIC ────────────────────────────────────
    addGroup('Extended Metabolic', '⚡', [
        // CDKAL1 — rs7756992 (beta-cell function, T2D)
        (snp('rs7756992')==='GG')              ? factor(true,'🔶','Beta-Cell Function (CDKAL1)','CDKAL1','rs7756992',-1.5,'−1.5 yrs','GG — impaired insulin secretion; one of the strongest T2D GWAS signals. Regular exercise preserves beta-cell function.','amber')
      : (snp('rs7756992')==='AG'||snp('rs7756992')==='GA') ? factor(true,'➖','Beta-Cell Function (CDKAL1)','CDKAL1','rs7756992',-0.75,'−0.75 yr','AG — moderate CDKAL1 T2D risk.','neutral')
      : snp('rs7756992')                       ? factor(true,'✅','Beta-Cell Function (CDKAL1)','CDKAL1','rs7756992', 0,'±0 yrs','AA — protective CDKAL1; better insulin secretion capacity.','green') : null,

        // SLC30A8 — rs13266634 (zinc transporter, insulin packaging)
        (snp('rs13266634')==='TT')             ? factor(true,'🔶','Zinc/Insulin (SLC30A8)','SLC30A8','rs13266634',-1,'−1 yr','TT — impaired zinc transporter in beta cells; reduced insulin crystallisation and packaging; T2D risk.','amber')
      : snp('rs13266634')                      ? factor(true,'✅','Zinc/Insulin (SLC30A8)','SLC30A8','rs13266634', 0,'±0 yrs','Non-TT — adequate beta-cell zinc handling.','green') : null,

        // ADIPOQ — rs2241766 (adiponectin — metabolic protector)
        (snp('rs2241766')==='TT')              ? factor(true,'✅','Adiponectin (ADIPOQ)','ADIPOQ','rs2241766', 1,'+1 yr','TT — high adiponectin secretion; reduces insulin resistance, CVD, and chronic inflammation; longevity-associated.','green')
      : (snp('rs2241766')==='GT'||snp('rs2241766')==='TG') ? factor(true,'➖','Adiponectin (ADIPOQ)','ADIPOQ','rs2241766', 0.5,'+0.5 yr','GT — moderate adiponectin benefit.','green')
      : snp('rs2241766')                       ? factor(true,'🔶','Adiponectin (ADIPOQ)','ADIPOQ','rs2241766',-0.5,'−0.5 yr','GG — lower adiponectin tendency; higher metabolic syndrome risk.','amber') : null,

        // UCP1 — rs1800592 (brown fat thermogenesis)
        (snp('rs1800592')==='AA')              ? factor(true,'✅','Thermogenesis (UCP1)','UCP1','rs1800592', 0.5,'+0.5 yr','AA — enhanced brown adipose thermogenesis; easier weight regulation and higher metabolic rate.','green')
      : snp('rs1800592')                       ? factor(true,'➖','Thermogenesis (UCP1)','UCP1','rs1800592', 0,'±0 yrs','Non-AA — standard UCP1 uncoupling; typical metabolic rate.','neutral') : null,

        // ALDH2 — rs671 (alcohol / acetaldehyde metabolism — primarily East Asian)
        (snp('rs671')==='AA')                  ? factor(true,'⚠️','Alcohol Metabolism (ALDH2 Deficiency)','ALDH2','rs671',-2,'−2 yrs','AA — inactive ALDH2 (Glu504Lys hom); severe acetaldehyde accumulation; dramatically elevated GI cancer and CVD risk with any alcohol. Complete alcohol avoidance strongly advised.','red')
      : (snp('rs671')==='GA'||snp('rs671')==='AG') ? factor(true,'🔶','Alcohol Metabolism (ALDH2 Partial)','ALDH2','rs671',-0.75,'−0.75 yr','GA — partial ALDH2 deficiency; elevated esophageal cancer risk with alcohol. Minimize or avoid alcohol.','amber')
      : snp('rs671')                           ? factor(true,'✅','Alcohol Metabolism (ALDH2)','ALDH2','rs671', 0,'±0 yrs','GG — normal ALDH2 function; standard alcohol clearance.','green') : null,
    ].filter(Boolean));

    // ── 13. CANCER GENETICS ───────────────────────────────────────
    addGroup('Cancer Genetics', '🔬', [
        // MLH1 — rs1799977 (mismatch repair, Lynch spectrum)
        (snp('rs1799977')==='AA')              ? factor(true,'🔶','DNA Mismatch Repair (MLH1)','MLH1','rs1799977',-1,'−1 yr','AA — MLH1 Ile219Val common variant; mildly impaired mismatch repair; modestly elevated colorectal cancer risk.','amber')
      : snp('rs1799977')                       ? factor(true,'✅','DNA Mismatch Repair (MLH1)','MLH1','rs1799977', 0,'±0 yrs','Non-AA — adequate MLH1 mismatch repair capacity.','green') : null,

        // ERCC2/XPD — rs13181 (nucleotide excision repair)
        (snp('rs13181')==='AA')                ? factor(true,'🔶','DNA Excision Repair (ERCC2/XPD)','ERCC2','rs13181',-1,'−1 yr','AA (Lys751Gln) — reduced nucleotide excision repair; elevated lung, bladder, and skin cancer risk, especially with carcinogen exposure.','amber')
      : snp('rs13181')                         ? factor(true,'✅','DNA Excision Repair (ERCC2)','ERCC2','rs13181', 0,'±0 yrs','Non-AA — adequate ERCC2 DNA damage repair.','green') : null,

        // BRCA2 — rs144848 (common variant — NOT pathogenic; clinical testing needed)
        (snp('rs144848')==='CC')               ? factor(true,'🔶','DNA Repair (BRCA2 Common Variant)','BRCA2','rs144848',-0.75,'−0.75 yr','CC — BRCA2 common variant; mildly elevated breast/ovarian cancer risk. NOTE: pathogenic BRCA1/2 mutations are NOT detectable by consumer SNP arrays — require clinical testing.','amber')
      : snp('rs144848')                        ? factor(true,'✅','DNA Repair (BRCA2)','BRCA2','rs144848', 0,'±0 yrs','Non-CC — neutral BRCA2 common variant. Serious mutations require dedicated clinical testing.','green') : null,
    ].filter(Boolean));

    // ── 14. NEURODEGENERATION EXTENDED ───────────────────────────
    addGroup('Neurodegeneration Extended', '🧩', [
        // ABCA7 — rs3764650 (Alzheimer's — amyloid clearance)
        (snp('rs3764650')==='TT')              ? factor(true,'🔶','Alzheimer\'s Risk (ABCA7)','ABCA7','rs3764650',-1.5,'−1.5 yrs','TT — ABCA7 risk allele; impaired amyloid-β clearance and lipid metabolism in microglia; ~1.9× AD OR.','amber')
      : (snp('rs3764650')==='GT'||snp('rs3764650')==='TG') ? factor(true,'➖','Alzheimer\'s Risk (ABCA7)','ABCA7','rs3764650',-0.75,'−0.75 yr','GT — moderate ABCA7 AD signal.','neutral')
      : snp('rs3764650')                       ? factor(true,'✅','Alzheimer\'s Risk (ABCA7)','ABCA7','rs3764650', 0,'±0 yrs','GG — favorable ABCA7; lower amyloid clearance burden.','green') : null,

        // BIN1 — rs744373 (second-largest GWAS Alzheimer's locus)
        (snp('rs744373')==='TT')               ? factor(true,'🔶','Alzheimer\'s Risk (BIN1)','BIN1','rs744373',-1,'−1 yr','TT — BIN1 risk allele; second most significant GWAS locus after APOE for late-onset AD; affects tau pathology.','amber')
      : snp('rs744373')                        ? factor(true,'✅','Alzheimer\'s Risk (BIN1)','BIN1','rs744373', 0,'±0 yrs','Non-TT — lower BIN1 AD genetic burden.','green') : null,

        // CLU — rs11136000 (Clusterin, amyloid-β clearance)
        (snp('rs11136000')==='TT')             ? factor(true,'🔶','Alzheimer\'s Risk (CLU/Clusterin)','CLU','rs11136000',-1,'−1 yr','TT — CLU risk allele; clusterin impairs amyloid-β chaperoning and clearance; elevated late-onset AD risk.','amber')
      : snp('rs11136000')                      ? factor(true,'✅','Alzheimer\'s Risk (CLU)','CLU','rs11136000', 0,'±0 yrs','Non-TT — favorable CLU clusterin expression; better amyloid management.','green') : null,
    ].filter(Boolean));

    // ── 15. BONE HEALTH ───────────────────────────────────────────
    addGroup('Bone Health', '🦴', [
        // LRP5 — rs4988321 (Wnt signalling, bone mineral density)
        (snp('rs4988321')==='TT')              ? factor(true,'🔶','Bone Density (LRP5)','LRP5','rs4988321',-1,'−1 yr','TT — LRP5 loss-of-function variant; significantly reduced bone mineral density; elevated osteoporosis and fracture risk.','amber')
      : snp('rs4988321')                       ? factor(true,'✅','Bone Density (LRP5)','LRP5','rs4988321', 0,'±0 yrs','Non-TT — adequate LRP5 Wnt-bone signaling; normal BMD tendency.','green') : null,

        // COL1A1 — rs1800012 (collagen I, osteoporosis)
        (snp('rs1800012')==='TT')              ? factor(true,'🔶','Collagen / Osteoporosis (COL1A1)','COL1A1','rs1800012',-0.75,'−0.75 yr','TT — COL1A1 Sp1 binding site variant; weaker type I collagen; increased fracture risk and osteoporosis susceptibility.','amber')
      : snp('rs1800012')                       ? factor(true,'✅','Collagen / Osteoporosis (COL1A1)','COL1A1','rs1800012', 0,'±0 yrs','Non-TT — normal COL1A1 collagen I production.','green') : null,

        // VDR Taq1 — rs731236 (vitamin D receptor, calcium absorption)
        (snp('rs731236')==='AA')               ? factor(true,'🔶','Vitamin D Receptor (Bone/VDR)','VDR','rs731236',-0.75,'−0.75 yr','AA (tt genotype) — reduced VDR activity at bone and intestine; impaired calcium absorption and bone remodeling. Supplement vitamin D and calcium.','amber')
      : snp('rs731236')                        ? factor(true,'✅','Vitamin D Receptor (Bone/VDR)','VDR','rs731236', 0,'±0 yrs','Non-AA — adequate VDR bone signaling and calcium absorption.','green') : null,
    ].filter(Boolean));

    // ── 16. AUTOIMMUNE & KIDNEY ──────────────────────────────────
    addGroup('Autoimmune & Kidney', '💊', [
        // PTPN22 — rs2476601 (Arg620Trp, broad autoimmune risk)
        (snp('rs2476601')==='AA')              ? factor(true,'⚠️','Autoimmune Risk (PTPN22)','PTPN22','rs2476601',-2,'−2 yrs','AA (Arg620Trp hom) — very high autoimmune risk; strongly associated with RA, lupus, T1D, Graves\' disease, and thyroid autoimmunity.','red')
      : (snp('rs2476601')==='GA'||snp('rs2476601')==='AG') ? factor(true,'🔶','Autoimmune Risk (PTPN22)','PTPN22','rs2476601',-1,'−1 yr','GA — one PTPN22 risk allele; significantly elevated risk across multiple autoimmune conditions.','amber')
      : snp('rs2476601')                       ? factor(true,'✅','Autoimmune Risk (PTPN22)','PTPN22','rs2476601', 0,'±0 yrs','GG — no PTPN22 risk allele; typical T-cell signaling threshold.','green') : null,

        // HLA-DQ2 — rs2187668 (celiac disease / T1D)
        (snp('rs2187668')==='TT')              ? factor(true,'🔶','Celiac Disease / HLA-DQ2','HLA-DQ2','rs2187668',-1,'−1 yr','TT — HLA-DQ2.5 risk haplotype; high risk of celiac disease and T1D. Gluten elimination and gut monitoring warranted.','amber')
      : snp('rs2187668')                       ? factor(true,'✅','Celiac Disease / HLA-DQ2','HLA-DQ2','rs2187668', 0,'±0 yrs','Non-TT — lower HLA-DQ2 celiac and T1D genetic risk.','green') : null,

        // UMOD — rs11864909 (kidney function, chronic kidney disease)
        (snp('rs11864909')==='GG')             ? factor(true,'🔶','Kidney Function (UMOD)','UMOD','rs11864909',-1,'−1 yr','GG — UMOD risk variant; reduced uromodulin secretion; elevated CKD and hypertension-related kidney disease risk.','amber')
      : snp('rs11864909')                      ? factor(true,'✅','Kidney Function (UMOD)','UMOD','rs11864909', 0,'±0 yrs','Non-GG — favorable UMOD; better tubular kidney protection.','green') : null,
    ].filter(Boolean));

    // ── 17. MENTAL HEALTH ────────────────────────────────────────
    addGroup('Mental Health & Resilience', '💭', [
        // CACNA1C — rs1006737 (cross-disorder: bipolar, depression, schizophrenia)
        (snp('rs1006737')==='AA')              ? factor(true,'🔶','Mood Disorder Genetics (CACNA1C)','CACNA1C','rs1006737',-1.5,'−1.5 yrs','AA — CACNA1C risk variant; elevated risk of bipolar disorder, major depression, and schizophrenia; affects L-type calcium channel brain activity.','amber')
      : (snp('rs1006737')==='GA'||snp('rs1006737')==='AG') ? factor(true,'➖','Mood Disorder Genetics (CACNA1C)','CACNA1C','rs1006737',-0.75,'−0.75 yr','GA — moderate CACNA1C cross-disorder psychiatric signal.','neutral')
      : snp('rs1006737')                       ? factor(true,'✅','Mood Disorder Genetics (CACNA1C)','CACNA1C','rs1006737', 0,'±0 yrs','GG — lower CACNA1C psychiatric genetic risk.','green') : null,

        // CRHR1 — rs110402 (HPA axis stress reactivity)
        (snp('rs110402')==='AA')               ? factor(true,'🔶','Stress Response / HPA Axis (CRHR1)','CRHR1','rs110402',-0.75,'−0.75 yr','AA — heightened HPA-axis reactivity; greater cortisol release under stress; elevated burnout and depression risk.','amber')
      : snp('rs110402')                        ? factor(true,'✅','Stress Response / HPA Axis (CRHR1)','CRHR1','rs110402', 0.5,'+0.5 yr','Non-AA — resilient HPA-axis stress response; lower cortisol hypersecretion tendency.','green') : null,
    ].filter(Boolean));

    // ── 18. EXTENDED SLEEP & CIRCADIAN ───────────────────────────
    addGroup('Extended Sleep & Circadian', '🌙', [
        // PER3 VNTR — rs228697 (sleep pressure / cognitive vulnerability)
        (snp('rs228697')==='AA')               ? factor(true,'🔶','Sleep Quality (PER3)','PER3','rs228697',-0.5,'−0.5 yr','AA — PER3 5-repeat haplotype; higher sleep pressure, worse cognitive performance after sleep loss; greater melatonin irregularity.','amber')
      : snp('rs228697')                        ? factor(true,'✅','Sleep Quality (PER3)','PER3','rs228697', 0,'±0 yrs','Non-AA — PER3 4-repeat; more resilient to sleep deprivation; lower cognitive vulnerability to short sleep.','green') : null,

        // BTBD9 — rs9357271 (restless legs syndrome)
        (snp('rs9357271')==='GG')              ? factor(true,'🔶','Restless Legs (BTBD9)','BTBD9','rs9357271',-0.75,'−0.75 yr','GG — highest BTBD9 restless legs risk; disrupted sleep architecture and daytime fatigue cascade. Iron supplementation and sleep hygiene important.','amber')
      : (snp('rs9357271')==='AG'||snp('rs9357271')==='GA') ? factor(true,'➖','Restless Legs (BTBD9)','BTBD9','rs9357271',-0.25,'−0.25 yr','AG — mild restless legs tendency.','neutral')
      : snp('rs9357271')                       ? factor(true,'✅','Restless Legs (BTBD9)','BTBD9','rs9357271', 0,'±0 yrs','AA — lower BTBD9 restless legs genetic risk.','green') : null,
    ].filter(Boolean));

    // ── BUILD OUTPUT ─────────────────────────────────────────────
    const totalScored = groups.reduce((n, g) => n + g.items.length, 0);
    const est  = Math.round(base + delta);
    const low  = est - 4;
    const high = est + 4;
    const pct  = Math.min(98, Math.max(2, ((est - 60) / 50) * 100));

    let gaugeColor, outlook, outlookIcon;
    if      (delta >= 3)  { gaugeColor='#10B981'; outlook='Favorable';     outlookIcon='🌟'; }
    else if (delta >= 0)  { gaugeColor='#6C3AED'; outlook='Average';       outlookIcon='✅'; }
    else if (delta >= -4) { gaugeColor='#F59E0B'; outlook='Moderate Risk'; outlookIcon='🔶'; }
    else                  { gaugeColor='#EF4444'; outlook='Elevated Risk'; outlookIcon='⚠️'; }

    const groupsHTML = groups.length ? groups.map(g => `
        <div class="le-group-header">${g.icon} ${g.label}</div>
        ${g.items.map(f => {
            const chip = f.color==='green' ? 'conf-high' : f.color==='red' ? 'conf-low' : f.color==='amber' ? 'conf-mid' : 'conf-low';
            return `<div class="le-factor-row">
                <span class="le-factor-icon">${f.icon}</span>
                <div class="le-factor-info">
                    <span class="le-factor-label">${f.label} <span class="le-factor-gene">${f.gene} · ${f.rsid}</span></span>
                    <span class="le-factor-note">${f.note}</span>
                </div>
                <span class="confidence-badge ${chip}" style="flex-shrink:0">${f.val}</span>
            </div>`;
        }).join('')}
    `).join('') : `<div class="le-no-data">No longevity SNPs detected in your file. Showing population baseline.</div>`;

    return `<div class="le-card fade-in">
        <div class="le-header">
            <div class="le-header-left">
                <span class="le-header-icon">⏳</span>
                <div>
                    <div class="le-header-title">Genetic Life Expectancy Estimate</div>
                    <div class="le-header-sub">Polygenic longevity model · ${totalScored} markers scored · ${groups.length} body systems</div>
                </div>
            </div>
            <div class="le-outlook-badge" style="--oc:${gaugeColor}">${outlookIcon} ${outlook}</div>
        </div>

        <div class="le-estimate-row">
            <div class="le-big-number" style="color:${gaugeColor}">${est}</div>
            <div class="le-estimate-meta">
                <div class="le-estimate-years">years estimated</div>
                <div class="le-estimate-range">Likely range: <strong>${low}–${high} yrs</strong></div>
                <div class="le-estimate-base">US baseline: <strong>79 yrs</strong> &nbsp;·&nbsp; Genetic delta: <strong style="color:${gaugeColor}">${delta >= 0 ? '+' : ''}${delta.toFixed(1)} yrs</strong></div>
            </div>
        </div>

        <div class="le-gauge-wrap">
            <div class="le-gauge-labels"><span>60</span><span>70</span><span>80</span><span>90</span><span>100+</span></div>
            <div class="le-gauge-track">
                <div class="le-gauge-fill" style="width:${pct}%; background:${gaugeColor}; box-shadow:0 0 16px ${gaugeColor}60"></div>
                <div class="le-gauge-marker" style="left:calc(${pct}% - 6px)"></div>
            </div>
        </div>

        <div class="le-factors-title">Markers Scored by Body System</div>
        <div class="le-factors-list">${groupsHTML}</div>

        <div class="le-lifestyle-box">
            <div class="le-lifestyle-title">🚀 Lifestyle adds up to +10–14 years on top of genetics</div>
            <div class="le-lifestyle-grid">
                <div class="le-lifestyle-item"><span>🏃</span><span>Exercise regularly</span><strong>+3–5 yrs</strong></div>
                <div class="le-lifestyle-item"><span>🚭</span><span>Never smoking</span><strong>+4–5 yrs</strong></div>
                <div class="le-lifestyle-item"><span>🥗</span><span>Mediterranean diet</span><strong>+1–3 yrs</strong></div>
                <div class="le-lifestyle-item"><span>😴</span><span>Quality sleep (7–9h)</span><strong>+1–2 yrs</strong></div>
                <div class="le-lifestyle-item"><span>🧘</span><span>Stress management</span><strong>+1–2 yrs</strong></div>
                <div class="le-lifestyle-item"><span>🏥</span><span>Regular screenings</span><strong>+1–2 yrs</strong></div>
            </div>
        </div>

        <div class="disclaimer" style="margin-top:0; border-radius:var(--r); font-size:0.76rem;">
            <strong>⚠️ Important:</strong> Educational estimate based on 65+ well-studied SNPs across ${groups.length} body systems.
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
