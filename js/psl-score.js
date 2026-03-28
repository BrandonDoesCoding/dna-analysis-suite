// =============================================
// PSL SCORE — Genetic Physical Aesthetic Estimate
// Scores 35+ phenotype SNPs across 8 systems
// Base: 4.0 (median). Scale: 1 (bottom) → 8 (perfection)
// =============================================

function buildPSLScore(parsedSNPs) {
    const base = 4.0;
    let score = base;
    const cats = []; // { name, icon, delta, items[] }

    function snp(id) { return (parsedSNPs[id] || '').toUpperCase(); }
    function is(id, ...gts) { const g = snp(id); return gts.some(x => x === g || x === g.split('').reverse().join('')); }
    function het(id) { const g = snp(id); return g.length === 2 && g[0] !== g[1]; }

    function cat(name, icon, fn) {
        const before = score;
        const items = [];
        fn(items);
        const delta = parseFloat((score - before).toFixed(3));
        if (items.length) cats.push({ name, icon, delta, items });
    }

    function add(items, d, label, note, dir) {
        score += d;
        items.push({ d: parseFloat(d.toFixed(3)), label, note, dir });
    }

    // ═══════════════════════════════════════════════
    // 1. EYES & PERIOCULAR  (max ~+0.60)
    // ═══════════════════════════════════════════════
    cat('Eyes & Periocular', '👁️', items => {
        // Primary eye color — rs12913832 (HERC2/OCA2)
        if      (is('rs12913832','GG'))         add(items,  0.40, 'Blue Eyes (HERC2/OCA2)',      'GG — two blue-eye alleles; lightest eye phenotype. Highest rated eye color in studies.', 'pos');
        else if (is('rs12913832','AG','GA'))     add(items,  0.20, 'Green/Hazel Eyes (HERC2)',    'One blue allele — green or hazel likely. Highly rated, rare globally.', 'pos');
        else if (snp('rs12913832'))              add(items,  0,    'Brown Eyes (HERC2/OCA2)',     'AA — brown eyes; most common globally, neutral aesthetic score.', 'neu');

        // Green modifier — rs1800407 (OCA2 R419Q)
        if      (is('rs1800407','TT','AA'))      add(items,  0.10, 'Green Eye Modifier (OCA2)',   'Homozygous OCA2 R419Q — strong shift toward green pigmentation.', 'pos');
        else if (het('rs1800407'))               add(items,  0.05, 'Green Eye Modifier (OCA2)',   'Heterozygous — possible green/hazel tint modifier.', 'pos');

        // IRF4 lightening — rs12203592
        if      (is('rs12203592','TT'))          add(items,  0.08, 'Light Eye Boost (IRF4)',      'TT — strong IRF4 pigmentation lightening effect on iris.', 'pos');
        else if (het('rs12203592'))              add(items,  0.04, 'Light Eye Boost (IRF4)',      'Heterozygous IRF4 — mild iris lightening.', 'pos');

        // TYR blue boost — rs1393350
        if      (is('rs1393350','AA'))           add(items,  0.05, 'Blue/Green Boost (TYR)',      'AA at TYR — additional light-iris association.', 'pos');
        else if (het('rs1393350'))               add(items,  0.02, 'Blue/Green Boost (TYR)',      'Heterozygous TYR — mild light-eye effect.', 'pos');

        // OCA2 haplotype — rs7495174
        if      (is('rs7495174','GG'))           add(items,  0.05, 'OCA2 Haplotype (Light)',      'GG — OCA2 haplotype block linked to blue/light iris.', 'pos');

        // HERC2 secondary — rs1129038
        if      (is('rs1129038','GG'))           add(items,  0.05, 'HERC2 Secondary Booster',    'GG — secondary HERC2 support for blue eye phenotype.', 'pos');
        else if (het('rs1129038'))               add(items,  0.02, 'HERC2 Secondary Booster',    'Heterozygous HERC2.', 'pos');

        // SLC45A2 — rs16891982
        if      (is('rs16891982','GG','CC'))     add(items,  0.05, 'Light Pigment (SLC45A2)',     'Derived SLC45A2 allele — light iris and periocular skin.', 'pos');
    });

    // ═══════════════════════════════════════════════
    // 2. HAIR COLOR & TEXTURE  (max ~+0.55, min -0.05)
    // ═══════════════════════════════════════════════
    cat('Hair Color & Texture', '💇', items => {
        // Red hair (MC1R) — distinct premium
        let redAlleles = 0;
        if (is('rs1805007','CT','TC'))           redAlleles += 2; // R151C hom
        else if (het('rs1805007'))               redAlleles += 1;
        if (is('rs1805008','TT'))                redAlleles += 2;
        else if (het('rs1805008'))               redAlleles += 1;
        if (is('rs1110400','TT','CC'))           redAlleles += 2;
        else if (het('rs1110400'))               redAlleles += 1;
        if (het('rs1805005')||is('rs1805005','TT','AA')) redAlleles += 1;
        if (het('rs1805006')||is('rs1805006','AA'))      redAlleles += 1;
        if (het('rs11547464')||is('rs11547464','AA'))    redAlleles += 1;
        if (het('rs1805009'))                    redAlleles += 1;
        if (het('rs2228479'))                    redAlleles += 1;

        if      (redAlleles >= 4)  add(items,  0.30, 'Red/Auburn Hair (MC1R)',         `${redAlleles} MC1R alleles — strong red hair expression; rare and highly distinctive.`, 'pos');
        else if (redAlleles >= 2)  add(items,  0.20, 'Red/Auburn Hair (MC1R)',         `${redAlleles} MC1R alleles — likely red or auburn hair.`, 'pos');
        else if (redAlleles === 1) add(items,  0.10, 'Red Hair Carrier (MC1R)',        '1 MC1R allele — possible reddish tint or auburn highlights.', 'pos');

        // Blond hair — rs12821256 (KITLG)
        if      (is('rs12821256','TT','CC'))     add(items,  0.15, 'Blond Hair (KITLG)',          'Homozygous KITLG — major blond hair predictor. Distinctive and highly rated.', 'pos');
        else if (het('rs12821256'))              add(items,  0.07, 'Blond Hair (KITLG)',          'Heterozygous KITLG — possible light brown or dirty blond.', 'pos');

        // TYRP1 blond — rs683
        if      (snp('rs683') && !is('rs683','GG')) add(items, 0.06, 'Blond Modifier (TYRP1)',   'TYRP1 light-hair variant — contributes to blond phenotype.', 'pos');

        // SLC24A4 lightening — rs12896399
        if      (is('rs12896399','TT'))          add(items,  0.06, 'Light Hair (SLC24A4)',        'TT — additional hair lightening; pushes toward lighter shades.', 'pos');
        else if (het('rs12896399'))              add(items,  0.03, 'Light Hair (SLC24A4)',        'Heterozygous SLC24A4.', 'pos');

        // EDAR V370A — rs3827760 (hair thickness — favoured for scalp density)
        if      (is('rs3827760','GG'))           add(items,  0.08, 'Thick Hair Density (EDAR)',   'GG (V370A hom) — significantly thicker hair shafts; higher visual hair density.', 'pos');
        else if (het('rs3827760'))               add(items,  0.04, 'Thick Hair (EDAR)',           'Heterozygous EDAR — moderately thicker hair.', 'pos');

        // Hair texture (curly/wavy hair — many find attractive)
        let curlScore = 0;
        if (het('rs11803731') || is('rs11803731','AA'))  curlScore++;
        if (het('rs17646946') || is('rs17646946','AA'))  curlScore++;
        if (het('rs7349332'))                            curlScore++;
        if (het('rs2218065'))                            curlScore++;
        if (curlScore >= 3)       add(items,  0.08, 'Curly/Wavy Hair Genetics',       'Multiple curl-associated alleles — naturally textured hair.', 'pos');
        else if (curlScore >= 1)  add(items,  0.03, 'Slight Wave Tendency',           'Mild wave genetics.', 'pos');
    });

    // ═══════════════════════════════════════════════
    // 3. SKIN & COMPLEXION  (max ~+0.40)
    // ═══════════════════════════════════════════════
    cat('Skin & Complexion', '🎨', items => {
        // SLC24A5 — rs1426654 (strongest skin lightness SNP)
        if      (is('rs1426654','AA'))           add(items,  0.12, 'Light Skin (SLC24A5)',        'AA — European-derived light skin; high OCA2 melanin reduction.', 'pos');
        else if (het('rs1426654'))               add(items,  0.06, 'Intermediate Skin (SLC24A5)', 'GA — intermediate skin tone.', 'pos');

        // SLC45A2 skin — rs28777
        if      (is('rs28777','GG','CC'))        add(items,  0.08, 'Light Skin Tone (SLC45A2)',   'Light pigmentation variant at SLC45A2 — clear, light skin tendency.', 'pos');
        else if (het('rs28777'))                 add(items,  0.04, 'Mild Skin Lightening (SLC45A2)', 'Heterozygous SLC45A2.', 'pos');

        // ASIP — rs2424984 (tanning response)
        if      (snp('rs2424984') && !is('rs2424984','AA')) add(items, 0.06, 'Tanning Ability (ASIP)',  'ASIP variant — efficient melanin tanning response; natural bronze tone.', 'pos');

        // Freckling — rs10756819 (BNC2) — freckles are distinctive/attractive
        if      (is('rs10756819','TT'))          add(items,  0.10, 'Freckles (BNC2)',             'TT — strong freckling genetics; freckles are a distinctively attractive feature.', 'pos');
        else if (het('rs10756819'))              add(items,  0.05, 'Light Freckling (BNC2)',       'Mild freckling tendency.', 'pos');

        // IRF4 freckles — rs4911414
        if      (is('rs4911414','TT'))           add(items,  0.07, 'Freckle Genetics (MC1R region)', 'TT — additional MC1R-region freckling signal.', 'pos');
        else if (het('rs4911414'))               add(items,  0.03, 'Freckle Genetics',            'Heterozygous freckling marker.', 'pos');

        // Vitamin D synthesis — rs12785878 (skin health proxy)
        if      (is('rs12785878','GG'))          add(items,  0.08, 'Vitamin D Skin Health (DHCR7)', 'GG — optimal Vitamin D synthesis; supports healthy skin appearance and glow.', 'pos');
        else if (het('rs12785878'))              add(items,  0.04, 'Vitamin D Skin Health',       'Intermediate Vitamin D synthesis.', 'pos');

        // MMP1 collagen degradation — rs1799750 (skin aging proxy)
        if      (is('rs1799750','GG'))           add(items, -0.08, 'Collagen Degradation (MMP1)',  'GG — 2G/2G homozygote; highest MMP1 matrix metalloproteinase expression; accelerated collagen breakdown and premature skin aging.', 'neg');
        else if (het('rs1799750'))               add(items, -0.03, 'Mild Collagen Risk (MMP1)',    'Heterozygous MMP1 — moderate collagen degradation tendency.', 'neg');
        else if (snp('rs1799750'))               add(items,  0.08, 'Collagen Preservation (MMP1)','AA — 1G/1G; lowest MMP1 expression; superior collagen retention and youthful skin architecture.', 'pos');

        // TNF-α skin inflammation — rs1800629
        if      (is('rs1800629','AA'))           add(items, -0.10, 'Skin Inflammaging (TNF-α)',   'AA — high TNF-α producer; chronic cutaneous inflammation degrades collagen and accelerates visible skin aging.', 'neg');
        else if (het('rs1800629'))               add(items, -0.04, 'Mild Skin Inflammation (TNF-α)', 'Moderate TNF-α skin inflammatory tendency.', 'neg');
        else if (snp('rs1800629'))               add(items,  0.05, 'Low Skin Inflammation (TNF-α)', 'GG — lower TNF-α; calmer baseline skin inflammatory state; supports cleaner complexion.', 'pos');

        // IL-6 skin inflammaging — rs1800795
        if      (is('rs1800795','CC'))           add(items, -0.08, 'Skin Inflammaging (IL-6)',    'CC — high IL-6 producer; accelerates dermal collagen degradation and visible skin aging.', 'neg');
        else if (het('rs1800795'))               add(items, -0.03, 'Mild IL-6 Skin Effect',       'Moderate IL-6 skin inflammaging tendency.', 'neg');
        else if (snp('rs1800795'))               add(items,  0.05, 'Low IL-6 Skin Aging',         'GG — low IL-6; slower inflammatory skin aging; supports clearer, firmer skin.', 'pos');
    });

    // ═══════════════════════════════════════════════
    // 4. FACE MORPHOLOGY  (max +0.50, min -0.45)
    // ═══════════════════════════════════════════════
    cat('Face Morphology', '🧬', items => {
        // Baldness — rs1160312 (20p11 MPB locus) — effect is sex-dependent; impacts males far more than females
        if      (is('rs1160312','GG'))           add(items, -0.35, 'Male Pattern Baldness (20p11)', 'GG — high MPB genetic risk. Males: significant PSL impact (early-onset hair loss ~5–10× baseline). Females: typically presents as mild diffuse thinning only.', 'neg');
        else if (is('rs1160312','AG','GA'))      add(items, -0.15, 'Moderate Baldness Risk (20p11)', 'AG — moderate MPB allele. Males: meaningful early loss risk. Females: minimal impact.', 'neg');
        else if (snp('rs1160312'))               add(items,  0.10, 'Low Baldness Risk',            'AA — protective MPB allele; lower risk across both sexes. Most favourable for male PSL.', 'pos');

        // Unibrow — rs7544382 (PAX3)
        if      (is('rs7544382','AA'))           add(items, -0.20, 'Unibrow Genetics (PAX3)',      'AA — highest unibrow tendency; connected brow affects facial aesthetics negatively.', 'neg');
        else if (is('rs7544382','AG','GA'))      add(items, -0.08, 'Mild Unibrow Tendency (PAX3)', 'AG — mild brow connectivity tendency.', 'neg');
        else if (snp('rs7544382'))               add(items,  0.05, 'Clean Brow Separation (PAX3)', 'GG — no unibrow genetics; well-defined separate brows.', 'pos');

        // Dimples — rs2289252
        if      (is('rs2289252','GG'))           add(items,  0.12, 'Dimples',                     'GG — dimple-associated genotype; facial dimples significantly increase attractiveness ratings.', 'pos');
        else if (het('rs2289252'))               add(items,  0.06, 'Dimple Tendency',             'Heterozygous — possible dimples or cheek definition.', 'pos');

        // Lips — rs3746444 (MIR499A lip thickness)
        if      (is('rs3746444','CC'))           add(items,  0.10, 'Fuller Lips (MIR499A)',        'CC — thicker lip genetic tendency; fuller lips are highly rated.', 'pos');
        else if (het('rs3746444'))               add(items,  0.05, 'Moderate Lip Fullness',        'Heterozygous lip thickness marker.', 'pos');

        // Nose width — rs4648379 (PRDM16)
        if      (is('rs4648379','GG'))           add(items,  0.08, 'Narrower Nose (PRDM16)',       'GG — PRDM16 narrow-nose variant; higher nose bridge and refined nasal profile.', 'pos');
        else if (het('rs4648379'))               add(items,  0.04, 'Average Nose Width (PRDM16)',  'Intermediate nasal width genetics.', 'pos');

        // Nose shape tip — rs1478567 (DCHS2)
        if      (snp('rs1478567') && !is('rs1478567','GG')) add(items, 0.05, 'Nose Shape (DCHS2)', 'DCHS2 variant — refined nose tip morphology.', 'pos');

        // Cleft chin — rs17580 (SERPINA1)
        if      (het('rs17580') || is('rs17580','TT')) add(items, 0.08, 'Cleft Chin (SERPINA1)', 'Cleft chin genetics — highly distinctive facial feature, often rated attractive.', 'pos');

        // Earlobe attachment — rs10195570 (minor effect, neutral/slight positive for free)
        if      (is('rs10195570','GG'))          add(items,  0.03, 'Free Earlobes',               'GG — free earlobe attachment; slightly preferred in aesthetic surveys.', 'pos');

        // SCHIP1/IL2RB — rs2240203 (midface height, facial shape GWAS)
        if      (is('rs2240203','GG'))           add(items,  0.08, 'Midface Height (SCHIP1/IL2RB)', 'GG — SCHIP1/IL2RB variant associated with taller midface and more defined facial height ratio; contributes to masculine/striking appearance.', 'pos');
        else if (het('rs2240203'))               add(items,  0.04, 'Midface Height (SCHIP1)',       'Heterozygous — intermediate midface development genetics.', 'pos');

        // MAFB — rs6740960 (zygomatic arch / cheekbone prominence)
        if      (is('rs6740960','GG'))           add(items,  0.10, 'Cheekbone Definition (MAFB)',   'GG — MAFB zygomatic arch variant; associated with higher, more prominent cheekbones — a key high-PSL facial trait.', 'pos');
        else if (het('rs6740960'))               add(items,  0.05, 'Cheekbone Definition (MAFB)',   'Heterozygous MAFB — moderate zygomatic prominence genetics.', 'pos');

        // TP63 — rs7599488 (lip / philtrum morphology)
        if      (is('rs7599488','AA'))           add(items,  0.08, 'Lip Shape (TP63)',              'AA — TP63 variant associated with Cupid\'s bow lip shape and philtrum definition; highly rated lip morphology genetics.', 'pos');
        else if (het('rs7599488'))               add(items,  0.04, 'Lip Shape (TP63)',              'Heterozygous TP63 — moderate lip shape genetics.', 'pos');
    });

    // ═══════════════════════════════════════════════
    // 5. HEIGHT GENETICS  (max ~+0.45)
    // ═══════════════════════════════════════════════
    cat('Height Genetics', '📏', items => {
        // HMGA2 — rs1042725 (major height locus, ~1cm per allele)
        if      (is('rs1042725','CC'))           add(items,  0.20, 'Height Potential (HMGA2)',     'CC — two tall alleles at HMGA2; strongest single-SNP height locus (~2cm above avg).', 'pos');
        else if (het('rs1042725'))               add(items,  0.10, 'Height Potential (HMGA2)',     'One HMGA2 tall allele (~1cm effect).', 'pos');
        else if (snp('rs1042725'))               add(items,  0,    'Height Neutral (HMGA2)',       'TT — no HMGA2 tall allele.', 'neu');

        // LCORL — rs6440003
        if      (is('rs6440003','TT'))           add(items,  0.10, 'Height Locus (LCORL)',         'TT — favorable LCORL height alleles.', 'pos');
        else if (het('rs6440003'))               add(items,  0.05, 'Height Locus (LCORL)',         'Partial LCORL height benefit.', 'pos');

        // GDF5 — rs143384 & rs6060369
        if      (is('rs143384','CC'))            add(items,  0.08, 'Height (GDF5)',                'CC — GDF5 tall variant; joint health and stature benefit.', 'pos');
        else if (het('rs143384'))                add(items,  0.04, 'Height (GDF5)',                'Partial GDF5 height allele.', 'pos');

        if      (is('rs6060369','CC'))           add(items,  0.08, 'Height (GDF5-UQCC)',           'CC — GDF5-UQCC height locus favorable.', 'pos');
        else if (het('rs6060369'))               add(items,  0.04, 'Height (GDF5-UQCC)',           'Partial GDF5-UQCC height allele.', 'pos');

        // LIN28B — rs7759938 (growth timing)
        if      (is('rs7759938','CC'))           add(items,  0.07, 'Growth Timing (LIN28B)',       'CC — LIN28B delayed growth timing; supports taller final stature.', 'pos');
        else if (het('rs7759938'))               add(items,  0.04, 'Growth Timing (LIN28B)',       'Partial LIN28B effect.', 'pos');

        // EFEMP1 — rs3791679
        if      (is('rs3791679','CC'))           add(items,  0.05, 'Height (EFEMP1)',              'CC — EFEMP1 favorable height variant.', 'pos');
        else if (het('rs3791679'))               add(items,  0.03, 'Height (EFEMP1)',              'Partial EFEMP1.', 'pos');

        // LRP5 — rs4988321 (bone mineral density → stature)
        if      (is('rs4988321','CC'))           add(items,  0.06, 'Bone Density / Frame (LRP5)',  'CC — favorable LRP5 Wnt-bone signaling; higher bone mineral density supports tall, well-structured skeletal frame.', 'pos');
        else if (het('rs4988321'))               add(items,  0.03, 'Bone Frame (LRP5)',            'Heterozygous LRP5 — partial bone density benefit.', 'pos');

        // VDR Taq1 — rs731236 (calcium absorption → bone growth)
        if      (is('rs731236','GG'))            add(items,  0.05, 'Bone Growth (VDR Taq1)',       'GG (TT genotype) — high VDR activity; optimal calcium absorption; supports maximal skeletal growth and frame size.', 'pos');
        else if (het('rs731236'))                add(items,  0.02, 'Bone Growth (VDR)',            'Heterozygous VDR Taq1.', 'pos');
    });

    // ═══════════════════════════════════════════════
    // 6. PHYSIQUE & ATHLETICS  (max +0.45, min -0.30)
    // ═══════════════════════════════════════════════
    cat('Physique & Athletics', '💪', items => {
        // ACTN3 muscle fiber — rs1815739
        if      (is('rs1815739','CC'))           add(items,  0.25, 'Power Muscle Fiber (ACTN3 RR)', 'CC — both ACTN3 alleles functional; maximum fast-twitch muscle potential. Athletic, muscular build.', 'pos');
        else if (is('rs1815739','CT','TC'))      add(items,  0.10, 'Mixed Muscle (ACTN3 RX)',       'CT — one functional ACTN3 allele; balanced muscle type.', 'pos');
        else if (is('rs1815739','TT'))           add(items,  0,    'Endurance Fiber (ACTN3 XX)',    'TT — no α-actinin-3; lean endurance physique tendency, less bulk potential.', 'neu');

        // PPARGC1A VO2max — rs8192678
        if      (is('rs8192678','AA'))           add(items,  0.10, 'High Aerobic Capacity (PGC-1α)', 'AA — high mitochondrial efficiency; supports athletic, lean appearance.', 'pos');
        else if (het('rs8192678'))               add(items,  0.05, 'Good Aerobic Capacity',        'Heterozygous PGC-1α.', 'pos');

        // Muscle performance — rs1815714 (MYPN)
        if      (is('rs1815714','GG'))           add(items,  0.08, 'Muscle Performance (MYPN)',    'GG — favorable myopaladin variant; enhanced muscle fiber integrity.', 'pos');
        else if (het('rs1815714'))               add(items,  0.04, 'Muscle Performance (MYPN)',    'Partial MYPN benefit.', 'pos');

        // ACE endurance/power — rs7181866
        if      (is('rs7181866','GG'))           add(items,  0.07, 'Power Genetics (ACE)',         'GG — ACE D allele proxy; associated with power sports performance and lean muscle.', 'pos');

        // FTO muscle bias — rs8050136
        if      (is('rs8050136','AA'))           add(items, -0.15, 'Obesity Bias (FTO)',           'AA — FTO obesity-associated allele; higher fat mass tendency reduces physique score.', 'neg');
        else if (het('rs8050136'))               add(items, -0.07, 'Mild Weight Bias (FTO)',       'Mild FTO weight tendency.', 'neg');

        // FTO appetite — rs9939609
        if      (is('rs9939609','AA'))           add(items, -0.15, 'Appetite/Weight (FTO)',        'AA — FTO appetite dysregulation; greater challenge maintaining lean physique.', 'neg');
        else if (het('rs9939609'))               add(items, -0.07, 'Mild Appetite Risk (FTO)',     'Mild FTO effect.', 'neg');
        else if (snp('rs9939609'))               add(items,  0.05, 'Low Obesity Risk (FTO)',       'TT — favorable FTO genotype; easier body composition management.', 'pos');

        // COL1A1 — rs1800012 (connective tissue, structural integrity)
        if      (is('rs1800012','GG'))           add(items,  0.07, 'Connective Tissue (COL1A1)',   'GG — optimal type I collagen production; strong tendons, joints, and structural frame; supports athletic durability and injury resistance.', 'pos');
        else if (het('rs1800012'))               add(items,  0.03, 'Connective Tissue (COL1A1)',   'Heterozygous — moderate collagen I structural benefit.', 'pos');
        else if (is('rs1800012','TT'))           add(items, -0.05, 'Weak Connective Tissue Risk',  'TT — Sp1 binding site variant; weaker type I collagen; higher joint/tendon injury risk and less rigid structural frame.', 'neg');

        // UCP1 — rs1800592 (thermogenesis, leanness)
        if      (is('rs1800592','AA'))           add(items,  0.08, 'Leanness (UCP1 Thermogenesis)', 'AA — enhanced brown adipose thermogenesis; higher resting metabolic rate; naturally leaner physique tendency without extra effort.', 'pos');
        else if (het('rs1800592'))               add(items,  0.04, 'Moderate Thermogenesis (UCP1)', 'Heterozygous UCP1 — partial thermogenesis advantage.', 'pos');
        else if (snp('rs1800592'))               add(items,  0,    'Standard Thermogenesis (UCP1)', 'Non-AA — standard UCP1; typical caloric efficiency.', 'neu');
    });

    // ═══════════════════════════════════════════════
    // 7. HORMONAL BLUEPRINT  (max +0.45, min -0.10)
    // ═══════════════════════════════════════════════
    cat('Hormonal Blueprint', '⚗️', items => {
        // Androgen Receptor — rs6152 (sex-conditional: primarily drives male aesthetics)
        if      (is('rs6152','CC'))              add(items,  0.30, 'High Androgen Sensitivity (AR)', 'CC — strong AR signaling; Males: drives jaw definition, facial bone density, lean mass, and deeper voice. Females: can mean stronger facial definition and higher athletic capacity. Note: same genotype, different phenotypic expression by sex.', 'pos');
        else if (is('rs6152','CT','TC'))         add(items,  0.15, 'Moderate Androgen Sensitivity (AR)', 'CT — intermediate AR signaling; balanced androgenic facial development.', 'pos');
        else if (snp('rs6152'))                  add(items,  0,    'Lower Androgen Sensitivity (AR)',  'TT — reduced AR sensitivity; softer facial structure tendency; females: typically no significant aesthetic penalty.', 'neu');

        // SHBG — rs1799941
        if      (is('rs1799941','AA'))           add(items,  0.15, 'Low SHBG (High Free T)',       'AA — lower SHBG; more bioavailable testosterone; stronger jaw and muscle development.', 'pos');
        else if (het('rs1799941'))               add(items,  0.07, 'Moderate SHBG',               'Intermediate SHBG level.', 'pos');
        else if (snp('rs1799941'))               add(items, -0.05, 'High SHBG (Lower Free T)',     'GG — higher SHBG; more testosterone bound; less facial structure influence.', 'neg');

        // Thyroid — rs10835211
        if      (is('rs10835211','GG'))          add(items,  0.08, 'Optimal Thyroid (TSHR)',       'GG — favorable TSHR set point; supports metabolic efficiency and healthy physique.', 'pos');
        else if (het('rs10835211'))              add(items,  0.04, 'Thyroid Function (TSHR)',      'Intermediate TSHR.', 'pos');

        // Estrogen metabolism — rs4846914
        if      (is('rs4846914','GG'))           add(items,  0.08, 'Estrogen Metabolism (GNMT)',   'GG — efficient estrogen clearance via methylation; supports hormonal balance.', 'pos');
        else if (het('rs4846914'))               add(items,  0.04, 'Estrogen Metabolism (GNMT)',   'Partial methylation benefit.', 'pos');

        // CYP17A1 — rs743572 (androgen biosynthesis, testosterone production)
        if      (is('rs743572','CC'))            add(items,  0.12, 'Androgen Production (CYP17A1)', 'CC — CYP17A1 5′ UTR variant; higher testosterone biosynthesis capacity; supports jaw development, lean mass, and masculinity index.', 'pos');
        else if (het('rs743572'))                add(items,  0.06, 'Androgen Production (CYP17A1)', 'Heterozygous CYP17A1 — moderate testosterone production tendency.', 'pos');
        else if (snp('rs743572'))                add(items, -0.04, 'Lower Androgen Production',    'AA — lower CYP17A1 activity; slightly reduced androgen biosynthesis.', 'neg');

        // ACE I/D — rs1799752 (muscle response, facial vascularity)
        if      (is('rs1799752','DD','AA'))      add(items,  0.08, 'Power / Muscle Response (ACE D)', 'D allele homozygote — higher ACE activity; linked to power performance, lean muscle mass, and strong jaw musculature response.', 'pos');
        else if (het('rs1799752'))               add(items,  0.04, 'Balanced ACE Response',         'Heterozygous ACE I/D — balanced muscle and cardiovascular response.', 'pos');
    });

    // ═══════════════════════════════════════════════
    // 8. METABOLIC APPEARANCE FACTORS  (max +0.15, min -0.35)
    // ═══════════════════════════════════════════════
    cat('Metabolic Appearance', '🏥', items => {
        // PPARG insulin sensitivity — better body comp
        if      (is('rs1801282','GG'))           add(items,  0.10, 'Insulin Sensitivity (PPARG)',  'GG (Pro12Ala) — optimal insulin sensitivity; easiest body composition management.', 'pos');
        else if (het('rs1801282'))               add(items,  0.05, 'Good Insulin Sensitivity',    'Partial Ala allele benefit.', 'pos');

        // MTHFR skin/methylation — rs1801133
        if      (is('rs1801133','CC'))           add(items,  0.08, 'Good Methylation (MTHFR)',     'CC — optimal MTHFR; efficient methylation supports skin quality and collagen production.', 'pos');
        else if (het('rs1801133'))               add(items,  0.04, 'Moderate Methylation (MTHFR)', 'CT — partial methylation capacity.', 'pos');
        else if (is('rs1801133','TT'))           add(items, -0.10, 'Poor Methylation (MTHFR TT)', 'TT — impaired folate metabolism; can affect skin quality and homocysteine levels.', 'neg');

        // Fat/appetite regulation — rs10938397 (GNPDA2)
        if      (is('rs10938397','AA'))          add(items, -0.15, 'Fat Appetite Drive (GNPDA2)',  'AA — higher fat preference and appetite; greater effort needed to maintain healthy weight.', 'neg');
        else if (het('rs10938397'))              add(items, -0.07, 'Mild Appetite Drive',         'Mild GNPDA2 appetite effect.', 'neg');
        else if (snp('rs10938397'))              add(items,  0.05, 'Neutral Appetite (GNPDA2)',   'GG — lower GNPDA2 appetite drive; easier weight maintenance.', 'pos');

        // Triglyceride metabolism — rs12429358 (LPL)
        if      (is('rs12429358','GG'))          add(items,  0.05, 'Lipid Clearance (LPL)',        'GG — efficient LPL lipid metabolism; lower triglyceride accumulation.', 'pos');
    });

    // ═══════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════
    const final   = parseFloat(Math.min(7.5, Math.max(1.5, score)).toFixed(1));
    const totalD  = parseFloat((final - base).toFixed(1));
    const totalM  = cats.reduce((n, c) => n + c.items.length, 0);

    // Tier mapping — follows official PSL Community rating scale
    function getTier(s) {
        if (s >= 7.5) return {
            tier: 'PSL Perfection (7.5+)', label: '7.5–8 PSL', pct: '1 in a few billion',
            color: '#F0ABFC', smv: 'Peak SMV',
            desc: 'Theoretical peak of human facial aesthetics. Candid photos look unreal due to perfect development and harmony.',
            traits: ['Perfect facial harmony & ratios', 'Maximal facial bone development', 'Flawless skin & symmetry', 'Genetic lottery winner across ALL systems'],
            examples: 'Jon Erik Hexum · Hernan Drago · Adriana Lima · Brooke Shields · Taylor Hill'
        };
        if (s >= 7.0) return {
            tier: 'PSL God', label: '7 PSL', pct: 'Top 0.001%',
            color: '#E879F9', smv: 'God-tier SMV',
            desc: 'Supermodel / Hollywood A-list tier. Almost everyone at this level is famous solely due to looks. Only a few thousand globally.',
            traits: ['Supermodel-grade facial structure', 'Far above average bone development', 'Universal attraction across all demographics', 'Frequently mistaken for CGI or heavily edited'],
            examples: 'David Gandy · Sean O\'Pry · Francisco Lachowski · Henry Cavill · Brad Pitt · Jordan Barrett'
        };
        if (s >= 6.5) return {
            tier: 'Gigachad / Goddess', label: '6.5 PSL', pct: 'Top 0.01%',
            color: '#C084FC', smv: 'Extreme SMV',
            desc: 'Gigachad range — the most attractive people you will ever encounter in person. Common in top modelling agencies.',
            traits: ['Chiselled jaw & prominent cheekbones', 'Elite facial harmony', 'Naturally photogenic from any angle', 'Strong halo effect in all social settings'],
            examples: 'David Laid · Zayn Malik · Johnny Depp · Jeff Seid'
        };
        if (s >= 6.0) return {
            tier: 'True Chad / Stacy', label: '6 PSL', pct: 'Top 0.1% — 1 in 1,000',
            color: '#A855F7', smv: 'Very High SMV',
            desc: 'Rare tier. High chance of fame or success from looks alone. Most common in Scandinavia, Baltic States, Northern Russia, and upper-class areas.',
            traits: ['Classically attractive facial features', 'Far above average facial development', 'Will be remembered for their looks', 'Visible halo in any room they enter'],
            examples: 'Select Hollywood actors · Top-tier athletes · Elite runway models'
        };
        if (s >= 5.5) return {
            tier: 'Chadlite / Stacylite', label: '5.5 PSL', pct: 'Top 1–5%',
            color: '#8B5CF6', smv: 'High SMV',
            desc: 'Chadlite tier — stand out as the most attractive in most crowds. Universally considered attractive. Strong look-based advantages.',
            traits: ['Above average jaw & chin definition', 'Good facial symmetry', 'Noticeable in most social settings', 'Strong look-based social advantages'],
            examples: 'Taylor Lautner · Vinnie Hacker · Neymar'
        };
        if (s >= 5.0) return {
            tier: 'High Tier Normie (HTN)', label: '5 PSL', pct: 'Top 5–20%',
            color: '#6366F1', smv: 'Above Average SMV',
            desc: 'Solid HTN range — universally attractive to most people. Will get strong look-based halo. Standard conventionally attractive genotype.',
            traits: ['No significant facial flaws', 'Good proportions across most features', 'Attractive to the majority of people', 'Naturally stands out in average settings'],
            examples: 'Standard conventionally attractive celebrities'
        };
        if (s >= 4.5) return {
            tier: 'Upper Normie / 4.5 PSL', label: '4.5 PSL', pct: 'Top 20–30%',
            color: '#3B82F6', smv: 'Slightly Above Average SMV',
            desc: 'More haloed than standard average. Seen as attractive often due to a niche feature or genetic bonus. Higher SMV than raw looks suggest.',
            traits: ['One or more distinctive attractive features', 'No major flaws pulling score down', 'Will be seen as attractive in some settings', 'Can leverage niche or situational halo'],
            examples: 'Bryce Hall · Jungkook (BTS)'
        };
        if (s >= 3.8) return {
            tier: 'Mid-Tier Normie', label: '4 PSL', pct: '~50th percentile',
            color: '#06B6D4', smv: 'Average SMV',
            desc: 'Dead average — the most common person you see on the street. No major flaws, no major halos. Men may struggle; women at this level can go viral.',
            traits: ['No standout positive or negative features', 'Average facial harmony', 'Blends into a crowd', 'Typical consumer DNA file result'],
            examples: 'Elliot Rodger (4 PSL) · Average person on the street'
        };
        if (s >= 3.2) return {
            tier: 'Low Tier Normie', label: '3 PSL', pct: 'Bottom 30–40%',
            color: '#10B981', smv: 'Below Average SMV',
            desc: 'Below average. Men in this range will struggle with look-based disadvantages. Women have unlimited options. Standard below-average facial harmony.',
            traits: ['A couple of below-average features', 'Mild asymmetry or high bodyfat tendency', 'No strong look-based advantages', 'Can be improved significantly with effort'],
            examples: 'Adam Driver · MrBeast · Andrew Tate'
        };
        if (s >= 2.5) return {
            tier: 'Truecel / 2.5 PSL', label: '2–3 PSL', pct: 'Bottom 10–20%',
            color: '#F59E0B', smv: 'Low SMV',
            desc: 'Truecel range. Will suffer significant look-based disadvantages without status compensation. Conventionally unattractive facial structure genetics.',
            traits: ['Multiple below-average features in combination', 'Poor facial harmony or ratio genetics', 'High bodyfat tendency compounding aesthetics', 'Requires significant status/personality to compensate'],
            examples: 'Jay Z · Lewis Capaldi · Aziz Ansari'
        };
        if (s >= 1.5) return {
            tier: 'Saint / 1 PSL', label: '1–2 PSL', pct: 'Bottom 0.5–10%',
            color: '#F97316', smv: 'Very Low SMV',
            desc: 'Considered unattractive by almost everyone. Very unfortunate genetic combination. 1–2 redeeming traits at most. Significant look-based struggles.',
            traits: ['Very bad facial harmony & ratios', 'Multiple unaesthetic features that stand out', 'Possible mild structural predispositions', 'Only 1–2 redeeming genetic traits'],
            examples: 'Daniel Larson · Blackops2cel (upper end)'
        };
        return {
            tier: 'Subhuman / 0 PSL', label: '0–1 PSL', pct: 'Bottom 0.01–0.5%',
            color: '#EF4444', smv: 'Minimal SMV',
            desc: 'Reserved for those with severe deformities or extreme genetic misfortune. Note: this genetic model cannot produce this score — 0 PSL requires physical deformity.',
            traits: ['Severe structural abnormalities (deformity)', 'No redeeming aesthetic genetic traits', 'Medically significant phenotype', 'Note: genetic SNPs alone cannot reach this tier'],
            examples: 'Joseph Merrick (Elephant Man — Proteus Syndrome)'
        };
    }

    const { tier, label, pct, color, smv, desc, traits, examples } = getTier(final);
    // PSL gauge: scale 1–8
    const gaugePct = Math.min(97, Math.max(3, ((final - 1) / 7) * 100));

    // Category bars
    const catBars = cats.map(c => {
        const isPos  = c.delta >= 0;
        const barPct = Math.min(100, Math.abs(c.delta) / 0.6 * 100);
        const barCol = isPos ? '#10B981' : '#EF4444';
        const sign   = isPos ? '+' : '';
        return `<div class="psl-cat-row">
            <div class="psl-cat-meta">
                <span class="psl-cat-icon">${c.icon}</span>
                <span class="psl-cat-name">${c.name}</span>
                <span class="psl-cat-count">${c.items.length} markers</span>
            </div>
            <div class="psl-cat-bar-wrap">
                <div class="psl-cat-bar" style="width:${barPct}%; background:${barCol}; ${isPos ? 'margin-left:50%' : 'margin-left:calc(50% - ' + barPct/2 + '%)'}"></div>
                <div class="psl-midline"></div>
            </div>
            <span class="psl-cat-val" style="color:${barCol}">${sign}${c.delta.toFixed(2)}</span>
        </div>`;
    }).join('');

    // Item detail rows (collapsible per cat)
    const detailHTML = cats.map(c => `
        <div class="psl-detail-group">
            <div class="psl-detail-group-hdr">${c.icon} ${c.name}</div>
            ${c.items.map(i => {
                const cls = i.dir === 'pos' ? 'psl-item-pos' : i.dir === 'neg' ? 'psl-item-neg' : 'psl-item-neu';
                const sign = i.d >= 0 ? '+' : '';
                return `<div class="psl-item-row ${cls}">
                    <span class="psl-item-icon">${i.dir==='pos'?'✅':i.dir==='neg'?'🔻':'➖'}</span>
                    <div class="psl-item-info">
                        <span class="psl-item-label">${i.label}</span>
                        <span class="psl-item-note">${i.note}</span>
                    </div>
                    <span class="psl-item-val">${sign}${i.d.toFixed(2)}</span>
                </div>`;
            }).join('')}
        </div>`).join('');

    return `<div class="psl-card fade-in">
        <!-- Header -->
        <div class="psl-header">
            <div class="psl-header-left">
                <span class="psl-header-icon">🎭</span>
                <div>
                    <div class="psl-header-title">PSL Score <span class="psl-exp-badge">Experimental</span></div>
                    <div class="psl-header-sub">Genetic Physical Aesthetics Estimate · ${totalM} markers scored across ${cats.length} systems</div>
                </div>
            </div>
            <div class="psl-tier-badge" style="--tc:${color}">${tier}</div>
        </div>

        <!-- Big Number + Meta -->
        <div class="psl-main-row">
            <div class="psl-score-display">
                <div class="psl-big-num" style="color:${color};text-shadow:0 0 50px ${color}88">${final}</div>
                <div class="psl-score-label">/ 8.0 PSL</div>
            </div>
            <div class="psl-main-meta">
                <div class="psl-tier-name" style="color:${color}">${tier}</div>
                <div class="psl-smv-badge" style="--tc:${color}">${smv} · ${pct}</div>
                <div class="psl-desc">${desc}</div>
                <div class="psl-delta">Genetic delta: <strong style="color:${color}">${totalD >= 0 ? '+' : ''}${totalD}</strong> from baseline 4.0</div>
            </div>
        </div>

        <!-- Tier Identifiers -->
        <div class="psl-identifiers">
            <div class="psl-ident-traits">
                <div class="psl-ident-title" style="color:${color}">📋 Tier Identifiers</div>
                <ul class="psl-trait-list">
                    ${traits.map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>
            <div class="psl-ident-examples">
                <div class="psl-ident-title" style="color:${color}">🏆 Reference Examples</div>
                <div class="psl-examples-text">${examples}</div>
            </div>
        </div>

        <!-- PSL Gauge 0–8 -->
        <div class="psl-gauge-wrap">
            <div class="psl-gauge-labels">
                <span>0<br><small>Subhuman</small></span>
                <span>1<br><small>Saint</small></span>
                <span>2<br><small>Truecel</small></span>
                <span>3<br><small>LTN</small></span>
                <span>4<br><small>Normie</small></span>
                <span>5<br><small>HTN</small></span>
                <span>6<br><small>Chad</small></span>
                <span>7<br><small>PSL God</small></span>
                <span>8<br><small>Perfect</small></span>
            </div>
            <div class="psl-gauge-track">
                <div class="psl-gauge-fill" style="width:${gaugePct}%; background:linear-gradient(90deg, #EF4444 0%, #F97316 20%, #F59E0B 35%, #10B981 50%, #3B82F6 65%, #8B5CF6 80%, #E879F9 100%); box-shadow:0 0 20px ${color}66"></div>
                <div class="psl-gauge-thumb" style="left:calc(${gaugePct}% - 8px); border-color:${color}; box-shadow:0 0 12px ${color}"></div>
            </div>
        </div>

        <!-- Category Contribution Bars -->
        <div class="psl-cats-title">System Contributions</div>
        <div class="psl-cats-grid">${catBars}</div>

        <!-- Detailed SNP breakdown -->
        <details class="psl-details-wrap">
            <summary class="psl-details-toggle">🔬 View all ${totalM} scored markers</summary>
            <div class="psl-details-body">${detailHTML}</div>
        </details>

        <!-- PSL Reference Guide — Full Scale -->
        <div class="psl-guide">
            <div class="psl-guide-title">Official PSL Community Rating Scale</div>
            <div class="psl-guide-grid-full">
                <div class="psl-guide-row" style="--gc:#7F1D1D">
                    <div class="psl-guide-score">0</div>
                    <div class="psl-guide-body">
                        <div class="psl-guide-tier" style="color:#EF4444">Subhuman</div>
                        <div class="psl-guide-pct">Bottom 0.01% · Reserved for severe deformities</div>
                        <div class="psl-guide-idents">Severe deformities · Burn victims · Extreme structural abnormalities · Medically significant phenotype</div>
                        <div class="psl-guide-ex">e.g. Joseph Merrick (Proteus Syndrome)</div>
                    </div>
                </div>
                <div class="psl-guide-row" style="--gc:#7C2D12">
                    <div class="psl-guide-score">1</div>
                    <div class="psl-guide-body">
                        <div class="psl-guide-tier" style="color:#F97316">Saint Tier</div>
                        <div class="psl-guide-pct">Bottom 0.5% · Unattractive to almost everyone</div>
                        <div class="psl-guide-idents">Very unfortunate looks · Mild deformities possible · Bad facial harmony/ratios · Only 1–2 redeeming traits · Unaesthetic features that stand out greatly</div>
                        <div class="psl-guide-ex">e.g. Daniel Larson · Blackops2cel · Cuffem (upper end ~1.5)</div>
                    </div>
                </div>
                <div class="psl-guide-row" style="--gc:#78350F">
                    <div class="psl-guide-score">2</div>
                    <div class="psl-guide-body">
                        <div class="psl-guide-tier" style="color:#F59E0B">Truecel Range</div>
                        <div class="psl-guide-pct">Bottom 10% · Will struggle without status</div>
                        <div class="psl-guide-idents">Conventionally unattractive · Adenoid face possible · Standard obese/elderly appearance · Very below average harmony · Will suffer look-based disadvantages in life</div>
                        <div class="psl-guide-ex">e.g. Jay Z · Lewis Capaldi · Aziz Ansari</div>
                    </div>
                </div>
                <div class="psl-guide-row" style="--gc:#14532D">
                    <div class="psl-guide-score">3</div>
                    <div class="psl-guide-body">
                        <div class="psl-guide-tier" style="color:#10B981">Low Tier Normie (LTN)</div>
                        <div class="psl-guide-pct">Bottom 30% · Below average</div>
                        <div class="psl-guide-idents">Below average facial features · Couple of below-avg traits · Mild asymmetry or high body fat · Men struggle; women have unlimited options at this level · 3.5 PSL = one less major flaw</div>
                        <div class="psl-guide-ex">e.g. Adam Driver · MrBeast · Andrew Tate</div>
                    </div>
                </div>
                <div class="psl-guide-row" style="--gc:#1E3A5F">
                    <div class="psl-guide-score">4</div>
                    <div class="psl-guide-body">
                        <div class="psl-guide-tier" style="color:#3B82F6">Mid-Tier Normie</div>
                        <div class="psl-guide-pct">~50th percentile · Dead average</div>
                        <div class="psl-guide-idents">No major flaws, no major halos · The face you see on every street · Men may struggle as incels · Women at 4 can get famous · 4.5 PSL = added niche or halo boost · 4.5 will be seen as attractive very often</div>
                        <div class="psl-guide-ex">e.g. Elliot Rodger (4) · Bryce Hall (4.5) · Jungkook (4.5)</div>
                    </div>
                </div>
                <div class="psl-guide-row" style="--gc:#2E1065">
                    <div class="psl-guide-score">5</div>
                    <div class="psl-guide-body">
                        <div class="psl-guide-tier" style="color:#8B5CF6">HTN / Chadlite (5.5)</div>
                        <div class="psl-guide-pct">Top 5% · Universally attractive</div>
                        <div class="psl-guide-idents">Solid High Tier Normie · Universally attractive to most · Strong look-based halo · Considered Chad/Stacy in real life · 5.5 = Chadlite — most attractive in crowds · Stands out in every environment · Conventionally attractive face</div>
                        <div class="psl-guide-ex">e.g. Taylor Lautner (5.5) · Neymar · Vinnie Hacker (5.5)</div>
                    </div>
                </div>
                <div class="psl-guide-row" style="--gc:#3B0764">
                    <div class="psl-guide-score">6</div>
                    <div class="psl-guide-body">
                        <div class="psl-guide-tier" style="color:#A855F7">True Chad / Stacy</div>
                        <div class="psl-guide-pct">Top 0.1% · 1 in 1,000</div>
                        <div class="psl-guide-idents">Rare — 1 in 1,000 people · High fame probability from looks alone · Common in Scandinavia, Baltic States, Northern Russia · Far above average facial development · 6.5 = Gigachad range — most attractive you'll see in person · Classic actors / elite runway models</div>
                        <div class="psl-guide-ex">e.g. David Laid · Zayn (6.5) · Johnny Depp (6.5) · Jeff Seid (6.5)</div>
                    </div>
                </div>
                <div class="psl-guide-row" style="--gc:#4A044E">
                    <div class="psl-guide-score">7</div>
                    <div class="psl-guide-body">
                        <div class="psl-guide-tier" style="color:#E879F9">PSL God</div>
                        <div class="psl-guide-pct">Top 0.001% · Only a few thousand globally</div>
                        <div class="psl-guide-idents">Supermodel / Hollywood A-list tier · Famous almost entirely due to looks · Most attractive people of all time · Globally only thousands reach this · 7.5 PSL = 1 in a few billion · Look fake in candid photos due to perfect harmony</div>
                        <div class="psl-guide-ex">e.g. David Gandy · Sean O'Pry · Francisco Lachowski · Henry Cavill · Brad Pitt · Jordan Barrett</div>
                    </div>
                </div>
                <div class="psl-guide-row" style="--gc:#500724">
                    <div class="psl-guide-score">8</div>
                    <div class="psl-guide-body">
                        <div class="psl-guide-tier" style="color:#F0ABFC">Theoretical Perfection</div>
                        <div class="psl-guide-pct">Impossible — 8.0 does not exist</div>
                        <div class="psl-guide-idents">Equivalent to 0 — perfection is not achievable · 7.5 is as close as humans get · Peak human facial aesthetics · All facial ratios at mathematical ideal · Perfect harmony across every feature</div>
                        <div class="psl-guide-ex">Closest: Jon Erik Hexum · Hernan Drago · Adriana Lima · Brooke Shields · Taylor Hill</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="disclaimer" style="margin-top:0; border-radius:var(--r); font-size:0.75rem;">
            <strong>⚠️ Disclaimer:</strong> The PSL Score is a <em>purely experimental, educational feature</em> mapping
            phenotype-associated SNPs to an aesthetic potential estimate. It does NOT measure your actual attractiveness.
            Genetics are ~20–30% of perceived attractiveness; grooming, fitness, style, confidence, and social skills
            dominate the rest. Ratings are subjective and culturally variable. This is for entertainment only.
        </div>
    </div>`;
}
