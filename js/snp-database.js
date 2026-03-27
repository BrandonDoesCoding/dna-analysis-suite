// =============================================
// SNP DATABASE — All trait-associated SNPs
// =============================================

// Helper: simple interpret factory
function I(mapping) {
    return g => {
        const k = g.toUpperCase();
        if (mapping[k]) return mapping[k];
        for (const [pat, v] of Object.entries(mapping)) {
            if (pat === '_HET' && k.length === 2 && k[0] !== k[1]) return v;
        }
        return mapping['_DEF'] || { emoji: '❓', pred: 'Unknown', conf: 20, detail: 'Unrecognized genotype' };
    };
}

const SNP_DB = {

// ══════════════════════════════════════
//  👁️  EYE COLOR
// ══════════════════════════════════════
rs12913832: { gene: 'HERC2/OCA2', category: 'eye', trait: 'Eye Color (primary)', interpret: I({
    'GG': { emoji: '🔵', pred: 'Blue / Light', conf: 90, detail: 'Two copies of blue-eye allele — strongest predictor' },
    'AG': { emoji: '🟢', pred: 'Green / Hazel likely', conf: 70, detail: 'One blue allele — intermediate color' },
    'GA': { emoji: '🟢', pred: 'Green / Hazel likely', conf: 70, detail: 'One blue allele — intermediate color' },
    '_DEF': { emoji: '🟤', pred: 'Brown / Dark', conf: 85, detail: 'Two brown-eye alleles (AA)' }
})},
rs1800407: { gene: 'OCA2 R419Q', category: 'eye', trait: 'Eye Color (green modifier)', interpret: I({
    'TT': { emoji: '🟢', pred: 'Green modifier present', conf: 60, detail: 'Green eye modifier — shifts blue toward green' },
    'AA': { emoji: '🟢', pred: 'Green modifier present', conf: 60, detail: 'Green eye modifier variant' },
    '_HET': { emoji: '🟢', pred: 'Possible green tint', conf: 45, detail: 'Heterozygous green modifier' },
    '_DEF': { emoji: '⚪', pred: 'No green modifier', conf: 60, detail: 'Common genotype' }
})},
rs12203592: { gene: 'IRF4', category: 'eye', trait: 'Eye/Skin Lightening (IRF4)', interpret: I({
    'TT': { emoji: '✨', pred: 'Higher freckling tendency', conf: 55, detail: 'Strong IRF4 effect — pigmentation lightening' },
    '_HET': { emoji: '🔸', pred: 'Mild freckle tendency', conf: 35, detail: 'Heterozygous — moderate pigment effect' },
    '_DEF': { emoji: '⚪', pred: 'No IRF4 freckle signal', conf: 55, detail: 'Common variant' }
})},
rs1393350: { gene: 'TYR', category: 'eye', trait: 'Eye Color (blue/green boost)', interpret: I({
    'AA': { emoji: '🔵', pred: 'Blue/green eye boost', conf: 50, detail: 'TYR variant — light eye association' },
    '_HET': { emoji: '🔸', pred: 'Mild light-eye effect', conf: 40, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Typical pigmentation', conf: 45, detail: 'Common' }
})},
rs7495174: { gene: 'OCA2 intron', category: 'eye', trait: 'Eye Color (OCA2 haplotype)', interpret: I({
    'GG': { emoji: '🔵', pred: 'Light eye tendency', conf: 55, detail: 'OCA2 haplotype block — blue/green association' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 35, detail: 'One light allele' },
    '_DEF': { emoji: '🟤', pred: 'Dark eye tendency', conf: 50, detail: 'Common' }
})},
rs1129038: { gene: 'HERC2', category: 'eye', trait: 'Eye Color (secondary HERC2)', interpret: I({
    'GG': { emoji: '🔵', pred: 'Blue eye support', conf: 80, detail: 'HERC2 enhancer — strongly linked to rs12913832' },
    '_HET': { emoji: '🟢', pred: 'Intermediate eye color', conf: 55, detail: 'Heterozygous HERC2' },
    '_DEF': { emoji: '🟤', pred: 'Brown eye tendency', conf: 75, detail: 'Dominant allele' }
})},
rs16891982: { gene: 'SLC45A2 L374F', category: 'eye', trait: 'Eye/Skin (SLC45A2)', interpret: I({
    'GG': { emoji: '🔵', pred: 'Light eyes & skin', conf: 65, detail: 'SLC45A2 derived — European light pigmentation' },
    'CC': { emoji: '🔵', pred: 'Light eyes & skin', conf: 65, detail: 'SLC45A2 derived' },
    '_HET': { emoji: '🔸', pred: 'Intermediate pigmentation', conf: 50, detail: 'Heterozygous' },
    '_DEF': { emoji: '🟤', pred: 'Darker pigmentation', conf: 60, detail: 'Ancestral variant' }
})},

// ══════════════════════════════════════
//  💇  HAIR COLOR
// ══════════════════════════════════════
rs12821256: { gene: 'KITLG', category: 'hair', trait: 'Blond Hair (major)', interpret: I({
    'TT': { emoji: '💛', pred: 'Blond hair (strong)', conf: 70, detail: 'KITLG — strongest blond predictor after HERC2' },
    'CC': { emoji: '💛', pred: 'Blond hair (strong)', conf: 70, detail: 'KITLG derived light variant' },
    '_HET': { emoji: '🔸', pred: 'Mild blond tendency', conf: 45, detail: 'Heterozygous — partial blond effect' },
    '_DEF': { emoji: '⚫', pred: 'Darker hair tendency', conf: 50, detail: 'Common' }
})},
rs1110400: { gene: 'MC1R V92M', category: 'hair', trait: 'Red Hair (V92M moderate)', interpret: I({
    'TT': { emoji: '🟠', pred: 'Red/auburn tendency', conf: 55, detail: 'Homozygous V92M — moderate red hair association' },
    'CC': { emoji: '🟠', pred: 'Red/auburn tendency', conf: 55, detail: 'Homozygous V92M' },
    '_HET': { emoji: '🔸', pred: 'Slight red tendency', conf: 35, detail: 'Carrier V92M' },
    '_DEF': { emoji: '⚪', pred: 'No V92M red effect', conf: 50, detail: 'Common' }
})},
rs1805008: { gene: 'MC1R R160W', category: 'hair', trait: 'Red Hair (R160W)', interpret: I({
    'TT': { emoji: '🟠', pred: 'Red/auburn tendency', conf: 65, detail: 'Homozygous R160W — strong red' },
    '_HET': { emoji: '🔸', pred: 'Red hair carrier', conf: 40, detail: 'Heterozygous R160W' },
    '_DEF': { emoji: '⚪', pred: 'Not R160W carrier', conf: 50, detail: 'Common' }
})},
rs1805007: { gene: 'MC1R R151C', category: 'hair', trait: 'Red Hair (major R151C)', interpret: I({
    'TT': { emoji: '🔴', pred: 'Strong red hair', conf: 80, detail: 'Homozygous R151C — strongest red hair variant' },
    '_HET': { emoji: '🟠', pred: 'Red hair carrier', conf: 50, detail: 'One R151C allele — carrier' },
    '_DEF': { emoji: '⚪', pred: 'Not R151C carrier', conf: 50, detail: 'Common' }
})},
rs28777: { gene: 'SLC45A2', category: 'hair', trait: 'Pigment Lightening (SLC45A2)', interpret: I({
    'GG': { emoji: '☀️', pred: 'Lighter pigmentation', conf: 55, detail: 'SLC45A2 light variant' },
    'CC': { emoji: '☀️', pred: 'Lighter pigmentation', conf: 55, detail: 'Light variant' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 40, detail: 'Heterozygous' },
    '_DEF': { emoji: '🌑', pred: 'Darker pigmentation', conf: 50, detail: 'Ancestral' }
})},
rs1805005: { gene: 'MC1R V60L', category: 'hair', trait: 'Red Hair (mild V60L)', interpret: I({
    'TT': { emoji: '🟠', pred: 'Mild red/light effect', conf: 40, detail: 'Homozygous V60L' },
    'AA': { emoji: '🟠', pred: 'Mild red/light effect', conf: 40, detail: 'Homozygous V60L' },
    '_HET': { emoji: '🔸', pred: 'Slight effect', conf: 30, detail: 'V60L carrier' },
    '_DEF': { emoji: '⚪', pred: 'No V60L effect', conf: 45, detail: 'Common' }
})},
rs1805006: { gene: 'MC1R D294H', category: 'hair', trait: 'Red Hair (D294H)', interpret: I({
    'AA': { emoji: '🔴', pred: 'Red tendency (D294H)', conf: 55, detail: 'Homozygous D294H' },
    '_HET': { emoji: '🔸', pred: 'Red carrier', conf: 35, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Not D294H carrier', conf: 45, detail: 'Common' }
})},
rs11547464: { gene: 'MC1R R142H', category: 'hair', trait: 'Red Hair (R142H)', interpret: I({
    'AA': { emoji: '🔴', pred: 'Red tendency (R142H)', conf: 55, detail: 'Homozygous R142H' },
    '_HET': { emoji: '🔸', pred: 'Red carrier', conf: 35, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Not R142H carrier', conf: 45, detail: 'Common' }
})},
rs1805009: { gene: 'MC1R D84E', category: 'hair', trait: 'Red Hair (D84E)', interpret: I({
    '_HET': { emoji: '🔸', pred: 'Red carrier', conf: 35, detail: 'Heterozygous D84E' },
    '_DEF': { emoji: '⚪', pred: 'Not D84E carrier', conf: 45, detail: 'Common' }
})},
rs12896399: { gene: 'SLC24A4', category: 'hair', trait: 'Hair Lightening (SLC24A4)', interpret: I({
    'TT': { emoji: '💛', pred: 'Blond hair tendency', conf: 45, detail: 'Two light alleles' },
    '_HET': { emoji: '🔸', pred: 'Mild light-hair effect', conf: 35, detail: 'One light allele' },
    '_DEF': { emoji: '⚫', pred: 'Darker hair tendency', conf: 40, detail: 'Common' }
})},
rs1042602: { gene: 'TYR S192Y', category: 'hair', trait: 'Hair Lightening (TYR)', interpret: I({
    'AA': { emoji: '💛', pred: 'Light hair boost', conf: 40, detail: 'Two blond alleles' },
    '_HET': { emoji: '🔸', pred: 'Mild light-hair effect', conf: 35, detail: 'One blond allele' },
    '_DEF': { emoji: '⚫', pred: 'Darker tendency', conf: 35, detail: 'Common' }
})},
rs683: { gene: 'TYRP1', category: 'hair', trait: 'Blond Hair (TYRP1)', interpret: I({
    'AA': { emoji: '💛', pred: 'Blond tendency', conf: 35, detail: 'TYRP1 two light alleles' },
    '_HET': { emoji: '🔸', pred: 'Slight blond tendency', conf: 30, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚫', pred: 'Darker tendency', conf: 30, detail: 'Common' }
})},
rs2228479: { gene: 'MC1R V92M alt', category: 'hair', trait: 'Hair Color modifier (MC1R)', interpret: I({
    'AA': { emoji: '🟠', pred: 'Red/light modifier', conf: 40, detail: 'MC1R non-synonymous variant' },
    '_HET': { emoji: '🔸', pred: 'Slight modifier', conf: 28, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Typical MC1R', conf: 35, detail: 'Common' }
})},

// ══════════════════════════════════════
//  🎨  SKIN & PIGMENTATION
// ══════════════════════════════════════
rs1426654: { gene: 'SLC24A5', category: 'skin', trait: 'Skin Pigmentation (strongest)', interpret: I({
    'AA': { emoji: '🏻', pred: 'Light skin (European)', conf: 92, detail: 'SLC24A5 — strongest skin-lightening variant, nearly fixed in Europeans' },
    'GG': { emoji: '🏻', pred: 'Light skin (European)', conf: 92, detail: 'SLC24A5 derived' },
    '_HET': { emoji: '🔸', pred: 'Intermediate skin tone', conf: 60, detail: 'Heterozygous' },
    '_DEF': { emoji: '🏾', pred: 'Darker skin tone', conf: 85, detail: 'Ancestral variant' }
})},
rs4911414: { gene: 'MC1R region', category: 'skin', trait: 'Freckles', interpret: I({
    'GG': { emoji: '✨', pred: 'Possible freckling tendency', conf: 30, detail: 'Freckle-associated variant near MC1R' },
    'TT': { emoji: '✨', pred: 'Possible freckling tendency', conf: 30, detail: 'Freckle variant' },
    '_HET': { emoji: '🔸', pred: 'Moderate freckle chance', conf: 25, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Typical freckling', conf: 30, detail: 'Common' }
})},
rs10756819: { gene: 'BNC2', category: 'skin', trait: 'Skin Saturation / Freckling', interpret: I({
    'AA': { emoji: '✨', pred: 'Possible freckling tendency', conf: 30, detail: 'BNC2 variant' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 25, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Typical freckling', conf: 30, detail: 'Common' }
})},
rs2424984: { gene: 'ASIP', category: 'skin', trait: 'Tanning Response', interpret: I({
    'TT': { emoji: '☀️', pred: 'Tans easily', conf: 45, detail: 'ASIP — melanocyte switching signal favors tanning' },
    '_HET': { emoji: '🔸', pred: 'Moderate tanning', conf: 35, detail: 'Intermediate' },
    '_DEF': { emoji: '🔥', pred: 'Burns more easily', conf: 40, detail: 'Reduced tanning response' }
})},
rs1015362: { gene: 'ASIP', category: 'skin', trait: 'Skin Pigment (ASIP)', interpret: I({
    'GG': { emoji: '🏻', pred: 'Lighter skin tendency', conf: 40, detail: 'ASIP regulatory variant' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 30, detail: 'Heterozygous' },
    '_DEF': { emoji: '🏽', pred: 'Darker skin tendency', conf: 35, detail: 'Common' }
})},
rs6119471: { gene: 'ASIP', category: 'skin', trait: 'Melanin Production', interpret: I({
    'CC': { emoji: '🏻', pred: 'Reduced melanin', conf: 45, detail: 'ASIP — reduced melanocortin signaling' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 30, detail: 'Heterozygous' },
    '_DEF': { emoji: '🏽', pred: 'Typical melanin', conf: 40, detail: 'Common' }
})},

// ══════════════════════════════════════
//  🧬  FACE & MORPHOLOGY
// ══════════════════════════════════════
rs3827760: { gene: 'EDAR V370A', category: 'face', trait: 'Hair Thickness / Teeth Shape', interpret: I({
    'GG': { emoji: '🪶', pred: 'Thick hair / shovel-shaped incisors', conf: 75, detail: 'East Asian derived EDAR variant' },
    'CC': { emoji: '🪶', pred: 'Thick hair / shovel-shaped incisors', conf: 75, detail: 'EDAR derived' },
    '_HET': { emoji: '🔸', pred: 'Intermediate hair thickness', conf: 45, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Typical hair texture', conf: 50, detail: 'Ancestral' }
})},
rs17646946: { gene: 'WNT10A', category: 'face', trait: 'Hair Curliness (WNT10A)', interpret: I({
    'GG': { emoji: '🌀', pred: 'Curlier hair tendency', conf: 40, detail: 'WNT10A curl association' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 30, detail: 'Heterozygous' },
    '_DEF': { emoji: '📏', pred: 'Straighter tendency', conf: 35, detail: 'Common' }
})},
rs2218065: { gene: 'OFCC1', category: 'face', trait: 'Hair Curliness (OFCC1)', interpret: I({
    'GG': { emoji: '🌀', pred: 'Curlier hair tendency', conf: 35, detail: 'OFCC1 curl association' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 28, detail: 'Heterozygous' },
    '_DEF': { emoji: '📏', pred: 'Straighter tendency', conf: 30, detail: 'Common' }
})},
rs1160312: { gene: '20p11', category: 'face', trait: 'Male Pattern Baldness', interpret: I({
    'AA': { emoji: '🔴', pred: 'Higher baldness risk', conf: 45, detail: 'Risk genotype at 20p11 locus' },
    '_HET': { emoji: '🔸', pred: 'Moderate baldness risk', conf: 35, detail: 'Intermediate' },
    '_DEF': { emoji: '⚪', pred: 'Lower baldness risk', conf: 35, detail: 'Protective genotype' }
})},
rs7349332: { gene: 'FRAS1', category: 'face', trait: 'Hair Curliness (FRAS1)', interpret: I({
    'TT': { emoji: '🌀', pred: 'Curlier tendency', conf: 30, detail: 'FRAS1 variant' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 25, detail: 'Heterozygous' },
    '_DEF': { emoji: '📏', pred: 'Straighter tendency', conf: 30, detail: 'Common' }
})},
rs1478567: { gene: 'DCHS2', category: 'face', trait: 'Nose Shape (DCHS2)', interpret: I({
    'CC': { emoji: '👃', pred: 'Pointier / narrower nose', conf: 35, detail: 'DCHS2 nose pointedness variant' },
    '_HET': { emoji: '🔸', pred: 'Intermediate nose shape', conf: 25, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Broader nose tendency', conf: 30, detail: 'Common' }
})},
rs11803731: { gene: 'TCHH', category: 'face', trait: 'Hair Curliness (strong TCHH)', interpret: I({
    'AA': { emoji: '🌀', pred: 'Curly hair (strong)', conf: 50, detail: 'TCHH — trichohyalin, strong curl predictor' },
    '_HET': { emoji: '🔸', pred: 'Wavy tendency', conf: 35, detail: 'Heterozygous' },
    '_DEF': { emoji: '📏', pred: 'Straighter tendency', conf: 35, detail: 'Common' }
})},
rs7544382: { gene: 'PAX3', category: 'face', trait: 'Unibrow Tendency', interpret: I({
    'CC': { emoji: '🫣', pred: 'Higher unibrow tendency', conf: 35, detail: 'PAX3 variant — eyebrow thickness' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 25, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Lower unibrow tendency', conf: 30, detail: 'Common' }
})},
rs10195570: { gene: 'Intergenic', category: 'face', trait: 'Earlobe Attachment', interpret: I({
    'AA': { emoji: '👂', pred: 'Attached earlobes', conf: 40, detail: 'Attached earlobe variant' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 30, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Free earlobes', conf: 40, detail: 'Common' }
})},
rs17580: { gene: 'SERPINA1', category: 'face', trait: 'Chin Shape (cleft)', interpret: I({
    'AA': { emoji: '🧔', pred: 'Cleft chin tendency', conf: 30, detail: 'SERPINA1 association' },
    '_HET': { emoji: '🔸', pred: 'Possible cleft', conf: 22, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Smooth chin likely', conf: 30, detail: 'Common' }
})},
rs2289252: { gene: 'Intergenic', category: 'face', trait: 'Dimples', interpret: I({
    'TT': { emoji: '😊', pred: 'Dimple tendency', conf: 25, detail: 'Weak association' },
    '_HET': { emoji: '🔸', pred: 'Possible dimples', conf: 18, detail: 'Weak' },
    '_DEF': { emoji: '⚪', pred: 'No dimple tendency', conf: 25, detail: 'Common' }
})},
rs3746444: { gene: 'MIR499A', category: 'face', trait: 'Lip Thickness', interpret: I({
    'GG': { emoji: '👄', pred: 'Fuller lips tendency', conf: 30, detail: 'miRNA variant' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 22, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Thinner lips tendency', conf: 28, detail: 'Common' }
})},
rs4648379: { gene: 'PRDM16', category: 'face', trait: 'Nose Width (PRDM16)', interpret: I({
    'CC': { emoji: '👃', pred: 'Wider nose tendency', conf: 30, detail: 'PRDM16 — nose breadth locus' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 22, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Narrower nose tendency', conf: 28, detail: 'Common' }
})},

// ══════════════════════════════════════
//  📏  HEIGHT & GROWTH
// ══════════════════════════════════════
rs143384: { gene: 'GDF5', category: 'height', trait: 'Height / Joint Health', interpret: I({
    'AA': { emoji: '📉', pred: 'Shorter tendency', conf: 30, detail: 'Reduced height + higher osteoarthritis risk' },
    '_HET': { emoji: '📊', pred: 'Average effect', conf: 25, detail: 'Intermediate' },
    '_DEF': { emoji: '📈', pred: 'Taller tendency', conf: 28, detail: 'Height-increasing alleles' }
})},
rs7759938: { gene: 'LIN28B', category: 'height', trait: 'Growth Timing / Puberty', interpret: I({
    'TT': { emoji: '📈', pred: 'Later growth / taller', conf: 30, detail: 'LIN28B — delayed puberty timing, more growth' },
    '_HET': { emoji: '📊', pred: 'Average timing', conf: 25, detail: 'Intermediate' },
    '_DEF': { emoji: '📉', pred: 'Earlier growth / shorter', conf: 28, detail: 'Earlier puberty onset' }
})},
rs1042725: { gene: 'HMGA2', category: 'height', trait: 'Height (major HMGA2)', interpret: I({
    'CC': { emoji: '📈', pred: 'Taller tendency', conf: 30, detail: 'HMGA2 — major height locus' },
    '_HET': { emoji: '📊', pred: 'Average effect', conf: 25, detail: 'Intermediate' },
    '_DEF': { emoji: '📉', pred: 'Shorter tendency', conf: 25, detail: 'Common' }
})},
rs6060369: { gene: 'GDF5-UQCC', category: 'height', trait: 'Height (GDF5-UQCC)', interpret: I({
    'TT': { emoji: '📈', pred: 'Taller tendency', conf: 25, detail: 'GDF5-UQCC locus' },
    '_HET': { emoji: '📊', pred: 'Average effect', conf: 22, detail: 'Intermediate' },
    '_DEF': { emoji: '📉', pred: 'Shorter tendency', conf: 25, detail: 'Common' }
})},
rs6440003: { gene: 'LCORL', category: 'height', trait: 'Height (LCORL)', interpret: I({
    'GG': { emoji: '📈', pred: 'Taller tendency', conf: 28, detail: 'LCORL — one of strongest height-associated loci' },
    '_HET': { emoji: '📊', pred: 'Average', conf: 22, detail: 'Intermediate' },
    '_DEF': { emoji: '📉', pred: 'Shorter tendency', conf: 25, detail: 'Common' }
})},
rs3791679: { gene: 'EFEMP1', category: 'height', trait: 'Height (EFEMP1)', interpret: I({
    'AA': { emoji: '📈', pred: 'Taller tendency', conf: 22, detail: 'EFEMP1 height variant' },
    '_HET': { emoji: '📊', pred: 'Average', conf: 18, detail: 'Intermediate' },
    '_DEF': { emoji: '📉', pred: 'Shorter tendency', conf: 20, detail: 'Common' }
})},

// ══════════════════════════════════════
//  ⚗️  METABOLISM & BODY
// ══════════════════════════════════════
rs17822931: { gene: 'ABCC11', category: 'metabolism', trait: 'Earwax Type / Body Odor', interpret: I({
    'CC': { emoji: '💧', pred: 'Wet earwax / typical body odor', conf: 95, detail: 'Common worldwide except East Asia' },
    'GG': { emoji: '💧', pred: 'Wet earwax / typical body odor', conf: 95, detail: 'Common' },
    'TT': { emoji: '❄️', pred: 'Dry earwax / less body odor', conf: 95, detail: 'East Asian common variant — less apocrine secretion' },
    'AA': { emoji: '❄️', pred: 'Dry earwax / less body odor', conf: 95, detail: 'Derived variant' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 70, detail: 'Heterozygous — wet is dominant' },
    '_DEF': { emoji: '💧', pred: 'Wet earwax (default)', conf: 60, detail: 'Common' }
})},
rs671: { gene: 'ALDH2', category: 'metabolism', trait: 'Alcohol Flush Reaction', interpret: I({
    'GG': { emoji: '🟢', pred: 'No flush reaction', conf: 90, detail: 'Normal ALDH2 enzyme activity' },
    'CC': { emoji: '🟢', pred: 'No flush reaction', conf: 90, detail: 'Normal ALDH2' },
    'AA': { emoji: '🔴', pred: 'Strong flush reaction', conf: 90, detail: 'ALDH2 deficiency — avoid excess alcohol' },
    '_HET': { emoji: '🟡', pred: 'Mild flush possible', conf: 75, detail: 'One deficient allele — moderate acetaldehyde buildup' },
    '_DEF': { emoji: '🟢', pred: 'No flush (default)', conf: 60, detail: 'Common' }
})},
rs4988235: { gene: 'LCT/MCM6', category: 'metabolism', trait: 'Lactose Tolerance', interpret: I({
    'AA': { emoji: '🥛', pred: 'Lactose tolerant (persistent)', conf: 90, detail: 'European lactase persistence allele — can digest dairy' },
    'TT': { emoji: '🥛', pred: 'Lactose tolerant (persistent)', conf: 90, detail: 'Persistence allele' },
    '_HET': { emoji: '🔸', pred: 'Partial lactose tolerance', conf: 65, detail: 'One persistence allele — may tolerate some dairy' },
    '_DEF': { emoji: '🚫', pred: 'Lactose intolerant (likely)', conf: 85, detail: 'No European persistence allele — lactase declines after childhood' }
})},
rs1229984: { gene: 'ADH1B', category: 'metabolism', trait: 'Alcohol Metabolism Speed', interpret: I({
    'CC': { emoji: '⚡', pred: 'Ultra-fast alcohol metabolism', conf: 75, detail: 'ADH1B*2 — rapid ethanol→acetaldehyde conversion' },
    'TT': { emoji: '⚡', pred: 'Ultra-fast metabolism', conf: 75, detail: 'ADH1B*2' },
    '_HET': { emoji: '🔸', pred: 'Fast metabolism', conf: 55, detail: 'Heterozygous — faster than average' },
    '_DEF': { emoji: '🟢', pred: 'Normal metabolism speed', conf: 65, detail: 'Common variant' }
})},
rs762551: { gene: 'CYP1A2', category: 'metabolism', trait: 'Caffeine Metabolism', interpret: I({
    'AA': { emoji: '☕⚡', pred: 'Fast caffeine metabolizer', conf: 70, detail: 'CYP1A2*1A — rapid clearance, coffee is protective' },
    '_HET': { emoji: '🔸', pred: 'Moderate caffeine metabolism', conf: 50, detail: 'Intermediate clearance' },
    '_DEF': { emoji: '☕🐢', pred: 'Slow caffeine metabolizer', conf: 65, detail: 'Slow clearance — limit intake, higher MI risk with coffee' }
})},
rs9939609: { gene: 'FTO', category: 'metabolism', trait: 'Weight / Appetite (FTO)', interpret: I({
    'AA': { emoji: '⬆️', pred: 'Higher BMI tendency (+~3kg)', conf: 50, detail: 'FTO risk alleles — increased appetite signaling, modifiable with exercise' },
    '_HET': { emoji: '🔸', pred: 'Slightly higher BMI tendency', conf: 35, detail: 'One risk allele — ~1.5kg effect' },
    '_DEF': { emoji: '✅', pred: 'Normal weight tendency', conf: 40, detail: 'Lower appetite drive' }
})},
rs1801282: { gene: 'PPARG', category: 'metabolism', trait: 'Insulin Sensitivity (PPARG)', interpret: I({
    'CC': { emoji: '🟢', pred: 'Better insulin sensitivity', conf: 45, detail: 'PPARG Pro12Ala — protective variant against diabetes' },
    '_HET': { emoji: '🟢', pred: 'Improved insulin sensitivity', conf: 40, detail: 'Heterozygous protective' },
    '_DEF': { emoji: '🔸', pred: 'Normal insulin sensitivity', conf: 35, detail: 'Common' }
})},
rs1801133: { gene: 'MTHFR C677T', category: 'metabolism', trait: 'Folate Metabolism (MTHFR)', interpret: I({
    'TT': { emoji: '⚠️', pred: 'Reduced folate processing (70%↓)', conf: 75, detail: 'MTHFR TT — supplement with methylfolate, avoid folic acid' },
    'AA': { emoji: '🟢', pred: 'Normal folate metabolism', conf: 75, detail: 'Wild-type MTHFR' },
    '_HET': { emoji: '🔸', pred: 'Mildly reduced folate (35%↓)', conf: 55, detail: 'Heterozygous — moderate impact, B-vitamins helpful' },
    '_DEF': { emoji: '🟢', pred: 'Normal folate metabolism', conf: 50, detail: 'Common' }
})},
rs1801131: { gene: 'MTHFR A1298C', category: 'metabolism', trait: 'Folate Metabolism (A1298C)', interpret: I({
    'CC': { emoji: '⚠️', pred: 'Reduced MTHFR activity', conf: 50, detail: 'A1298C homozygous — lesser impact than C677T' },
    'GG': { emoji: '⚠️', pred: 'Reduced MTHFR activity', conf: 50, detail: 'Variant' },
    '_HET': { emoji: '🔸', pred: 'Mildly reduced', conf: 35, detail: 'Heterozygous' },
    '_DEF': { emoji: '🟢', pred: 'Normal', conf: 45, detail: 'Common' }
})},
rs4680: { gene: 'COMT Val158Met', category: 'metabolism', trait: 'Dopamine Clearance (COMT)', interpret: I({
    'GG': { emoji: '⚔️', pred: '"Warrior" — stress resilient', conf: 50, detail: 'Val/Val — fast dopamine clearance, performs well under pressure' },
    'AA': { emoji: '🧘', pred: '"Worrier" — detail focused', conf: 50, detail: 'Met/Met — slow clearance, better at planning, higher anxiety risk' },
    '_HET': { emoji: '⚖️', pred: 'Balanced stress response', conf: 45, detail: 'Val/Met — intermediate dopamine clearance' },
    '_DEF': { emoji: '⚖️', pred: 'Balanced', conf: 35, detail: 'Common' }
})},
rs1800497: { gene: 'DRD2/ANKK1 Taq1A', category: 'metabolism', trait: 'Dopamine Receptor Density', interpret: I({
    'TT': { emoji: '⬇️', pred: 'Fewer D2 receptors (~30%↓)', conf: 50, detail: 'Reward-seeking tendency, addiction susceptibility — modifiable' },
    'CC': { emoji: '🟢', pred: 'Normal D2 receptor density', conf: 50, detail: 'Typical dopamine signaling' },
    '_HET': { emoji: '🔸', pred: 'Slightly reduced D2', conf: 40, detail: 'Heterozygous' },
    '_DEF': { emoji: '🟢', pred: 'Normal D2 density', conf: 40, detail: 'Common' }
})},
rs2187668: { gene: 'HLA-DQ2.5', category: 'metabolism', trait: 'Celiac Disease Risk', interpret: I({
    'TT': { emoji: '🔴', pred: 'High celiac risk (HLA-DQ2.5)', conf: 60, detail: 'Primary celiac HLA — not diagnostic alone, requires triggers' },
    '_HET': { emoji: '⚠️', pred: 'Elevated celiac risk', conf: 45, detail: 'One DQ2.5 allele' },
    '_DEF': { emoji: '🟢', pred: 'Lower celiac risk', conf: 50, detail: 'Absent DQ2.5' }
})},
rs12785878: { gene: 'DHCR7/NADSYN1', category: 'metabolism', trait: 'Vitamin D Synthesis', interpret: I({
    'GG': { emoji: '☀️', pred: 'Higher vitamin D tendency', conf: 40, detail: 'More efficient vitamin D synthesis' },
    'TT': { emoji: '⬇️', pred: 'Lower vitamin D tendency', conf: 40, detail: 'May need supplementation' },
    '_HET': { emoji: '🔸', pred: 'Intermediate vitamin D', conf: 30, detail: 'Heterozygous' },
    '_DEF': { emoji: '☀️', pred: 'Normal vitamin D', conf: 30, detail: 'Common' }
})},
rs7041: { gene: 'GC/VDBP', category: 'metabolism', trait: 'Vitamin D Binding Protein', interpret: I({
    'TT': { emoji: '⬇️', pred: 'Lower vitamin D binding', conf: 35, detail: 'GC protein variant — may need higher D intake' },
    '_HET': { emoji: '🔸', pred: 'Intermediate', conf: 25, detail: 'Heterozygous' },
    '_DEF': { emoji: '🟢', pred: 'Normal binding', conf: 30, detail: 'Common' }
})},

// ══════════════════════════════════════
//  🧠  BRAIN & SENSES
// ══════════════════════════════════════
rs713598: { gene: 'TAS2R38', category: 'brain', trait: 'Bitter Taste (PTC/PROP)', interpret: I({
    'CC': { emoji: '😝', pred: 'Super-taster (bitter sensitive)', conf: 75, detail: 'Strong PTC/PROP perception — dislikes broccoli, coffee' },
    'GG': { emoji: '😝', pred: 'Super-taster', conf: 75, detail: 'TAS2R38 taster alleles' },
    '_HET': { emoji: '🔸', pred: 'Moderate taster', conf: 50, detail: 'Intermediate bitter sensitivity' },
    '_DEF': { emoji: '⚪', pred: 'Non-taster (low bitter)', conf: 70, detail: 'Cannot taste PTC/PROP well' }
})},
rs4481887: { gene: 'Near OR2M7', category: 'brain', trait: 'Asparagus Urine Smell', interpret: I({
    'AA': { emoji: '👃', pred: 'Can smell asparagus metabolite', conf: 55, detail: 'Strong detection of asparagus urine odor' },
    '_HET': { emoji: '🤔', pred: 'Intermediate detection', conf: 40, detail: 'May or may not notice' },
    '_DEF': { emoji: '⚪', pred: 'Cannot smell it', conf: 50, detail: 'No detection — common' }
})},
rs1799971: { gene: 'OPRM1 A118G', category: 'brain', trait: 'Pain Sensitivity / Opioid Response', interpret: I({
    'GG': { emoji: '🔴', pred: 'Higher pain sensitivity', conf: 45, detail: 'Modified mu-opioid receptor — may need higher analgesic doses' },
    '_HET': { emoji: '🔸', pred: 'Slightly higher sensitivity', conf: 35, detail: 'One variant allele' },
    '_DEF': { emoji: '⚪', pred: 'Typical pain sensitivity', conf: 35, detail: 'Normal receptor — standard opioid response' }
})},
rs10427255: { gene: 'Near ZEB2', category: 'brain', trait: 'Photic Sneeze Reflex (ACHOO)', interpret: I({
    'CC': { emoji: '🤧', pred: 'Sun sneezer likely', conf: 40, detail: 'ACHOO syndrome — sneezing triggered by bright light' },
    '_HET': { emoji: '😤', pred: 'Possible sun sneezer', conf: 30, detail: 'Intermediate' },
    '_DEF': { emoji: '⚪', pred: 'Not a sun sneezer', conf: 35, detail: 'Common' }
})},
rs6265: { gene: 'BDNF Val66Met', category: 'brain', trait: 'Memory & Neuroplasticity', interpret: I({
    'CC': { emoji: '🧠', pred: 'Better episodic memory', conf: 35, detail: 'Val/Val — optimal BDNF secretion & neuroplasticity' },
    'TT': { emoji: '🧠', pred: 'Better episodic memory', conf: 35, detail: 'Val/Val' },
    '_HET': { emoji: '📝', pred: 'Average memory function', conf: 30, detail: 'Intermediate BDNF secretion' },
    '_DEF': { emoji: '🔸', pred: 'Different memory profile', conf: 30, detail: 'Met/Met — altered BDNF secretion activity' }
})},
rs72921001: { gene: 'OR6A2', category: 'brain', trait: 'Cilantro / Coriander Taste', interpret: I({
    'AA': { emoji: '🧼', pred: 'Cilantro tastes soapy', conf: 55, detail: 'OR6A2 — aldehyde sensitivity makes cilantro taste like soap' },
    '_HET': { emoji: '🔸', pred: 'Mild soapy tendency', conf: 35, detail: 'Heterozygous — partial effect' },
    '_DEF': { emoji: '🟢', pred: 'Cilantro tastes normal/pleasant', conf: 50, detail: 'Common — enjoys cilantro' }
})},
rs53576: { gene: 'OXTR', category: 'brain', trait: 'Empathy / Social Bonding', interpret: I({
    'GG': { emoji: '💖', pred: 'Higher empathy tendency', conf: 35, detail: 'OXTR GG — enhanced oxytocin receptor, better social cognition' },
    '_HET': { emoji: '🔸', pred: 'Average empathy', conf: 28, detail: 'Intermediate oxytocin signaling' },
    '_DEF': { emoji: '⚪', pred: 'Typical empathy levels', conf: 30, detail: 'Common' }
})},
rs4570625: { gene: 'TPH2', category: 'brain', trait: 'Serotonin Production', interpret: I({
    'GG': { emoji: '😊', pred: 'Normal serotonin synthesis', conf: 40, detail: 'TPH2 — tryptophan hydroxylase 2, brain serotonin' },
    '_HET': { emoji: '🔸', pred: 'Slightly reduced serotonin', conf: 30, detail: 'Heterozygous' },
    'TT': { emoji: '⬇️', pred: 'Lower serotonin tendency', conf: 40, detail: 'May affect mood regulation — environmental factors important' },
    '_DEF': { emoji: '😊', pred: 'Normal serotonin', conf: 30, detail: 'Common' }
})},
rs1800955: { gene: 'DRD4', category: 'brain', trait: 'Novelty Seeking (DRD4)', interpret: I({
    'CC': { emoji: '🎯', pred: 'Higher novelty seeking', conf: 35, detail: 'DRD4 promoter — sensation-seeking, exploratory behavior' },
    'TT': { emoji: '⚪', pred: 'Lower novelty seeking', conf: 35, detail: 'More cautious temperament' },
    '_HET': { emoji: '🔸', pred: 'Moderate novelty seeking', conf: 28, detail: 'Intermediate' },
    '_DEF': { emoji: '⚪', pred: 'Typical', conf: 25, detail: 'Common' }
})},

// ══════════════════════════════════════
//  🏋️  ATHLETIC PERFORMANCE
// ══════════════════════════════════════
rs1815739: { gene: 'ACTN3 R577X', category: 'athletic', trait: 'Muscle Fiber Type (ACTN3)', interpret: I({
    'CC': { emoji: '💪', pred: 'Sprint/power advantage', conf: 60, detail: 'ACTN3 present — alpha-actinin-3 in fast-twitch muscle fibers' },
    'TT': { emoji: '🏃', pred: 'Endurance advantage', conf: 55, detail: 'No alpha-actinin-3 — favors slow-twitch/endurance fibers' },
    '_HET': { emoji: '⚖️', pred: 'Mixed fiber type (versatile)', conf: 45, detail: 'Both sprint & endurance capacity — well-rounded' },
    '_DEF': { emoji: '💪', pred: 'Sprint/power (default)', conf: 40, detail: 'Common' }
})},
rs4253778: { gene: 'PPARA', category: 'athletic', trait: 'Fat vs Carb Fuel Preference', interpret: I({
    'GG': { emoji: '🔥', pred: 'Better fat oxidation', conf: 40, detail: 'PPARA — prefers fat as fuel, good for endurance' },
    'CC': { emoji: '🍞', pred: 'Better carb utilization', conf: 35, detail: 'Prefers carbohydrates as fuel — good for sprints' },
    '_HET': { emoji: '⚖️', pred: 'Mixed fuel preference', conf: 30, detail: 'Intermediate' },
    '_DEF': { emoji: '⚖️', pred: 'Mixed', conf: 25, detail: 'Common' }
})},
rs8192678: { gene: 'PPARGC1A', category: 'athletic', trait: 'VO2 Max / Mitochondrial Function', interpret: I({
    'GG': { emoji: '🏃', pred: 'Higher VO2max potential', conf: 40, detail: 'PGC-1α — master regulator of mitochondrial biogenesis' },
    '_HET': { emoji: '🔸', pred: 'Moderate endurance capacity', conf: 30, detail: 'Intermediate mitochondrial function' },
    '_DEF': { emoji: '⚪', pred: 'Lower VO2max tendency', conf: 30, detail: 'Common' }
})},
rs1799945: { gene: 'HFE H63D', category: 'athletic', trait: 'Iron Absorption (HFE)', interpret: I({
    'GG': { emoji: '🔴', pred: 'Increased iron absorption', conf: 55, detail: 'HFE H63D — monitor ferritin levels, hereditary hemochromatosis risk' },
    '_HET': { emoji: '⬆️', pred: 'Mildly increased iron', conf: 40, detail: 'Carrier — usually benign but monitor' },
    '_DEF': { emoji: '🟢', pred: 'Normal iron absorption', conf: 50, detail: 'Common' }
})},
rs7181866: { gene: 'ACE I/D proxy', category: 'athletic', trait: 'Endurance vs Power (ACE)', interpret: I({
    'CC': { emoji: '🏃', pred: 'Endurance tendency (ACE I/I)', conf: 35, detail: 'ACE insertion — lower angiotensin, better O2 efficiency' },
    '_HET': { emoji: '⚖️', pred: 'Balanced endurance/power', conf: 28, detail: 'ACE I/D — mixed' },
    '_DEF': { emoji: '💪', pred: 'Power tendency (ACE D/D)', conf: 30, detail: 'ACE deletion — higher angiotensin, more strength gains' }
})},

// ══════════════════════════════════════
//  😴  SLEEP & CIRCADIAN
// ══════════════════════════════════════
rs57875989: { gene: 'CRY1', category: 'sleep', trait: 'Delayed Sleep Phase (CRY1)', interpret: I({
    '_HET': { emoji: '🦉', pred: 'Night owl (delayed sleep phase)', conf: 50, detail: 'CRY1 Δ11 — circadian period lengthened by ~30min' },
    '_DEF': { emoji: '🌅', pred: 'Typical sleep phase', conf: 40, detail: 'Common' }
})},
rs12927162: { gene: 'ADA', category: 'sleep', trait: 'Deep Sleep Tendency', interpret: I({
    'TT': { emoji: '😴', pred: 'More deep (slow-wave) sleep', conf: 40, detail: 'ADA — adenosine deaminase, slower adenosine clearance' },
    '_HET': { emoji: '🔸', pred: 'Slightly more deep sleep', conf: 30, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Normal sleep depth', conf: 30, detail: 'Common' }
})},
rs1801260: { gene: 'CLOCK 3111T/C', category: 'sleep', trait: 'Chronotype (Morning vs Evening)', interpret: I({
    'CC': { emoji: '🌅', pred: 'Morning person tendency', conf: 40, detail: 'CLOCK gene 3111C — earlier chronotype' },
    '_HET': { emoji: '🔸', pred: 'Intermediate chronotype', conf: 30, detail: 'Heterozygous' },
    '_DEF': { emoji: '🦉', pred: 'Evening person tendency', conf: 35, detail: 'CLOCK 3111T — later chronotype' }
})},
rs73598374: { gene: 'ADA', category: 'sleep', trait: 'Sleep Drive / Efficiency', interpret: I({
    'TT': { emoji: '😴', pred: 'Higher sleep drive', conf: 35, detail: 'ADA variant — more adenosine accumulation during waking' },
    '_HET': { emoji: '🔸', pred: 'Slightly higher sleep drive', conf: 25, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Normal sleep drive', conf: 28, detail: 'Common' }
})},

// ══════════════════════════════════════
//  🧬  LONGEVITY & AGING
// ══════════════════════════════════════
rs429358: { gene: 'APOE (ε4 check)', category: 'longevity', trait: 'APOE ε4 Status', interpret: I({
    'TT': { emoji: '🟢', pred: 'No APOE ε4 allele', conf: 70, detail: 'Lower Alzheimer & cardiovascular risk — APOE ε2/ε3' },
    'CC': { emoji: '⚠️', pred: 'APOE ε4 carrier', conf: 70, detail: 'Elevated Alzheimer risk — strongly modifiable with exercise, diet, sleep' },
    '_HET': { emoji: '⚠️', pred: 'One APOE ε4 allele', conf: 65, detail: 'Moderately elevated risk — lifestyle interventions are protective' },
    '_DEF': { emoji: '🟢', pred: 'No ε4 (default)', conf: 40, detail: 'Common' }
})},
rs7412: { gene: 'APOE (ε2 check)', category: 'longevity', trait: 'APOE ε2 (Protective)', interpret: I({
    'TT': { emoji: '🟢', pred: 'APOE ε2 carrier (protective)', conf: 60, detail: 'Associated with longevity and lower Alzheimer risk' },
    '_HET': { emoji: '🟢', pred: 'One ε2 allele (protective)', conf: 45, detail: 'Partial longevity effect' },
    '_DEF': { emoji: '⚪', pred: 'No ε2 allele', conf: 40, detail: 'Common' }
})},
rs2802292: { gene: 'FOXO3', category: 'longevity', trait: 'Longevity (FOXO3)', interpret: I({
    'GG': { emoji: '🧬', pred: 'Longevity-associated genotype', conf: 35, detail: 'FOXO3 — stress resistance, autophagy, DNA repair' },
    'TT': { emoji: '🧬', pred: 'Longevity-associated', conf: 35, detail: 'FOXO3 variant — replicated in centenarian studies' },
    '_HET': { emoji: '🔸', pred: 'Partial longevity effect', conf: 25, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Typical', conf: 25, detail: 'Common' }
})},
rs1042522: { gene: 'TP53 R72P', category: 'longevity', trait: 'Cancer Defense / Cell Repair (TP53)', interpret: I({
    'GG': { emoji: '🛡️', pred: 'Stronger apoptosis (cancer defense)', conf: 40, detail: 'TP53 Arg72 — better at inducing cell death in damaged cells' },
    'CC': { emoji: '🔄', pred: 'Better DNA repair pathway', conf: 40, detail: 'TP53 Pro72 — better at cell cycle arrest & repair' },
    '_HET': { emoji: '⚖️', pred: 'Balanced cancer defense', conf: 35, detail: 'Both apoptosis & repair pathways active' },
    '_DEF': { emoji: '⚖️', pred: 'Balanced', conf: 25, detail: 'Common' }
})},

// ══════════════════════════════════════
//  🩸  IMMUNE & BLOOD
// ══════════════════════════════════════
rs8176719: { gene: 'ABO', category: 'immune', trait: 'Blood Type (O check)', interpret: I({
    '_HET': { emoji: '🩸', pred: 'Blood type O carrier', conf: 60, detail: 'ABO deletion — one O allele' },
    '_DEF': { emoji: '🩸', pred: 'Blood type A or B likely', conf: 45, detail: 'No O deletion detected' }
})},
rs8176746: { gene: 'ABO', category: 'immune', trait: 'Blood Type (B check)', interpret: I({
    'TT': { emoji: '🅱️', pred: 'Blood type B component', conf: 55, detail: 'ABO B-transferase allele' },
    'GG': { emoji: '🅱️', pred: 'Blood type B component', conf: 55, detail: 'B allele' },
    '_HET': { emoji: '🔸', pred: 'B carrier', conf: 40, detail: 'One B allele' },
    '_DEF': { emoji: '🅰️', pred: 'Type A or O likely', conf: 45, detail: 'No B allele detected' }
})},
rs1050828: { gene: 'G6PD', category: 'immune', trait: 'G6PD Deficiency (Favism)', interpret: I({
    'TT': { emoji: '⚠️', pred: 'G6PD deficient', conf: 70, detail: 'Avoid fava beans, sulfa drugs, certain antimalarials' },
    '_HET': { emoji: '🔸', pred: 'G6PD carrier (females)', conf: 50, detail: 'Partial deficiency in females' },
    '_DEF': { emoji: '🟢', pred: 'Normal G6PD activity', conf: 65, detail: 'Common' }
})},

// ══════════════════════════════════════
//  👁️  VISION
// ══════════════════════════════════════
rs10034228: { gene: 'Near GJD2', category: 'vision', trait: 'Myopia Risk (GJD2)', interpret: I({
    'CC': { emoji: '👓', pred: 'Higher myopia risk', conf: 35, detail: 'GJD2 locus — gap junction, refractive error' },
    '_HET': { emoji: '🔸', pred: 'Moderate myopia risk', conf: 25, detail: 'Heterozygous' },
    '_DEF': { emoji: '👁️', pred: 'Lower myopia risk', conf: 28, detail: 'Common' }
})},
rs2710272: { gene: 'Near RASGRF1', category: 'vision', trait: 'Myopia Risk (RASGRF1)', interpret: I({
    'CC': { emoji: '👓', pred: 'Higher myopia risk', conf: 30, detail: 'RASGRF1 — refractive error association' },
    '_HET': { emoji: '🔸', pred: 'Moderate myopia risk', conf: 22, detail: 'Heterozygous' },
    '_DEF': { emoji: '👁️', pred: 'Lower myopia risk', conf: 25, detail: 'Common' }
})},

// ══════════════════════════════════════
//  🧬  Y-DNA HAPLOGROUPS (Patrilineal)
// ══════════════════════════════════════
//  Y-DNA HAPLOGROUP MARKERS — REMOVED
// ══════════════════════════════════════
// Previously used rs9786153 (M269), rs9786184 (M343), rs2032597 (M170),
// rs9341296 (M253), rs13447354 (P203), rs11799102 (M35), rs7302 (M72).
// These rs numbers do NOT reliably map to the Y-chromosome haplogroup
// mutations on consumer SNP arrays. They triggered on common autosomal
// genotypes, producing false positives (e.g., calling E1b-V13 users "R1b").
// Y-DNA haplogroup detection requires specialized Y-chromosome sequencing.
// See haplogroups.js for recommended tools.

// ══════════════════════════════════════
//  🧬  mtDNA HAPLOGROUPS (Maternal)
// ══════════════════════════════════════
// NOTE: mtDNA haplogroup determination requires dedicated tools (e.g., HaploGrep, James Lick's mtDNA tool).
// The rs121908xxx IDs previously here were ClinVar pathogenic variant IDs, NOT haplogroup markers.
// Consumer DNA tests typically do not include reliable mtDNA haplogroup SNPs via rs numbers.

// ══════════════════════════════════════
//  🩸  BLOOD TYPE (ABO + Rh)
// ══════════════════════════════════════
// More complete ABO/Rh typing
rs407826: { gene: 'ABO:rs407826', category: 'immune', trait: 'ABO Status (rs407826)', interpret: I({
    'AA': { emoji: '🅰️', pred: 'Blood type A or O basis', conf: 55, detail: 'ABO functional status — part of A allele marker set' },
    '_HET': { emoji: '🔸', pred: 'Mixed ABO status', conf: 40, detail: 'Heterozygous' },
    '_DEF': { emoji: '🅱️', pred: 'Blood type B or O basis', conf: 55, detail: 'Non-A allele' }
})},
rs8176695: { gene: 'RhD', category: 'immune', trait: 'Rh D Antigen (RhD positive/negative)', interpret: I({
    'GG': { emoji: '🩸+', pred: 'Rh D positive (typical)', conf: 90, detail: 'Has RhD antigen — most common (85% of populations)' },
    'GA': { emoji: '🩸+', pred: 'Rh D positive', conf: 85, detail: 'One RhD allele' },
    'AA': { emoji: '🩸-', pred: 'Rh D negative', conf: 95, detail: 'No RhD antigen — needs RhoGAM if pregnant & exposed to Rh+ blood' }
})},
rs1799945: { gene: 'RhC', category: 'immune', trait: 'Rh C Antigen (RhC+/-)', interpret: I({
    'AA': { emoji: '🩸+', pred: 'Rh C positive', conf: 75, detail: 'Has C antigen' },
    '_HET': { emoji: '🔸', pred: 'Rh C heterozygous', conf: 60, detail: 'One C allele' },
    '_DEF': { emoji: '⚪', pred: 'Rh C negative', conf: 75, detail: 'No C antigen' }
})},
rs1799946: { gene: 'Rhc', category: 'immune', trait: 'Rh c Antigen (Rhc+/-)', interpret: I({
    'TT': { emoji: '🩸+', pred: 'Rh c positive', conf: 75, detail: 'Has c antigen' },
    '_HET': { emoji: '🔸', pred: 'Rh c heterozygous', conf: 60, detail: 'One c allele' },
    '_DEF': { emoji: '⚪', pred: 'Rh c negative', conf: 75, detail: 'No c antigen' }
})},
rs1799947: { gene: 'RhE', category: 'immune', trait: 'Rh E Antigen (RhE+/-)', interpret: I({
    'GG': { emoji: '🩸+', pred: 'Rh E positive', conf: 75, detail: 'Has E antigen' },
    '_HET': { emoji: '🔸', pred: 'Rh E heterozygous', conf: 60, detail: 'One E allele' },
    '_DEF': { emoji: '⚪', pred: 'Rh E negative', conf: 75, detail: 'No E antigen' }
})},
rs1799948: { gene: 'Rhe', category: 'immune', trait: 'Rh e Antigen (Rhe+/-)', interpret: I({
    'AA': { emoji: '🩸+', pred: 'Rh e positive', conf: 75, detail: 'Has e antigen (most common)' },
    '_HET': { emoji: '🔸', pred: 'Rh e heterozygous', conf: 60, detail: 'One e allele' },
    '_DEF': { emoji: '⚪', pred: 'Rh e negative', conf: 75, detail: 'No e antigen' }
})},

// ══════════════════════════════════════
//  ⚗️  PHARMACOGENOMICS (Drug Metabolism)
// ══════════════════════════════════════
// Key genes for drug response prediction
rs1065852: { gene: 'CYP2C9*1', category: 'pharmacogx', trait: 'CYP2C9: Warfarin/NSAIDs (functional)', interpret: I({
    'CC': { emoji: '💊', pred: 'Normal CYP2C9 activity', conf: 80, detail: 'Wild-type — metabolizes warfarin, NSAIDs, sulfonylureas normally' },
    '_HET': { emoji: '🔸', pred: 'Reduced CYP2C9 activity (~30%)', conf: 70, detail: 'One variant allele — slower metabolism, needs lower warfarin doses' },
    '_DEF': { emoji: '⚠️', pred: 'Poor CYP2C9 activity (~10%)', conf: 75, detail: 'Variant/variant — avoid NSAIDs, monitor warfarin closely' }
})},
rs1057910: { gene: 'CYP2C9*3', category: 'pharmacogx', trait: 'CYP2C9*3 (Poor Metabolizer)', interpret: I({
    'AA': { emoji: '⚠️', pred: 'CYP2C9*3/*3 (poor)', conf: 75, detail: 'Strong warfarin interaction — high bleeding risk, 10% activity' },
    '_HET': { emoji: '🔸', pred: 'CYP2C9*1/*3 (intermediate)', conf: 70, detail: 'One *3 allele — reduce warfarin dose by ~20-30%' },
    '_DEF': { emoji: '💚', pred: 'Normal CYP2C9 activity', conf: 70, detail: 'No *3 allele' }
})},
rs4244285: { gene: 'CYP2C19*2', category: 'pharmacogx', trait: 'CYP2C19: Clopidogrel, PPIs (poor metabolizer)', interpret: I({
    'GG': { emoji: '🟢', pred: 'Normal CYP2C19 activity (extensive metabolizer)', conf: 80, detail: 'Active clopidogrel conversion; SSRIs, PPIs metabolized normally' },
    '_HET': { emoji: '🔸', pred: 'Reduced CYP2C19 activity (~50%, intermediate)', conf: 70, detail: 'Clopidogrel less effective; increased clot risk with stents' },
    'AA': { emoji: '⚠️', pred: 'Poor CYP2C19 activity (poor metabolizer)', conf: 75, detail: 'Clopidogrel ineffective — switch to prasugrel/ticagrelor; avoid PPIs' }
})},
rs681744: { gene: 'CYP2B6', category: 'pharmacogx', trait: 'CYP2B6 (Efavirenz, Bupropion)', interpret: I({
    'TT': { emoji: '🟢', pred: 'Extensive CYP2B6 metabolizer', conf: 70, detail: 'Fast efavirenz metabolism; standard dosing' },
    '_HET': { emoji: '🔸', pred: 'Intermediate metabolizer (~30-40% reduced)', conf: 60, detail: 'May need dose adjustment for efavirenz' },
    'GG': { emoji: '⚠️', pred: 'Poor CYP2B6 metabolizer', conf: 65, detail: 'Efavirenz accumulation — increase toxicity risk (CNS), consider alternative' }
})},
rs1801028: { gene: 'VKORC1 -1639G>A', category: 'pharmacogx', trait: 'VKORC1: Warfarin Sensitivity', interpret: I({
    'AA': { emoji: '⚠️', pred: 'Warfarin sensitive (high dose requirement reduction)', conf: 85, detail: 'VKORC1*2 — needs 5-10mg weekly vs 30-40mg for others; high bleeding risk' },
    '_HET': { emoji: '🔸', pred: 'Intermediate warfarin sensitivity', conf: 70, detail: 'Reduce standard warfarin dose by ~20%' },
    '_DEF': { emoji: '💚', pred: 'Normal warfarin sensitivity', conf: 75, detail: 'Standard warfarin dosing appropriate' }
})},
rs8175347: { gene: 'NAT2 (Acetylation)', category: 'pharmacogx', trait: 'NAT2: Slow/Fast Acetylator (TB drugs)', interpret: I({
    'AA': { emoji: '🐢', pred: 'Slow acetylator', conf: 75, detail: 'TB drugs (isoniazid) accumulate — increase neuropathy risk, reduce dose' },
    '_HET': { emoji: '🔸', pred: 'Intermediate acetylation', conf: 60, detail: 'Monitor TB drug levels' },
    '_DEF': { emoji: '⚡', pred: 'Fast acetylator', conf: 70, detail: 'TB drugs cleared quickly — may need standard or higher dosing' }
})},
rs1136410: { gene: 'TPMT (Thiopurine S-methyltransferase)', category: 'pharmacogx', trait: 'TPMT: Azathioprine/Mercaptopurine', interpret: I({
    'AA': { emoji: '⚠️', pred: 'Low TPMT activity (5-10%)', conf: 80, detail: 'Severe azathioprine/6-MP toxicity risk — use 10% of standard dose' },
    '_HET': { emoji: '🔸', pred: 'Intermediate TPMT (~30-40%)', conf: 75, detail: 'Reduce azathioprine by ~50%' },
    '_DEF': { emoji: '💚', pred: 'Normal TPMT activity (extensive metabolizer)', conf: 75, detail: 'Standard azathioprine dosing safe' }
})},
rs3218714: { gene: 'SLCO1B1', category: 'pharmacogx', trait: 'SLCO1B1: Statin-Induced Myopathy Risk', interpret: I({
    'CC': { emoji: '💚', pred: 'Normal statin metabolism', conf: 70, detail: 'Standard statin doses; lower myopathy risk' },
    '_HET': { emoji: '🔸', pred: 'Reduced statin transporter', conf: 60, detail: 'Mild increase in statin levels — monitor for muscle pain' },
    'TT': { emoji: '⚠️', pred: 'Poor statin transporter', conf: 70, detail: 'Statin accumulation — higher myopathy/rhabdomyolysis risk; reduce dose or use pravastatin' }
})},
rs2108622: { gene: 'DPYD (Dihydropyrimidine dehydrogenase)', category: 'pharmacogx', trait: 'DPYD: 5-FU Cancer Drug Sensitivity', interpret: I({
    'AA': { emoji: '⚠️', pred: 'DPYD deficiency', conf: 85, detail: 'Severe 5-FU toxicity risk — AVOID 5-FU, capecitabine (severe diarrhea, mucositis, death)' },
    '_HET': { emoji: '🔸', pred: 'Intermediate DPYD', conf: 70, detail: 'Increase 5-FU toxicity risk — reduce dose by ~25-50%' },
    '_DEF': { emoji: '💚', pred: 'Normal DPYD activity', conf: 75, detail: 'Standard 5-FU chemotherapy dosing' }
})},
rs2042052: { gene: 'HLA-B*57:01 (Abacavir hypersensitivity)', category: 'pharmacogx', trait: 'HLA-B*57:01: Abacavir Reaction (HIV drug)', interpret: I({
    'AA': { emoji: '🚫', pred: 'HLA-B*57:01+ (AVOID abacavir)', conf: 95, detail: 'Severe abacavir hypersensitivity (fever, rash, GI, liver damage) — CONTRAINDICATED' },
    '_DEF': { emoji: '✅', pred: 'HLA-B*57:01-', conf: 85, detail: 'Abacavir safe to use' }
})},
rs1128503: { gene: 'MDR1/ABCB1 C3435T', category: 'pharmacogx', trait: 'MDR1: P-gp Pump Activity (Digoxin, Fexofenadine)', interpret: I({
    'CC': { emoji: '💚', pred: 'High P-glycoprotein (normal MDR1)', conf: 65, detail: 'Efficient drug transport; standard digoxin dosing' },
    '_HET': { emoji: '🔸', pred: 'Intermediate P-gp', conf: 55, detail: 'Intermediate drug transport' },
    'TT': { emoji: '⚠️', pred: 'Low P-glycoprotein', conf: 60, detail: 'Reduced drug efflux — digoxin/fexofenadine accumulation, monitor levels' }
})},

// ══════════════════════════════════════
//  🧬  CARRIER STATUS (Recessive Disease Risk)
// ══════════════════════════════════════
rs75527207: { gene: 'CFTR (Cystic Fibrosis)', category: 'carrier', trait: 'CF Carrier Status (CFTR Delta-F508)', interpret: I({
    'AA': { emoji: '✅', pred: 'Not CF carrier (homozygous normal)', conf: 80, detail: 'No cystic fibrosis risk' },
    '_HET': { emoji: '⚠️', pred: 'CF Carrier (heterozygous)', conf: 85, detail: '~2% risk of affected child if partner also carrier; ~50% offspring carrier' },
    '_DEF': { emoji: '🔴', pred: 'Cystic Fibrosis risk', conf: 80, detail: 'Homozygous for CF mutation — affected or carrier compound het' }
})},
rs334: { gene: 'HBB (Sickle Cell)', category: 'carrier', trait: 'Sickle Cell Carrier (HbS)', interpret: I({
    'AA': { emoji: '✅', pred: 'Sickle cell normal (HbA/HbA)', conf: 90, detail: 'Normal hemoglobin; no sickle cell risk' },
    '_HET': { emoji: '⚠️', pred: 'Sickle cell trait (HbA/HbS carrier)', conf: 90, detail: 'Carrier — malaria protection but risk of pain crises under extreme hypoxia' },
    'GG': { emoji: '🔴', pred: 'Sickle cell disease (HbS/HbS)', conf: 95, detail: 'Homozygous — sickle cell disease; significant complications' }
})},
rs33930165: { gene: 'HBB (Beta-thalassemia)', category: 'carrier', trait: 'Beta-Thalassemia Carrier', interpret: I({
    'AA': { emoji: '✅', pred: 'No beta-thalassemia', conf: 80, detail: 'Normal hemoglobin genes' },
    '_HET': { emoji: '⚠️', pred: 'Beta-thalassemia carrier (trait)', conf: 85, detail: 'Mild anemia but usually asymptomatic; carrier for trait' },
    'GG': { emoji: '🔴', pred: 'Beta-thalassemia major/intermedia', conf: 85, detail: 'Homozygous — thalassemia major requires transfusions' }
})},
rs112414582: { gene: 'PAH (Phenylketonuria)', category: 'carrier', trait: 'PKU Carrier Status (PAH)', interpret: I({
    'AA': { emoji: '✅', pred: 'Not PKU carrier', conf: 75, detail: 'Normal phenylketonuria metabolism' },
    '_HET': { emoji: '⚠️', pred: 'PKU carrier (heterozygous)', conf: 80, detail: 'Carrier — ~1% risk of affected child if partner also carrier' },
    '_DEF': { emoji: '🔴', pred: 'PKU risk', conf: 75, detail: 'Likely carrier or affected' }
})},
rs11558492: { gene: 'GBA (Gaucher Disease)', category: 'carrier', trait: 'Gaucher Disease Carrier (GBA N370S)', interpret: I({
    'CC': { emoji: '✅', pred: 'Not Gaucher carrier', conf: 70, detail: 'Normal GBA gene' },
    '_HET': { emoji: '⚠️', pred: 'Gaucher disease carrier', conf: 75, detail: 'Carrier for Gaucher — rare lysosomal storage disease' },
    'TT': { emoji: '🔴', pred: 'Gaucher disease risk', conf: 70, detail: 'Likely carrier or affected' }
})},
rs121908035: { gene: 'MEFV (Familial Mediterranean Fever)', category: 'carrier', trait: 'FMF Carrier Status', interpret: I({
    'AA': { emoji: '✅', pred: 'Not FMF carrier', conf: 70, detail: 'No familial Mediterranean fever risk' },
    '_HET': { emoji: '⚠️', pred: 'FMF carrier (heterozygous)', conf: 75, detail: 'Carrier — rare recessive fever episodes' },
    '_DEF': { emoji: '🔴', pred: 'FMF risk', conf: 70, detail: 'Possible FMF homozygous' }
})},
rs104895487: { gene: 'GJB2 (Hereditary Deafness)', category: 'carrier', trait: 'Hearing Loss Carrier (GJB2)', interpret: I({
    'AA': { emoji: '✅', pred: 'Not GJB2 carrier', conf: 75, detail: 'No hereditary deafness from GJB2' },
    '_HET': { emoji: '⚠️', pred: 'GJB2 carrier (heterozygous)', conf: 75, detail: 'Carrier for recessive deafness (connexin-26)' },
    '_DEF': { emoji: '🔴', pred: 'Hereditary deafness risk', conf: 75, detail: 'Possible GJB2 homozygous' }
})},

// ══════════════════════════════════════
//  🧠  DISEASE RISK (Polygenic Scores)
// ══════════════════════════════════════
rs1333049: { gene: 'CDKN2B (Coronary Artery Disease)', category: 'disease', trait: 'Coronary Artery Disease Risk (rs1333049)', interpret: I({
    'CC': { emoji: '💚', pred: 'Lower CAD risk (protective)', conf: 50, detail: 'Protective allele; baseline CAD risk' },
    '_HET': { emoji: '🔸', pred: 'Intermediate CAD risk', conf: 45, detail: 'Heterozygous — mild increased risk' },
    'GG': { emoji: '⚠️', pred: 'Higher CAD risk (~30% increased)', conf: 50, detail: 'Risk allele; lifestyle & monitoring important' }
})},
rs7903146: { gene: 'TCF7L2 (Type 2 Diabetes)', category: 'disease', trait: 'Type 2 Diabetes Risk (TCF7L2)', interpret: I({
    'CC': { emoji: '🟢', pred: 'Lower diabetes risk', conf: 60, detail: 'Common diabetes protective allele — best metabolic health' },
    '_HET': { emoji: '🔸', pred: 'Moderate diabetes risk (+25%)', conf: 55, detail: 'One risk allele' },
    'TT': { emoji: '⚠️', pred: 'Higher diabetes risk (+50%)', conf: 60, detail: 'Strongest type 2 diabetes locus; exercise & weight control crucial' }
})},
rs9991328: { gene: 'FADS1 (Insulin Resistance)', category: 'disease', trait: 'Insulin Resistance / Metabolic Syndrome', interpret: I({
    'CC': { emoji: '🟢', pred: 'Lower insulin resistance', conf: 50, detail: 'Better metabolic profile' },
    '_HET': { emoji: '🔸', pred: 'Intermediate insulin sensitivity', conf: 45, detail: 'Heterozygous' },
    'TT': { emoji: '⚠️', pred: 'Higher insulin resistance tendency', conf: 50, detail: 'Monitor glucose, consider low-carb diet' }
})},
rs10757278: { gene: 'BMI / FTO region', category: 'disease', trait: 'Obesity / BMI Risk (FTO region)', interpret: I({
    'AA': { emoji: '🔸', pred: 'Higher BMI risk (+~6-7kg)', conf: 55, detail: 'Multiple risk alleles converge here; strong environmental modulation' },
    '_HET': { emoji: '🟡', pred: 'Moderate BMI risk (+3kg)', conf: 50, detail: 'Heterozygous — mild weight tendency' },
    '_DEF': { emoji: '🟢', pred: 'Lower BMI tendency', conf: 50, detail: 'Protective alleles' }
})},
rs495828: { gene: 'CELSR2 (LDL cholesterol)', category: 'disease', trait: 'LDL Cholesterol (lipid metabolism)', interpret: I({
    'AA': { emoji: '📈', pred: 'Higher LDL tendency', conf: 50, detail: 'Higher cholesterol risk; monitor lipid panel' },
    '_HET': { emoji: '🔸', pred: 'Intermediate LDL levels', conf: 45, detail: 'Heterozygous' },
    '_DEF': { emoji: '🟢', pred: 'Lower LDL tendency', conf: 50, detail: 'Better lipid profile' }
})},
rs192641167: { gene: 'APOE ε4 (Alzheimer\'s Disease)', category: 'disease', trait: 'Alzheimer\'s Disease Risk (APOE ε4)', interpret: I({
    'AA': { emoji: '⚠️', pred: 'Doubled Alzheimer\'s risk (APOE ε4/ε4)', conf: 65, detail: 'Two ε4 alleles — 30%+ lifetime AD risk; exercise, cognitive training, sleep crucial' },
    '_HET': { emoji: '🟡', pred: 'Increased AD risk (ε3/ε4)', conf: 60, detail: 'One ε4 allele — ~3x general population risk; modifiable with lifestyle' },
    '_DEF': { emoji: '🟢', pred: 'Lower AD risk (ε2/ε3)', conf: 60, detail: 'ε2 or ε3 alleles; baseline risk' }
})},
rs11191580: { gene: 'CELSR2/PSAP/SORT1', category: 'disease', trait: 'Myocardial Infarction Risk', interpret: I({
    'TT': { emoji: '📈', pred: 'Higher MI risk', conf: 45, detail: 'Increased cardiovascular event risk' },
    '_HET': { emoji: '🔸', pred: 'Intermediate MI risk', conf: 40, detail: 'Heterozygous' },
    '_DEF': { emoji: '🟢', pred: 'Lower MI risk', conf: 45, detail: 'Protective alleles' }
})},
rs1476413: { gene: 'PSRC1 (Metabolic)', category: 'disease', trait: 'Cardiovascular/Metabolic Risk', interpret: I({
    'GG': { emoji: '📈', pred: 'Higher cardiovascular risk', conf: 45, detail: 'Risk allele — monitor BP, cholesterol' },
    '_HET': { emoji: '🔸', pred: 'Intermediate risk', conf: 40, detail: 'Heterozygous' },
    '_DEF': { emoji: '🟢', pred: 'Lower cardiovascular risk', conf: 45, detail: 'Protective' }
})},

// ══════════════════════════════════════
//  🥗  NUTRITION & METABOLISM
// ══════════════════════════════════════
rs6426749: { gene: 'FADS1 (Fatty Acid Metabolism)', category: 'nutrition', trait: 'Omega-3/Omega-6 Balance (FADS1)', interpret: I({
    'CC': { emoji: '🐟', pred: 'Convert ALA→EPA efficiently', conf: 55, detail: 'FADS1 efficient — better omega-3 utilization; may need less fish oil' },
    '_HET': { emoji: '🔸', pred: 'Intermediate conversion', conf: 45, detail: 'Moderate omega-3 conversion' },
    '_DEF': { emoji: '⚠️', pred: 'Inefficient omega-3 conversion', conf: 55, detail: 'May benefit from fish oil supplementation; higher omega-3/6 ratio beneficial' }
})},
rs1041981: { gene: 'IL23R (Folate)', category: 'nutrition', trait: 'Folate/B-Vitamin Metabolism', interpret: I({
    'AA': { emoji: '🥬', pred: 'Efficient folate metabolism', conf: 50, detail: 'Normal B-vitamin absorption and utilization' },
    '_HET': { emoji: '🔸', pred: 'Moderate folate processing', conf: 40, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚠️', pred: 'Reduced folate efficiency', conf: 50, detail: 'May benefit from methylfolate/B12 supplementation' }
})},
rs3123554: { gene: 'ABCBind', category: 'nutrition', trait: 'Vitamin B12 Absorption (IF/Parietal Cell)', interpret: I({
    'AA': { emoji: '🐄', pred: 'Normal B12 absorption', conf: 55, detail: 'Efficient intrinsic factor; standard B12 from diet sufficient' },
    '_HET': { emoji: '🔸', pred: 'Intermediate B12 absorption', conf: 45, detail: 'Mild reduction — may benefit from B12 monitoring' },
    '_DEF': { emoji: '⚠️', pred: 'Reduced B12 absorption', conf: 55, detail: 'May need B12 supplementation or injections; monitor levels' }
})},
rs601338: { gene: 'DHCR7/Vitamin D', category: 'nutrition', trait: 'Vitamin D Synthesis & Metabolism', interpret: I({
    'TT': { emoji: '☀️', pred: 'Higher vitamin D from sun', conf: 55, detail: 'More efficient 7-dehydrocholesterol conversion; baseline sun exposure sufficient' },
    '_HET': { emoji: '🔸', pred: 'Moderate vitamin D synthesis', conf: 45, detail: 'Intermediate efficiency' },
    'GG': { emoji: '⚠️', pred: 'Lower vitamin D from sun', conf: 55, detail: 'May need supplementation; consider 1000-2000 IU daily or more sun exposure' }
})},
rs16847024: { gene: 'Iron Metabolism (TMPRSS6)', category: 'nutrition', trait: 'Iron Absorption/Hepcidin', interpret: I({
    'CC': { emoji: '🩸', pred: 'Higher hepcidin; lower iron absorption', conf: 55, detail: 'Reduces iron uptake — less iron overload risk but monitor for deficiency' },
    '_HET': { emoji: '🔸', pred: 'Intermediate iron absorption', conf: 45, detail: 'Normal iron handling' },
    '_DEF': { emoji: '⬆️', pred: 'Lower hepcidin; increased iron absorption', conf: 55, detail: 'More efficient iron uptake; monitor ferritin levels, avoid excess iron' }
})},

// ══════════════════════════════════════
//  🦴  NEANDERTHAL ANCESTRY
// ══════════════════════════════════════
rs1426064: { gene: 'Neanderthal: rs1426064', category: 'ancestry', trait: 'Neanderthal Introgression (Immune gene)', interpret: I({
    'AA': { emoji: '🧬', pred: '~3% Neanderthal ancestry signal', conf: 45, detail: 'Neanderthal immune allele — contributed to disease resistance' },
    '_HET': { emoji: '🔸', pred: 'Possible Neanderthal allele', conf: 35, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'No Neanderthal allele detected', conf: 40, detail: 'Modern human allele' }
})},
rs11646643: { gene: 'Neanderthal: ASPM (brain size)', category: 'ancestry', trait: 'Neanderthal ASPM Gene (Brain Size)', interpret: I({
    'CC': { emoji: '🧬', pred: 'Neanderthal ASPM allele', conf: 50, detail: 'Neanderthal brain-size gene; carried to modern humans' },
    '_HET': { emoji: '🔸', pred: 'Mixed allele', conf: 40, detail: 'One modern, one Neanderthal' },
    '_DEF': { emoji: '⚪', pred: 'Modern human ASPM only', conf: 50, detail: 'Typical modern allele' }
})},

// ══════════════════════════════════════
//  🛡️  IMMUNE RESPONSE
// ══════════════════════════════════════
rs2857712: { gene: 'TLR1 (Toll-like receptor)', category: 'immune', trait: 'Immune Response / Infection Severity', interpret: I({
    'GG': { emoji: '🛡️', pred: 'Stronger TLR-mediated response', conf: 55, detail: 'Better innate immune detection; possibly stronger vaccine response' },
    '_HET': { emoji: '🔸', pred: 'Intermediate immune response', conf: 45, detail: 'Heterozygous' },
    'AA': { emoji: '⚠️', pred: 'Weaker pathogen detection', conf: 55, detail: 'May have prolonged infection recovery; monitor vaccine response' }
})},
rs112119592: { gene: 'COVID-19 severity (OAS1)', category: 'immune', trait: 'COVID-19 Severe Illness Risk (OAS1)', interpret: I({
    'GG': { emoji: '🟢', pred: 'Lower COVID-19 severity risk', conf: 60, detail: 'OAS1 GG genotype — better interferon response, lower hospitalization risk' },
    '_HET': { emoji: '🔸', pred: 'Intermediate COVID-19 risk', conf: 50, detail: 'Heterozygous' },
    'TT': { emoji: '⚠️', pred: 'Higher COVID-19 severe risk', conf: 60, detail: 'TT genotype — impaired antiviral response; higher hospitalization/ICU risk' }
})},
rs12252: { gene: 'IFITM3 (Flu & COVID-19)', category: 'immune', trait: 'Influenza & COVID-19 Severity', interpret: I({
    'CC': { emoji: '🟢', pred: 'Lower flu/COVID severity', conf: 55, detail: 'IFITM3 protective — better antiviral interferon response' },
    '_HET': { emoji: '🔸', pred: 'Intermediate severity risk', conf: 45, detail: 'Heterozygous' },
    'TT': { emoji: '⚠️', pred: 'Higher respiratory severity', conf: 55, detail: 'Increased influenza complications; monitor for severe COVID' }
})},
rs2275913: { gene: 'IL10 (Anti-inflammatory)', category: 'immune', trait: 'Inflammatory Response (IL-10)', interpret: I({
    'AA': { emoji: '🟢', pred: 'Higher IL-10 (anti-inflammatory)', conf: 50, detail: 'Better at dampening inflammation; lower autoimmune/inflammation risk' },
    '_HET': { emoji: '🔸', pred: 'Balanced inflammatory response', conf: 45, detail: 'Intermediate IL-10 levels' },
    'GG': { emoji: '⚠️', pred: 'Lower IL-10 (pro-inflammatory)', conf: 50, detail: 'May have chronic inflammation tendency; consider anti-inflammatory diet' }
})},

// ══════════════════════════════════════
//  💊  ADVERSE DRUG REACTIONS
// ══════════════════════════════════════
rs3099386: { gene: 'HLA-A*31:01 (Carbamazepine)', category: 'pharmacogx', trait: 'Carbamazepine Hypersensitivity (HLA-A*31:01)', interpret: I({
    'AA': { emoji: '🚫', pred: 'HLA-A*31:01+ (AVOID carbamazepine)', conf: 90, detail: 'Severe Stevens-Johnson syndrome/TOXIC EPIDERMAL NECROLYSIS risk — contraindicated' },
    '_DEF': { emoji: '✅', pred: 'HLA-A*31:01-', conf: 85, detail: 'Carbamazepine safe' }
})},
rs1800944: { gene: 'HLA-B*15:02 (Carbamazepine CBZ)', category: 'pharmacogx', trait: 'Carbamazepine SJS/TEN Risk (HLA-B*15:02)', interpret: I({
    'AA': { emoji: '🚫', pred: 'HLA-B*15:02+ (severe SJS/TEN risk)', conf: 95, detail: 'Occurs predominantly in Han Chinese & SE Asians — AVOID carbamazepine' },
    '_DEF': { emoji: '✅', pred: 'HLA-B*15:02-', conf: 90, detail: 'Carbamazepine generally safe (unless HLA-A*31:01 positive)' }
})},
rs3135501: { gene: 'HLA-B*58:01 (Allopurinol)', category: 'pharmacogx', trait: 'Allopurinol Hypersensitivity (HLA-B*58:01)', interpret: I({
    'AA': { emoji: '🚫', pred: 'HLA-B*58:01+ (AVOID allopurinol)', conf: 90, detail: 'Severe SJS/TEN or hypersensitivity syndrome — use febuxostat instead' },
    '_DEF': { emoji: '✅', pred: 'HLA-B*58:01-', conf: 85, detail: 'Allopurinol safe' }
})},

// ══════════════════════════════════════
//  🎯  ATHLETIC & FITNESS TRAITS
// ══════════════════════════════════════
rs1594918: { gene: 'PPARGC1A (VO2max)', category: 'athletic', trait: 'VO2max Response to Training (PPARGC1A)', interpret: I({
    'GG': { emoji: '🏃', pred: 'Better VO2max training response', conf: 50, detail: 'PGC-1α promoter — more mitochondrial biogenesis with aerobic training' },
    '_HET': { emoji: '🔸', pred: 'Intermediate VO2max improvement', conf: 40, detail: 'Moderate response to endurance training' },
    '_DEF': { emoji: '⚪', pred: 'Lower VO2max improvement', conf: 45, detail: 'May need higher training volume for adaptation' }
})},
rs1815714: { gene: 'MYPN (Muscle Function)', category: 'athletic', trait: 'Muscle Performance (Myopaladin)', interpret: I({
    'CC': { emoji: '💪', pred: 'Better muscular strength', conf: 45, detail: 'MYPN — improved force generation' },
    '_HET': { emoji: '🔸', pred: 'Intermediate muscle strength', conf: 35, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Typical muscle strength', conf: 40, detail: 'Normal strength capacity' }
})},
rs8050136: { gene: 'FTO (Athletic Performance)', category: 'athletic', trait: 'Muscle Type Bias (FTO)', interpret: I({
    'AA': { emoji: '📉', pred: 'May favor more endurance', conf: 40, detail: 'FTO risk allele shifts toward endurance capacity' },
    '_HET': { emoji: '🔸', pred: 'Mixed athletic profile', conf: 35, detail: 'Heterozygous' },
    '_DEF': { emoji: '💪', pred: 'Typical athletic profile', conf: 35, detail: 'Balanced strength/endurance' }
})},

// ══════════════════════════════════════
//  😴  ADVANCED SLEEP TRAITS
// ══════════════════════════════════════
rs4757144: { gene: 'MEIS1 (Restless Legs)', category: 'sleep', trait: 'Restless Legs Syndrome Risk', interpret: I({
    'GG': { emoji: '🔴', pred: 'Higher RLS risk', conf: 55, detail: 'Restless legs syndrome predisposition — strong genetic component' },
    '_HET': { emoji: '🔸', pred: 'Moderate RLS risk', conf: 45, detail: 'One risk allele' },
    '_DEF': { emoji: '🟢', pred: 'Lower RLS risk', conf: 55, detail: 'Protective genotype' }
})},
rs2291597: { gene: 'BTBD9 (Restless Legs)', category: 'sleep', trait: 'RLS & Sleep Disturbance', interpret: I({
    'AA': { emoji: '⚠️', pred: 'RLS predisposition', conf: 50, detail: 'BTBD9 risk allele; exercise & iron supplementation may help' },
    '_HET': { emoji: '🔸', pred: 'Mild RLS tendency', conf: 40, detail: 'One risk allele' },
    '_DEF': { emoji: '🟢', pred: 'Lower RLS risk', conf: 50, detail: 'Protective' }
})},
rs9910677: { gene: 'GWAS Sleep Duration', category: 'sleep', trait: 'Sleep Duration (GWAS)', interpret: I({
    'AA': { emoji: '😴', pred: 'Higher sleep need (~8-9h)', conf: 45, detail: 'Genetics favor more sleep; less efficient sleep architecture' },
    '_HET': { emoji: '🔸', pred: 'Average sleep duration (~7-7.5h)', conf: 40, detail: 'Intermediate sleep need' },
    '_DEF': { emoji: '⚪', pred: 'Lower sleep need (~6-7h)', conf: 45, detail: 'Efficient sleepers; may thrive on less' }
})},

// ══════════════════════════════════════
//  🧬  ADDITIONAL TRAIT PANELS
// ══════════════════════════════════════
rs16951657: { gene: 'AREG (Appetite/Hunger)', category: 'metabolism', trait: 'Appetite Regulation / Hunger Drive', interpret: I({
    'GG': { emoji: '🍔', pred: 'Increased appetite', conf: 45, detail: 'AREG appetite signal — higher hunger drive' },
    '_HET': { emoji: '🔸', pred: 'Moderate appetite drive', conf: 35, detail: 'Intermediate' },
    '_DEF': { emoji: '🍎', pred: 'Lower appetite drive', conf: 45, detail: 'Better satiety signals' }
})},
rs10938397: { gene: 'GNPDA2 (BMI/Appetite)', category: 'metabolism', trait: 'Fat Preference / Appetite', interpret: I({
    'AA': { emoji: '🍟', pred: 'Higher fat preference', conf: 45, detail: 'Increased dietary fat attraction' },
    '_HET': { emoji: '🔸', pred: 'Moderate fat preference', conf: 35, detail: 'Intermediate' },
    '_DEF': { emoji: '🥗', pred: 'Lower fat preference', conf: 45, detail: 'Typical fat preference' }
})},
rs12429358: { gene: 'LPL (Lipid Metabolism)', category: 'metabolism', trait: 'Triglyceride Metabolism', interpret: I({
    'GG': { emoji: '📈', pred: 'Higher triglyceride tendency', conf: 50, detail: 'LPL S447X — reduced lipase activity; monitor lipid panel' },
    '_HET': { emoji: '🔸', pred: 'Intermediate triglyceride levels', conf: 40, detail: 'Heterozygous' },
    '_DEF': { emoji: '🟢', pred: 'Lower triglyceride tendency', conf: 50, detail: 'Normal triglyceride metabolism' }
})},
rs1800437: { gene: 'DRD1 (Dopamine)', category: 'brain', trait: 'Reward Sensitivity / Motivation', interpret: I({
    'AA': { emoji: '⚡', pred: 'Higher dopamine sensitivity', conf: 40, detail: 'DRD1 — enhanced reward response; good for motivation' },
    '_HET': { emoji: '🔸', pred: 'Moderate reward sensitivity', conf: 35, detail: 'Heterozygous' },
    '_DEF': { emoji: '⚪', pred: 'Typical reward sensitivity', conf: 40, detail: 'Standard motivation drive' }
})},
rs621622: { gene: 'ADRB1 (Beta-blocker response)', category: 'pharmacogx', trait: 'Beta-Blocker Response (Arg389Gly)', interpret: I({
    'CC': { emoji: '💊', pred: 'Excellent beta-blocker response', conf: 65, detail: 'ADRB1 Arg389 — higher beta-adrenergic receptor density; better BP control' },
    '_HET': { emoji: '🔸', pred: 'Moderate beta-blocker response', conf: 50, detail: 'Intermediate response' },
    'GG': { emoji: '⚠️', pred: 'Reduced beta-blocker response', conf: 60, detail: 'ADRB1 Gly389 — may need alternative antihypertensive' }
})},

// ══════════════════════════════════════
//  ❤️  CARDIOVASCULAR HEALTH
// ══════════════════════════════════════
rs5186: { gene: 'AGTR1 A1166C', category: 'cardiovascular', trait: 'Blood Pressure / Angiotensin II Response', interpret: I({
    'CC': { emoji: '🔴', pred: 'Higher hypertension risk (AGTR1 CC)', conf: 50, detail: 'Angiotensin II receptor type 1 — enhanced vasoconstriction response; higher BP and CAD risk. Benefit most from ACE inhibitors / ARBs.' },
    '_HET': { emoji: '🔸', pred: 'Moderate angiotensin sensitivity', conf: 40, detail: 'Heterozygous — moderate hypertension risk increase.' },
    '_DEF': { emoji: '🟢', pred: 'Normal blood pressure tendency', conf: 48, detail: 'AA — standard vasoconstriction response.' }
})},
rs1799983: { gene: 'NOS3/eNOS G894T (Glu298Asp)', category: 'cardiovascular', trait: 'Nitric Oxide Production / Endothelial Function', interpret: I({
    'GG': { emoji: '🟢', pred: 'Normal endothelial NO production', conf: 55, detail: 'eNOS wild-type — standard vasodilation, normal BP response.' },
    '_HET': { emoji: '🔸', pred: 'Mildly reduced NO / endothelial function', conf: 45, detail: 'One T allele — slight endothelial dysfunction risk, moderate hypertension tendency.' },
    'TT': { emoji: '⚠️', pred: 'Reduced nitric oxide — endothelial risk', conf: 55, detail: 'eNOS Asp298 — reduced vasodilation; higher hypertension, CAD, and pre-eclampsia risk.' }
})},
rs10455872: { gene: 'LPA intron', category: 'cardiovascular', trait: 'Lipoprotein(a) — Cardiovascular Risk', interpret: I({
    'GG': { emoji: '⚠️', pred: 'High Lp(a) — strong CVD risk', conf: 65, detail: 'Major Lp(a)-raising allele — 3× higher MI risk independent of LDL. Test Lp(a) blood level. Niacin & PCSK9 inhibitors reduce Lp(a).' },
    '_HET': { emoji: '🔸', pred: 'Moderately elevated Lp(a)', conf: 55, detail: 'One risk allele — moderate Lp(a) elevation. Check blood Lp(a) level.' },
    '_DEF': { emoji: '🟢', pred: 'Normal Lp(a) levels', conf: 58, detail: 'Common allele — lower cardiovascular risk from this locus.' }
})},
rs2200733: { gene: '4q25 near PITX2', category: 'cardiovascular', trait: 'Atrial Fibrillation Risk (4q25)', interpret: I({
    'TT': { emoji: '⚠️', pred: 'Higher AFib risk (~1.72×)', conf: 60, detail: 'Strongest GWAS locus for atrial fibrillation — near PITX2, regulates pulmonary vein development. Exercise, alcohol moderation, and BP control reduce risk.' },
    '_HET': { emoji: '🔸', pred: 'Moderately elevated AFib risk', conf: 50, detail: 'One risk allele — moderate increase in atrial fibrillation predisposition.' },
    '_DEF': { emoji: '🟢', pred: 'Lower AFib genetic risk', conf: 55, detail: 'Protective alleles at 4q25.' }
})},
rs6922269: { gene: 'MTHFD1L', category: 'cardiovascular', trait: 'Homocysteine & Venous Thrombosis Risk', interpret: I({
    'GG': { emoji: '⚠️', pred: 'Higher homocysteine / thrombosis risk', conf: 50, detail: 'MTHFD1L — folate metabolism → homocysteine; elevated levels increase DVT and cardiovascular risk. B6, B12, and folate supplementation lowers homocysteine.' },
    '_HET': { emoji: '🔸', pred: 'Moderate homocysteine tendency', conf: 40, detail: 'Heterozygous — moderate effect on folate-homocysteine pathway.' },
    '_DEF': { emoji: '🟢', pred: 'Normal homocysteine tendency', conf: 48, detail: 'Common allele — lower thrombosis risk from this locus.' }
})},
rs693: { gene: 'APOB', category: 'cardiovascular', trait: 'LDL Cholesterol (ApoB)', interpret: I({
    'TT': { emoji: '📈', pred: 'Higher LDL / ApoB tendency', conf: 50, detail: 'ApoB — main carrier of LDL particles; higher LDL and CAD risk. Monitor lipid panel.' },
    '_HET': { emoji: '🔸', pred: 'Moderately elevated LDL tendency', conf: 42, detail: 'Heterozygous — mild LDL increase.' },
    '_DEF': { emoji: '🟢', pred: 'Lower LDL tendency', conf: 48, detail: 'Protective ApoB allele — better lipid profile.' }
})},
rs1800956: { gene: 'F5 Leiden (1691G>A)', category: 'cardiovascular', trait: 'Factor V Leiden — Clotting Risk', interpret: I({
    'AA': { emoji: '🔴', pred: 'Factor V Leiden homozygous — high clot risk', conf: 90, detail: 'Activated protein C resistance — 80× higher DVT/PE risk. Consult hematology. Avoid combined oral contraceptives.' },
    '_HET': { emoji: '⚠️', pred: 'Factor V Leiden carrier — elevated clot risk', conf: 85, detail: 'Heterozygous — 4-7× higher DVT risk. Discuss with doctor if surgery, pregnancy, or long travel planned.' },
    '_DEF': { emoji: '🟢', pred: 'No Factor V Leiden detected', conf: 80, detail: 'Normal APC response — typical clotting risk.' }
})},
rs1799963: { gene: 'F2 Prothrombin G20210A', category: 'cardiovascular', trait: 'Prothrombin Mutation — Thrombosis Risk', interpret: I({
    'AA': { emoji: '🔴', pred: 'Prothrombin G20210A — clotting risk', conf: 85, detail: 'Elevated prothrombin levels — 2-3× higher DVT/stroke risk. Avoid estrogen-containing contraceptives.' },
    '_HET': { emoji: '⚠️', pred: 'Prothrombin G20210A carrier', conf: 80, detail: 'One risk allele — moderately elevated thrombosis risk.' },
    '_DEF': { emoji: '🟢', pred: 'No prothrombin mutation detected', conf: 78, detail: 'Common — normal prothrombin levels.' }
})},

// ══════════════════════════════════════
//  🦴  BONE & JOINT HEALTH
// ══════════════════════════════════════
rs2297480: { gene: 'FRZB (Wnt antagonist)', category: 'bone', trait: 'Hip Osteoarthritis Risk (FRZB)', interpret: I({
    'CC': { emoji: '⚠️', pred: 'Higher hip OA risk', conf: 48, detail: 'FRZB Arg200Trp — Wnt antagonist; altered cartilage and bone metabolism, higher hip OA predisposition.' },
    '_HET': { emoji: '🔸', pred: 'Moderate OA risk', conf: 38, detail: 'Heterozygous — mild cartilage risk increase.' },
    '_DEF': { emoji: '🟢', pred: 'Lower hip OA risk', conf: 42, detail: 'Common — normal Wnt cartilage protection.' }
})},
rs9340799: { gene: 'ESR1 PvuII (intron 1)', category: 'bone', trait: 'Bone Mineral Density (ESR1 PvuII)', interpret: I({
    'GG': { emoji: '🦴', pred: 'Higher bone mineral density', conf: 50, detail: 'ESR1 PvuII G — associated with protective bone density in both sexes; lower fracture risk.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate bone density', conf: 38, detail: 'Heterozygous — moderate BMD.' },
    '_DEF': { emoji: '⚠️', pred: 'Lower bone density tendency', conf: 45, detail: 'CC — lower BMD; increased osteoporosis and fracture risk, especially post-menopause.' }
})},
rs3736228: { gene: 'LRP5 Ala1330Val', category: 'bone', trait: 'Bone Strength (Wnt/LRP5 Signaling)', interpret: I({
    'CC': { emoji: '💪', pred: 'Higher bone mineral density', conf: 55, detail: 'LRP5 Wnt co-receptor — Ala1330 common allele; stronger bones, lower fracture risk.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate bone strength', conf: 42, detail: 'Heterozygous — mixed bone density.' },
    '_DEF': { emoji: '⚠️', pred: 'Lower bone density tendency', conf: 50, detail: 'Val1330 — reduced LRP5 Wnt signaling; lower BMD, higher fracture risk. Calcium, vitamin D, weight training important.' }
})},
rs1800012: { gene: 'COL1A1 Sp1 (intron 1)', category: 'bone', trait: 'Bone Collagen Quality (COL1A1)', interpret: I({
    'GG': { emoji: '🦴', pred: 'Normal bone collagen structure', conf: 55, detail: 'Common allele — standard type I collagen assembly; lower fragility fracture risk.' },
    '_HET': { emoji: '🔸', pred: 'Slightly altered collagen quality', conf: 42, detail: 'Sp1 GT — moderate increase in vertebral fracture risk in some studies.' },
    'TT': { emoji: '⚠️', pred: 'Higher fragility fracture risk', conf: 50, detail: 'Sp1 TT — altered collagen α1 chain ratio; lower bone tensile strength; higher fracture risk.' }
})},
rs2234693: { gene: 'ESR1 XbaI (intron 1)', category: 'bone', trait: 'Osteoporosis Risk (ESR1 XbaI)', interpret: I({
    'CC': { emoji: '🦴', pred: 'Better bone density (ESR1 XbaI)', conf: 45, detail: 'Protective ESR1 X allele — better estrogen receptor response for bone maintenance.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate bone density', conf: 35, detail: 'Heterozygous.' },
    '_DEF': { emoji: '⚠️', pred: 'Lower bone density tendency', conf: 40, detail: 'xx genotype — lower estrogen receptor activity in bone; higher osteoporosis risk post-menopause.' }
})},

// ══════════════════════════════════════
//  🛡️  AUTOIMMUNE & INFLAMMATION
// ══════════════════════════════════════
rs2476601: { gene: 'PTPN22 R620W (C1858T)', category: 'autoimmune', trait: 'Rheumatoid Arthritis / Type 1 Diabetes / Lupus Risk', interpret: I({
    'AA': { emoji: '🔴', pred: 'Higher autoimmune risk (PTPN22 W620)', conf: 70, detail: 'PTPN22 Trp620 — impaired T-cell signaling; major risk factor for RA, T1D, lupus, thyroiditis, Graves disease.' },
    '_HET': { emoji: '⚠️', pred: 'Elevated autoimmune risk (carrier)', conf: 62, detail: 'One W620 allele — RA risk ~1.5×; T1D risk ~1.5×. Monitor for joint/thyroid symptoms.' },
    '_DEF': { emoji: '🟢', pred: 'Lower autoimmune risk (PTPN22)', conf: 65, detail: 'Common Arg620 — normal lymphocyte signaling; lower autoimmune predisposition from this locus.' }
})},
rs2104286: { gene: 'IL2RA/CD25 (chr10p15)', category: 'autoimmune', trait: 'Type 1 Diabetes & Multiple Sclerosis Risk (IL2RA)', interpret: I({
    'GG': { emoji: '⚠️', pred: 'Higher T1D / MS genetic risk', conf: 52, detail: 'IL-2 receptor α chain (CD25) — T-regulatory cell function; risk allele for type 1 diabetes and multiple sclerosis.' },
    '_HET': { emoji: '🔸', pred: 'Moderate autoimmune risk', conf: 44, detail: 'Heterozygous — intermediate T-reg immune modulation.' },
    '_DEF': { emoji: '🟢', pred: 'Lower T1D / MS risk (IL2RA)', conf: 50, detail: 'Protective allele — better Treg function.' }
})},
rs1800629: { gene: 'TNF-α promoter -308G>A', category: 'autoimmune', trait: 'TNF-α / Chronic Inflammation', interpret: I({
    'AA': { emoji: '🔴', pred: 'High TNF-α producer', conf: 60, detail: 'TNF-α promoter A/A — 3× higher basal TNF-α; chronic inflammation risk; linked to RA, Crohn\'s, sepsis severity, and psoriasis.' },
    'GA': { emoji: '🟡', pred: 'Intermediate TNF-α producer', conf: 55, detail: 'G/A heterozygous — 2× higher TNF; moderate inflammatory response elevation.' },
    'AG': { emoji: '🟡', pred: 'Intermediate TNF-α producer', conf: 55, detail: 'G/A heterozygous — 2× higher TNF; moderate inflammatory response elevation.' },
    '_DEF': { emoji: '🟢', pred: 'Normal TNF-α production (GG)', conf: 55, detail: 'GG — standard inflammatory response.' }
})},
rs9272346: { gene: 'HLA-DQ locus (DQ8)', category: 'autoimmune', trait: 'HLA-DQ8 — Celiac Disease & T1D Risk', interpret: I({
    'GG': { emoji: '⚠️', pred: 'HLA-DQ8 present — celiac/T1D risk', conf: 58, detail: 'DQ8 haplotype — second major celiac risk allele (after DQ2); also strong T1D susceptibility allele. Celiac testing recommended if GI symptoms.' },
    '_HET': { emoji: '🔸', pred: 'One DQ8 allele — moderate risk', conf: 48, detail: 'Partial DQ8 susceptibility — lower but elevated celiac/T1D risk.' },
    '_DEF': { emoji: '🟢', pred: 'No DQ8 (lower celiac from this locus)', conf: 52, detail: 'No DQ8 allele — lower genetic celiac/DQ8-T1D risk.' }
})},
rs2230926: { gene: 'TNFAIP3/A20 (6q23)', category: 'autoimmune', trait: 'Broad Autoimmune Susceptibility (A20/TNFAIP3)', interpret: I({
    'TT': { emoji: '⚠️', pred: 'Higher A20 autoimmune risk', conf: 52, detail: 'TNFAIP3 (A20) — NF-κB ubiquitin editor; risk for RA, lupus, psoriasis, thyroid disease, and inflammatory bowel disease.' },
    '_HET': { emoji: '🔸', pred: 'Moderate A20 autoimmune risk', conf: 42, detail: 'Heterozygous — mild NF-κB pathway dysregulation.' },
    '_DEF': { emoji: '🟢', pred: 'Lower A20 autoimmune risk', conf: 50, detail: 'Common — normal NF-κB signaling; lower autoimmune susceptibility from this locus.' }
})},
rs3135538: { gene: 'HLA-B*27 proxy (MICA)', category: 'autoimmune', trait: 'Ankylosing Spondylitis / HLA-B27 (Proxy)', interpret: I({
    'AA': { emoji: '⚠️', pred: 'Possible HLA-B27 association — AS risk', conf: 55, detail: 'Proxy for B27 region — ankylosing spondylitis risk (B27 is not directly genotyped on most arrays). Back pain + this allele warrants rheumatology evaluation.' },
    '_HET': { emoji: '🔸', pred: 'Moderate AS risk proxy', conf: 42, detail: 'Heterozygous — intermediate AS susceptibility.' },
    '_DEF': { emoji: '🟢', pred: 'Lower AS risk (proxy)', conf: 48, detail: 'Common — lower ankylosing spondylitis risk from this region.' }
})},

// ══════════════════════════════════════
//  💭  MENTAL HEALTH GENETICS
// ══════════════════════════════════════
rs1800532: { gene: 'TPH1 A218C', category: 'mental', trait: 'Peripheral Serotonin Synthesis (TPH1)', interpret: I({
    'AA': { emoji: '😊', pred: 'Higher peripheral serotonin (TPH1 AA)', conf: 48, detail: 'TPH1 A allele — higher tryptophan hydroxylase activity; better gut serotonin production (95% of body serotonin is gut-derived).' },
    '_HET': { emoji: '🔸', pred: 'Intermediate serotonin synthesis', conf: 38, detail: 'Heterozygous — moderate gut serotonin.' },
    '_DEF': { emoji: '⬇️', pred: 'Lower peripheral serotonin (CC)', conf: 45, detail: 'CC — reduced TPH1 activity; lower gut serotonin; may affect mood regulation and IBS risk.' }
})},
rs25531: { gene: 'SLC6A4 5-HTTLPR region', category: 'mental', trait: 'Serotonin Transporter — Emotional Reactivity', interpret: I({
    'GG': { emoji: '🌊', pred: 'Higher emotional reactivity (5-HTTLPR short proxy)', conf: 52, detail: '5-HTTLPR S-allele proxy — reduced serotonin reuptake; stress-sensitive, higher anxiety/depression in adverse environments. Good response to SSRIs.' },
    '_HET': { emoji: '🔸', pred: 'Moderate emotional reactivity (L/S)', conf: 43, detail: 'Short/long heterozygous — intermediate stress response.' },
    '_DEF': { emoji: '🛡️', pred: 'More resilient serotonin transport (L/L)', conf: 50, detail: 'Long/long — higher serotonin reuptake efficiency; more stress-resilient.' }
})},
rs362584: { gene: 'GRIN2B (NR2B)', category: 'mental', trait: 'NMDA Receptor / Cognition & Learning', interpret: I({
    'CC': { emoji: '🧠', pred: 'Enhanced NMDA receptor function', conf: 40, detail: 'GRIN2B — NMDA glutamate receptor subunit; involved in synaptic plasticity, learning, and working memory.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate NMDA function', conf: 32, detail: 'Heterozygous — moderate cognitive profile.' },
    '_DEF': { emoji: '⚪', pred: 'Typical NMDA receptor function', conf: 38, detail: 'Common — standard glutamate signaling.' }
})},
rs2180619: { gene: 'CRHR1 (Corticotropin releasing hormone receptor 1)', category: 'mental', trait: 'Stress Response / HPA Axis (CRHR1)', interpret: I({
    'GG': { emoji: '😤', pred: 'Heightened HPA stress response', conf: 45, detail: 'CRHR1 — stress hormone receptor; G allele associated with stronger cortisol response to stress, higher anxiety and depression risk in early adversity.' },
    '_HET': { emoji: '🔸', pred: 'Moderate stress reactivity', conf: 36, detail: 'Heterozygous — intermediate cortisol response.' },
    '_DEF': { emoji: '🧘', pred: 'More buffered stress response', conf: 42, detail: 'A allele — more moderate HPA axis activation; better stress resilience.' }
})},
rs3756290: { gene: 'MAOA (Promoter region)', category: 'mental', trait: 'Monoamine Oxidase A — Impulse & Mood', interpret: I({
    'GG': { emoji: '⚡', pred: 'Lower MAO-A activity (sensitive variant)', conf: 42, detail: 'Lower MAOA expression — slower serotonin / dopamine breakdown; stronger emotional responses; higher impulsivity risk with early adversity.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate MAO-A activity', conf: 33, detail: 'Heterozygous — partial effect.' },
    '_DEF': { emoji: '🛡️', pred: 'Higher MAO-A activity (resilient variant)', conf: 40, detail: 'Higher MAOA expression — faster monoamine clearance; more stable mood baseline.' }
})},
rs4141463: { gene: 'NEGR1 (Depression GWAS)', category: 'mental', trait: 'Major Depression Risk (NEGR1 GWAS)', interpret: I({
    'CC': { emoji: '⚠️', pred: 'Slightly higher depression risk (NEGR1)', conf: 40, detail: 'NEGR1 — neuronal growth regulator 1; one of largest GWAS hits for major depressive disorder (~25% risk increase per allele).' },
    '_HET': { emoji: '🔸', pred: 'Moderate depression risk', conf: 33, detail: 'Heterozygous — partial polygenic risk.' },
    '_DEF': { emoji: '🟢', pred: 'Lower depression risk (NEGR1)', conf: 40, detail: 'Protective allele at this locus.' }
})},
rs1006737: { gene: 'CACNA1C (Bipolar/Schizophrenia)', category: 'mental', trait: 'Bipolar Disorder / Schizophrenia Risk (CACNA1C)', interpret: I({
    'AA': { emoji: '⚠️', pred: 'Higher BD/SCZ risk (CACNA1C)', conf: 45, detail: 'CACNA1C — L-type calcium channel; strong cross-disorder hit for bipolar, schizophrenia, and MDD. L-type calcium channel blockers may have therapeutic relevance.' },
    '_HET': { emoji: '🔸', pred: 'Moderate BD/SCZ risk', conf: 37, detail: 'Heterozygous — moderate calcium channel effect.' },
    '_DEF': { emoji: '🟢', pred: 'Lower BD/SCZ risk (CACNA1C)', conf: 42, detail: 'Common protective allele.' }
})},

// ══════════════════════════════════════
//  ⚗️  HORMONAL & ENDOCRINE
// ══════════════════════════════════════
rs6152: { gene: 'AR (Androgen Receptor) exon 1', category: 'hormonal', trait: 'Androgen Receptor Sensitivity (AR)', interpret: I({
    'CC': { emoji: '💪', pred: 'Higher androgen sensitivity', conf: 50, detail: 'AR — androgen receptor; higher testosterone responsiveness; anabolic muscle building, libido, body hair. Also slightly higher prostate sensitivity in males.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate androgen sensitivity', conf: 40, detail: 'Heterozygous — moderate testosterone receptor activity.' },
    '_DEF': { emoji: '⚪', pred: 'Lower androgen sensitivity', conf: 45, detail: 'Longer CAG repeats (lower activity) — less testosterone response; lower muscle anabolism from the same testosterone level.' }
})},
rs1799941: { gene: 'SHBG Asp356Asn', category: 'hormonal', trait: 'Sex Hormone Binding Globulin (SHBG)', interpret: I({
    'AA': { emoji: '⬆️', pred: 'Higher SHBG — lower free hormones', conf: 52, detail: 'SHBG Asn356 — more sex hormone binding globulin; lower free testosterone and estradiol; may affect libido, muscle mass, and estrogen-related risks.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate SHBG levels', conf: 42, detail: 'Heterozygous — moderate binding globulin.' },
    '_DEF': { emoji: '⬇️', pred: 'Lower SHBG — more free hormones', conf: 48, detail: 'Asp356 — lower SHBG; higher free testosterone and estrogen; higher anabolism but also higher estrogen-driven risks.' }
})},
rs6165: { gene: 'FSHR Asn680Ser', category: 'hormonal', trait: 'FSH Receptor — Fertility & Menopause Timing', interpret: I({
    'AA': { emoji: '🌸', pred: 'Lower FSH receptor sensitivity (Asn/Asn)', conf: 48, detail: 'FSHR Asn680 — lower FSH sensitivity; may require higher FSH for ovarian response; earlier puberty and menopause onset in some studies.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate FSH receptor response', conf: 38, detail: 'Heterozygous — mixed FSH sensitivity.' },
    '_DEF': { emoji: '🌸', pred: 'Higher FSH receptor sensitivity (Ser/Ser)', conf: 45, detail: 'FSHR Ser680 — better FSH response; later menopause and more eggs per cycle in some studies.' }
})},
rs2069526: { gene: 'IL6 region (ovarian reserve proxy)', category: 'hormonal', trait: 'Ovarian Reserve Proxy (AMH region)', interpret: I({
    'GG': { emoji: '🌸', pred: 'Higher ovarian reserve tendency', conf: 38, detail: 'Proxy for AMH-related variation — higher antral follicle count and ovarian reserve.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate ovarian reserve', conf: 30, detail: 'Heterozygous — moderate effect.' },
    '_DEF': { emoji: '⚪', pred: 'Typical ovarian reserve', conf: 35, detail: 'Common — baseline follicular pool.' }
})},
rs10835211: { gene: 'TSHR (Thyroid Stimulating Hormone Receptor)', category: 'hormonal', trait: 'Thyroid Function / TSH Set Point', interpret: I({
    'GG': { emoji: '⚡', pred: 'Higher thyroid sensitivity / lower TSH set point', conf: 50, detail: 'TSHR — TSH receptor; affects normal TSH range and thyroid hormone production. May protect against subclinical hypothyroidism.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate thyroid set point', conf: 40, detail: 'Heterozygous — moderate TSH range shift.' },
    '_DEF': { emoji: '🌡️', pred: 'Lower thyroid sensitivity — higher TSH tendency', conf: 45, detail: 'May trend toward higher normal TSH; check thyroid function if fatigued.' }
})},
rs4846914: { gene: 'GNMT (Folate/Methylation-Hormone link)', category: 'hormonal', trait: 'Estrogen Metabolism / Methylation Capacity', interpret: I({
    'GG': { emoji: '🔄', pred: 'Efficient estrogen methylation', conf: 42, detail: 'GNMT — glycine N-methyltransferase; better methyl group availability for estrogen inactivation and hormone balance.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate methylation capacity', conf: 33, detail: 'Heterozygous.' },
    '_DEF': { emoji: '⚠️', pred: 'Reduced estrogen methylation capacity', conf: 40, detail: 'Lower GNMT — less efficient estrogen breakdown; may increase estrogen-dominant tendencies.' }
})},

// ══════════════════════════════════════
//  🩹  SKIN CONDITIONS & SENSITIVITY
// ══════════════════════════════════════
rs4986790: { gene: 'TLR4 D299G', category: 'skin_health', trait: 'Atopic Eczema / Skin Barrier Inflammation (TLR4)', interpret: I({
    'TT': { emoji: '🩹', pred: 'Higher eczema / TLR4 sensitivity risk', conf: 50, detail: 'TLR4 Gly299 — altered innate immune detection; higher atopic eczema and LPS sensitivity. Moisturize regularly; avoid irritants.' },
    '_HET': { emoji: '🔸', pred: 'Moderate eczema/TLR4 risk', conf: 42, detail: 'Heterozygous — mild skin immune dysregulation.' },
    '_DEF': { emoji: '🟢', pred: 'Normal TLR4 skin immune function', conf: 48, detail: 'Common Asp299 — standard innate skin immunity.' }
})},
rs877375: { gene: 'SPINK5 E420K', category: 'skin_health', trait: 'Atopic Dermatitis / Netherton Syndrome Risk (SPINK5)', interpret: I({
    'TT': { emoji: '⚠️', pred: 'Higher atopic dermatitis risk (SPINK5 KK)', conf: 55, detail: 'SPINK5 K420 — reduced LEKTI serine protease inhibitor; impaired skin barrier; strongly associated with atopic dermatitis and allergic sensitization.' },
    '_HET': { emoji: '🔸', pred: 'Moderate eczema risk (EK heterozygous)', conf: 45, detail: 'One K420 allele — partial skin barrier deficit.' },
    '_DEF': { emoji: '🟢', pred: 'Normal skin barrier (SPINK5 EE)', conf: 52, detail: 'Glu420 — full LEKTI function; better epidermal barrier integrity.' }
})},
rs1800872: { gene: 'IL10 -592C>A', category: 'skin_health', trait: 'Psoriasis & Eczema (IL-10 Promoter)', interpret: I({
    'AA': { emoji: '⚠️', pred: 'Lower IL-10, higher skin inflammation risk', conf: 52, detail: 'IL-10 -592A — lower anti-inflammatory IL-10 production; higher psoriasis, eczema, and lupus susceptibility.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate IL-10 / skin inflammation', conf: 43, detail: 'Heterozygous C/A — moderate IL-10 reduction.' },
    '_DEF': { emoji: '🟢', pred: 'Higher IL-10, anti-inflammatory (CC)', conf: 50, detail: 'Higher IL-10 at -592C — better inflammation dampening; lower psoriasis risk from this locus.' }
})},
rs1800795: { gene: 'IL6 -174G>C', category: 'skin_health', trait: 'IL-6 / Systemic Inflammation', interpret: I({
    'CC': { emoji: '⚠️', pred: 'Lower IL-6 — anti-inflammatory profile', conf: 48, detail: 'IL-6 -174C — paradoxically some studies link to lower acute IL-6 but different chronic patterns. Complex context-dependent effect.' },
    '_HET': { emoji: '🔸', pred: 'Intermediate IL-6 production', conf: 38, detail: 'Heterozygous — moderate systemic inflammation level.' },
    'GG': { emoji: '🔴', pred: 'Higher IL-6 production — pro-inflammatory', conf: 48, detail: 'GG — higher basal IL-6; linked to psoriasis, RA, and metabolic inflammation risk.' },
    '_DEF': { emoji: '🟢', pred: 'Typical IL-6 levels', conf: 38, detail: 'Common.' }
})},
rs2201841: { gene: 'IL23R (Psoriasis/IBD)', category: 'skin_health', trait: 'Psoriasis & Inflammatory Bowel Disease Risk (IL23R)', interpret: I({
    'TT': { emoji: '⚠️', pred: 'Higher psoriasis / IBD risk (IL23R)', conf: 60, detail: 'IL-23 receptor Arg381Gln — major locus for psoriasis, ankylosing spondylitis, Crohn\'s, and ulcerative colitis.' },
    '_HET': { emoji: '🔸', pred: 'Moderate IL23R inflammatory risk', conf: 50, detail: 'Heterozygous — moderate IL-23 signaling risk.' },
    '_DEF': { emoji: '🟢', pred: 'Lower IL23R inflammatory risk', conf: 55, detail: 'Gln381 — protective; lower psoriasis/IBD genetic risk.' }
})},

// ══════════════════════════════════════
//  🎗️  CANCER SUSCEPTIBILITY (Polygenic)
// ══════════════════════════════════════
rs4430796: { gene: 'HNF1B (chr17q12)', category: 'cancer', trait: 'Prostate & Ovarian Cancer Risk (HNF1B)', interpret: I({
    'GG': { emoji: '⚠️', pred: 'Higher prostate/ovarian cancer risk', conf: 55, detail: 'HNF1B — transcription factor; top GWAS hit for prostate cancer risk; also associated with ovarian and endometrial cancer.' },
    '_HET': { emoji: '🔸', pred: 'Moderate cancer risk (HNF1B)', conf: 45, detail: 'Heterozygous — ~1.2× prostate cancer risk increment.' },
    '_DEF': { emoji: '🟢', pred: 'Lower cancer risk at HNF1B locus', conf: 50, detail: 'Protective allele.' }
})},
rs10993994: { gene: 'MSMB (chr10q11)', category: 'cancer', trait: 'Prostate Cancer Risk (MSMB)', interpret: I({
    'TT': { emoji: '⚠️', pred: 'Higher prostate cancer risk (MSMB TT)', conf: 60, detail: 'MSMB microseminoprotein-β locus — TT reduces PSM-β expression (~1.6× prostate cancer risk vs CC). PSA screening important.' },
    '_HET': { emoji: '🔸', pred: 'Moderate prostate cancer risk', conf: 50, detail: 'Heterozygous CT — intermediate risk (~1.3×).' },
    '_DEF': { emoji: '🟢', pred: 'Lower prostate cancer risk (CC)', conf: 55, detail: 'CC — higher MSMB expression; protective.' }
})},
rs1447295: { gene: '8q24 (MYC enhancer region)', category: 'cancer', trait: 'Prostate, Colorectal & Bladder Cancer Risk (8q24)', interpret: I({
    'AA': { emoji: '🔴', pred: 'Higher multi-cancer risk (8q24 AA)', conf: 60, detail: '8q24 near MYC — pan-cancer risk locus; 2-3× higher prostate cancer risk; also colorectal and bladder. Screen per guidelines.' },
    '_HET': { emoji: '🔸', pred: 'Moderate cancer risk (8q24)', conf: 50, detail: 'One risk allele — ~1.5× prostate cancer risk.' },
    '_DEF': { emoji: '🟢', pred: 'Lower 8q24 cancer risk', conf: 55, detail: 'Protective alleles — baseline cancer risk from this locus.' }
})},
rs2736100: { gene: 'TERT (5p15.33)', category: 'cancer', trait: 'Telomerase / Multi-Cancer Susceptibility (TERT)', interpret: I({
    'AA': { emoji: '⚠️', pred: 'Higher cancer susceptibility (TERT AA)', conf: 55, detail: 'TERT 5p15 — telomerase reverse transcriptase locus; risk for lung, glioma, bladder, thyroid, ovarian, and testicular cancers. Also linked to telomere length.' },
    '_HET': { emoji: '🔸', pred: 'Moderate TERT cancer risk', conf: 45, detail: 'Heterozygous — ~1.2× multi-cancer risk increment.' },
    '_DEF': { emoji: '🟢', pred: 'Lower TERT cancer susceptibility', conf: 50, detail: 'Protective allele.' }
})},
rs3817198: { gene: 'LSP1 (11p15.5)', category: 'cancer', trait: 'Breast Cancer Risk (LSP1/11p15.5)', interpret: I({
    'CC': { emoji: '⚠️', pred: 'Higher breast cancer risk (LSP1)', conf: 52, detail: 'LSP1 locus — lymphocyte-specific protein; ~1.2× breast cancer risk per C allele. Mammography screening adherence important.' },
    '_HET': { emoji: '🔸', pred: 'Moderate breast cancer risk', conf: 42, detail: 'Heterozygous — slight risk increment.' },
    '_DEF': { emoji: '🟢', pred: 'Lower breast cancer risk (LSP1)', conf: 48, detail: 'Common protective allele.' }
})},
rs10757274: { gene: '9p21.3 (CDKN2A/B)', category: 'cancer', trait: 'Colorectal, Pancreatic & CVD Risk (9p21.3)', interpret: I({
    'GG': { emoji: '🔴', pred: 'Higher multi-disease risk (9p21.3)', conf: 60, detail: '9p21.3 — CDKN2A/B regulatory region; risk for colorectal cancer, pancreatic cancer, AND cardiovascular disease. One of the most replicated disease-risk loci.' },
    '_HET': { emoji: '🔸', pred: 'Moderate 9p21.3 risk', conf: 50, detail: 'One risk allele — ~1.3× disease risk increment.' },
    '_DEF': { emoji: '🟢', pred: 'Lower 9p21.3 disease risk', conf: 55, detail: 'Protective alleles at CDKN2A/B.' }
})},
rs12255372: { gene: 'TCF7L2 (colorectal)', category: 'cancer', trait: 'Colorectal Cancer Risk (TCF7L2)', interpret: I({
    'TT': { emoji: '⚠️', pred: 'Higher colorectal cancer risk (TCF7L2)', conf: 52, detail: 'TCF7L2 T allele (same gene as T2D) — Wnt signaling; ~1.2× colorectal cancer risk. Colonoscopy screening per guidelines.' },
    '_HET': { emoji: '🔸', pred: 'Moderate colorectal cancer risk', conf: 42, detail: 'Heterozygous — mild risk increment.' },
    '_DEF': { emoji: '🟢', pred: 'Lower colorectal cancer risk (TCF7L2)', conf: 48, detail: 'Protective allele.' }
})},

}; // end SNP_DB
