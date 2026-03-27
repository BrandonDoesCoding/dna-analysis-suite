// =============================================
// CATEGORY DEFINITIONS & ANCESTRY REFERENCE
// =============================================

const CATEGORIES = {
    // ══ PHENOTYPE ══
    eye:       { icon: '👁️', title: 'Eye Color', note: 'Individual SNPs below are components. The final prediction in the summary above combines all signals.' },
    hair:      { icon: '💇', title: 'Hair Color' },
    skin:      { icon: '🎨', title: 'Skin & Pigmentation' },
    face:      { icon: '🧬', title: 'Face & Morphology' },
    height:    { icon: '📏', title: 'Height & Growth', note: 'Height is influenced by ~20,000 SNPs. These high-effect loci capture only a tendency — environmental factors play a large role.' },

    // ══ METABOLISM & SENSES ══
    metabolism:{ icon: '⚗️', title: 'Metabolism & Body' },
    brain:     { icon: '🧠', title: 'Brain & Senses' },
    nutrition: { icon: '🥗', title: 'Nutrition & Vitamins' },

    // ══ PERFORMANCE & HEALTH ══
    athletic:  { icon: '🏋️', title: 'Athletic Performance' },
    sleep:     { icon: '😴', title: 'Sleep & Circadian' },
    longevity: { icon: '🧬', title: 'Longevity & Aging' },

    // ══ MEDICAL ══
    immune:    { icon: '🩸', title: 'Immune & Blood' },
    vision:    { icon: '👁️', title: 'Vision' },
    disease:   { icon: '⚠️', title: 'Disease Risk (Polygenic)' },

    // ══ ANCESTRY & GENETICS ══
    haplogroup: { icon: '🧬', title: 'Haplogroup Markers (Raw)', note: 'Individual Y-DNA and mtDNA SNP markers. See the Haplogroup Detection section above for the interpreted result.' },
    ancestry:  { icon: '🌍', title: 'Neanderthal Introgression Markers' },

    // ══ CARDIOVASCULAR ══
    cardiovascular: { icon: '❤️', title: 'Cardiovascular Health', note: 'Heart, blood pressure, lipid, and vascular genetic markers. Combine with lifestyle, BP, and cholesterol monitoring.' },

    // ══ BONE & JOINT ══
    bone:      { icon: '🦴', title: 'Bone & Joint Health', note: 'Bone mineral density, fracture risk, and osteoarthritis susceptibility markers.' },

    // ══ AUTOIMMUNE ══
    autoimmune: { icon: '🛡️', title: 'Autoimmune & Inflammation', note: 'Genetic susceptibility to autoimmune conditions and chronic inflammatory pathways.' },

    // ══ MENTAL HEALTH ══
    mental:    { icon: '💭', title: 'Mental Health Genetics', note: 'Neurotransmitter, stress-pathway, and mood-regulation variants. Environment and lifestyle are dominant factors.' },

    // ══ HORMONAL ══
    hormonal:  { icon: '⚗️', title: 'Hormonal & Endocrine', note: 'Testosterone, estrogen, thyroid, and reproductive hormone binding/signaling variants.' },

    // ══ SKIN CONDITIONS ══
    skin_health: { icon: '🩹', title: 'Skin Conditions & Sensitivity', note: 'Eczema, psoriasis, and skin inflammation risk markers. Not diagnostic — clinical evaluation required.' },

    // ══ CANCER RISK ══
    cancer:    { icon: '🎗️', title: 'Cancer Susceptibility (Polygenic)', note: 'Common low-effect SNPs contributing incrementally to cancer risk. Each adds <1% individually — total polygenic scores matter more. Screen per guidelines.' },

    // ══ MEDICAL/CLINICAL ══
    pharmacogx: { icon: '💊', title: 'Pharmacogenomics (Drug Response)' },
    carrier:   { icon: '⚠️', title: 'Carrier Status (Recessive Diseases)' },
};

// Ancestry-informative markers with continental reference alleles
const ANCESTRY_SNPS = {
    rs1426654:  { eur: 'A', afr: 'G', eas: 'A', sas: 'A' },
    rs16891982: { eur: 'G', afr: 'C', eas: 'C', sas: 'C' },
    rs3827760:  { eur: 'A', afr: 'A', eas: 'G', sas: 'A' },
    rs1042602:  { eur: 'A', afr: 'C', eas: 'C', sas: 'C' },
    rs12913832: { eur: 'G', afr: 'A', eas: 'A', sas: 'A' },
    rs4988235:  { eur: 'T', afr: 'G', eas: 'G', sas: 'G' },
    rs671:      { eur: 'G', afr: 'G', eas: 'A', sas: 'G' },
    rs1229984:  { eur: 'T', afr: 'T', eas: 'C', sas: 'T' },
    rs17822931: { eur: 'C', afr: 'C', eas: 'T', sas: 'C' },
    rs12821256: { eur: 'T', afr: 'C', eas: 'C', sas: 'C' },
    rs1805007:  { eur: 'T', afr: 'C', eas: 'C', sas: 'C' },
    rs1805008:  { eur: 'T', afr: 'C', eas: 'C', sas: 'C' },
    rs1815739:  { eur: 'C', afr: 'T', eas: 'T', sas: 'T' },
    rs1800407:  { eur: 'C', afr: 'C', eas: 'C', sas: 'C' },
};
