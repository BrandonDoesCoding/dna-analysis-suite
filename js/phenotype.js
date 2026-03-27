// =============================================
// PHENOTYPE — Genetic Character Builder
// =============================================

function buildPhenotypeReport(parsedSNPs, detectedProviderName, totalSNPCount) {
    const traits = computeCharacterTraits(parsedSNPs);

    const container = document.getElementById('phenotypeCharacter');
    if (container) {
        container.innerHTML = buildCharacterHTML(traits, detectedProviderName, totalSNPCount);
        const canvas = document.getElementById('charCanvas');
        if (canvas) drawCharacterCanvas(canvas, traits);
    }

    renderTraitSections(parsedSNPs);
}

// ── Trait computation ─────────────────────────────────────────────

function computeCharacterTraits(parsedSNPs) {
    // Eye color
    const eye = parsedSNPs['rs12913832'];
    const eyeColor = eye === 'GG' ? 'Blue' : (eye === 'AG' || eye === 'GA') ? 'Green/Hazel' : eye ? 'Brown' : 'Brown';

    // Hair color
    const hasCT_rs1805007 = parsedSNPs['rs1805007'] === 'TT' || parsedSNPs['rs1805007'] === 'CT';
    const hasCT_rs1110400 = parsedSNPs['rs1110400'] === 'TT' || parsedSNPs['rs1110400'] === 'CC';
    const redCount = [hasCT_rs1805007, hasCT_rs1110400].filter(Boolean).length;
    const blond = parsedSNPs['rs12821256'] === 'TT' || parsedSNPs['rs12821256'] === 'CC';
    const light = parsedSNPs['rs16891982'] === 'GG' || parsedSNPs['rs16891982'] === 'CC';
    let hairColor = 'Dark / Brown';
    if (redCount >= 2) hairColor = 'Red / Auburn';
    else if (redCount === 1 && blond) hairColor = 'Strawberry Blond';
    else if (blond) hairColor = 'Blond / Light';
    else if (light) hairColor = 'Light Brown';

    // Hair texture
    let curlScore = 0;
    if (parsedSNPs['rs17646946'] === 'GG') curlScore++;
    if (parsedSNPs['rs2218065'] === 'GG') curlScore++;
    if (parsedSNPs['rs11803731'] === 'AA') curlScore += 2;
    const hairTexture = curlScore >= 2 ? 'Wavy / Curly' : curlScore === 1 ? 'Slightly Wavy' : 'Straight';

    // Skin tone
    const sk = parsedSNPs['rs1426654'];
    const skinTone = (sk === 'AA' || sk === 'GG') ? 'Light' : sk ? 'Medium' : 'Light';

    // Height tendency
    let hScore = 0, hN = 0;
    ['rs143384','rs7759938','rs1042725','rs6060369','rs6440003','rs3791679'].forEach(rs => {
        const g = parsedSNPs[rs];
        if (!g || !SNP_DB[rs]) return;
        const r = SNP_DB[rs].interpret(g);
        hN++;
        if (r.pred.includes('Taller') || r.pred.includes('Later')) hScore++;
        else if (r.pred.includes('Shorter') || r.pred.includes('Earlier')) hScore--;
    });
    const heightTend = hN === 0 ? 'Average tendency'
        : hScore > 0.2 * hN ? 'Taller tendency'
        : hScore < -0.2 * hN ? 'Shorter tendency'
        : 'Average tendency';

    // Muscle type (ACTN3)
    const m = parsedSNPs['rs1815739'];
    const muscle = m === 'CC' ? 'Sprint / Power' : m === 'TT' ? 'Endurance' : m ? 'Mixed' : 'Mixed';

    // Freckles — requires MC1R compound heterozygosity + IRF4 evidence
    // MC1R "R" (strong red/freckle) variants: rs1805007, rs1805008, rs1805009, rs1805006, rs11547464
    const mc1rStrong = ['rs1805007','rs1805008','rs1805009','rs1805006','rs11547464'];
    const mc1rHom = mc1rStrong.filter(rs => {
        const g = parsedSNPs[rs];
        return g && g !== '--' && g.toUpperCase() !== 'CC' && g.toUpperCase() !== 'GG' && g.toUpperCase() !== 'AA' ? false
            : g && (g.toUpperCase() === 'TT' || g.toUpperCase() === 'AA') && SNP_DB[rs]?.interpret(g)?.emoji?.includes('🔴');
    }).length;
    const mc1rHet = mc1rStrong.filter(rs => {
        const g = parsedSNPs[rs];
        return g && g !== '--' && g.length === 2 && g[0] !== g[1]; // heterozygous
    }).length;
    const irf4_TT = parsedSNPs['rs12203592']?.toUpperCase() === 'TT';
    const irf4_het = parsedSNPs['rs12203592']?.length === 2 &&
        parsedSNPs['rs12203592']?.[0] !== parsedSNPs['rs12203592']?.[1];
    // Freckles "Likely" only if: MC1R homozygous for strong variant, OR 2+ MC1R het variants, OR 1 MC1R het + IRF4 TT
    const freckles = mc1rHom >= 1 || mc1rHet >= 2 || (mc1rHet >= 1 && irf4_TT);

    // Baldness risk
    const b = parsedSNPs['rs1160312'];
    const baldness = b === 'AA' ? 'Higher risk'
        : (b === 'AG' || b === 'GA') ? 'Moderate risk'
        : b ? 'Lower risk'
        : 'Unknown';

    // Face features
    const unibrow    = parsedSNPs['rs7544382'] === 'CC';
    const nose       = parsedSNPs['rs1478567'] === 'CC' ? 'narrow' : 'broad';
    const lips       = parsedSNPs['rs3746444'] === 'GG' ? 'full' : 'thin';
    const dimples    = parsedSNPs['rs2289252'] === 'TT';
    const cleftChin  = parsedSNPs['rs17580'] === 'AA';
    const myopia     = parsedSNPs['rs10034228'] === 'CC';

    // Androgen receptor (beard/androgenicity)
    const ar = parsedSNPs['rs6152'];
    const androgen = ar === 'AA' ? 'High sensitivity' : ar ? 'Normal sensitivity' : 'Unknown';

    // Caffeine metabolism (CYP1A2)
    const caf = parsedSNPs['rs762551'];
    const caffeine = caf === 'AA' ? 'Fast metabolizer' : caf ? 'Slow metabolizer' : 'Unknown';

    // Lactose tolerance
    const lac = parsedSNPs['rs4988235'];
    const lactose = (lac === 'AA' || lac === 'TT') ? 'Tolerant' : lac ? 'Intolerant' : 'Unknown';

    // Body composition (PPARG)
    const pparg = parsedSNPs['rs1801282'];
    const bodyComp = pparg === 'CC' ? 'Higher fat storage' : pparg ? 'Normal metabolism' : 'Unknown';

    return {
        eyeColor, hairColor, hairTexture, skinTone,
        heightTend, muscle, freckles, baldness,
        unibrow, nose, lips, dimples, cleftChin, myopia,
        androgen, caffeine, lactose, bodyComp,
    };
}

// ── Panel HTML builder ────────────────────────────────────────────

function buildCharacterHTML(traits, provider, totalSNPs) {
    const attrs = [
        { icon: '👁️',  label: 'Eye Color',    value: traits.eyeColor,   dot: eyeDot(traits.eyeColor) },
        { icon: '💇',  label: 'Hair Color',   value: traits.hairColor,  dot: hairDot(traits.hairColor) },
        { icon: '🌀',  label: 'Hair Texture', value: traits.hairTexture, dot: null },
        { icon: '🎨',  label: 'Skin Tone',    value: traits.skinTone,   dot: skinDot(traits.skinTone) },
        { icon: '✨',  label: 'Freckles',     value: traits.freckles ? 'Likely' : 'Unlikely', dot: null },
        { icon: '📏',  label: 'Height',       value: traits.heightTend, dot: null },
        { icon: '💪',  label: 'Muscle Type',  value: traits.muscle,     dot: null },
        { icon: '🏋️', label: 'Body Comp',    value: traits.bodyComp,   dot: null },
        { icon: '🦲',  label: 'Baldness',     value: traits.baldness,   dot: null },
        { icon: '🕶️', label: 'Myopia Risk',  value: traits.myopia ? 'Higher risk' : 'Lower risk', dot: null },
        { icon: '⚡',  label: 'Caffeine',     value: traits.caffeine,   dot: null },
        { icon: '🥛',  label: 'Lactose',      value: traits.lactose,    dot: null },
        { icon: '🧬',  label: 'Androgen',     value: traits.androgen,   dot: null },
    ];

    const attrHTML = attrs.map(a => `
        <div class="char-attr">
            <span class="char-attr-icon">${a.icon}</span>
            <span class="char-attr-label">${a.label}</span>
            <span class="char-attr-value">${a.value}</span>
            ${a.dot ? `<span class="char-attr-dot" style="background:${a.dot}"></span>` : ''}
        </div>`).join('');

    return `<div class="char-panel">
        <div class="char-figure-wrap">
            <canvas id="charCanvas" width="200" height="200" class="char-canvas"></canvas>
            <div class="char-badge">
                <div class="char-badge-provider">${provider}</div>
                <div class="char-badge-count">${totalSNPs.toLocaleString()} SNPs scanned</div>
            </div>
        </div>
        <div class="char-attrs-col">
            <div class="char-attrs-heading">Your Genetic Character</div>
            <div class="char-attrs">${attrHTML}</div>
        </div>
    </div>`;
}

function eyeDot(e)  { return e === 'Blue' ? '#4A90D9' : e === 'Green/Hazel' ? '#6B8E23' : '#5C3317'; }
function hairDot(h) { return {'Red / Auburn':'#C0392B','Strawberry Blond':'#D4A14A','Blond / Light':'#E8D44D','Light Brown':'#9B7653','Dark / Brown':'#5D4037','Black':'#1A1A1A'}[h] || '#5D4037'; }
function skinDot(s) { return s === 'Light' ? '#FDDCB5' : s === 'Medium' ? '#D4A574' : '#8D5524'; }

// ── Face-only portrait canvas ─────────────────────────────────────

function drawCharacterCanvas(canvas, traits) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2 + 6;

    const SKIN = { Light: '#FDDCB5', Medium: '#D4A574', Dark: '#8D5524' };
    const EYES = { Blue: '#4A90D9', 'Green/Hazel': '#6B8E23', Brown: '#5C3317' };
    const HAIR = { 'Red / Auburn': '#C0392B', 'Strawberry Blond': '#D4A14A', 'Blond / Light': '#E8D44D', 'Light Brown': '#9B7653', 'Dark / Brown': '#5D4037', 'Black': '#1A1A1A' };

    const skinC = SKIN[traits.skinTone] || '#FDDCB5';
    const eyeC  = EYES[traits.eyeColor] || '#5C3317';
    const hairC = HAIR[traits.hairColor] || '#5D4037';
    const browC = traits.hairColor.includes('Blond') ? '#C4A84D' : hairC;

    // Head proportions — larger for portrait
    const hRX = 56, hRY = 68;

    // ── Background ────────────────────────────────────────────────
    const bg = ctx.createRadialGradient(cx, cy - 20, 30, cx, cy, W);
    bg.addColorStop(0, '#1A1A36');
    bg.addColorStop(1, '#08080F');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Subtle glow behind head
    ctx.fillStyle = 'rgba(108,58,237,0.06)';
    ctx.beginPath(); ctx.ellipse(cx, cy, hRX + 30, hRY + 30, 0, 0, Math.PI * 2); ctx.fill();

    // ── Neck ─────────────────────────────────────────────────────
    ctx.fillStyle = shiftColor(skinC, -6);
    ctx.beginPath();
    ctx.moveTo(cx - 18, cy + hRY - 10);
    ctx.lineTo(cx - 24, H);
    ctx.lineTo(cx + 24, H);
    ctx.lineTo(cx + 18, cy + hRY - 10);
    ctx.closePath(); ctx.fill();

    // Shirt collar hint at bottom
    ctx.fillStyle = '#2D3A75';
    ctx.beginPath();
    ctx.moveTo(cx - 50, H);
    ctx.lineTo(cx - 20, cy + hRY + 14);
    ctx.lineTo(cx, cy + hRY + 22);
    ctx.lineTo(cx + 20, cy + hRY + 14);
    ctx.lineTo(cx + 50, H);
    ctx.lineTo(cx + 70, H);
    ctx.quadraticCurveTo(cx + 40, cy + hRY + 4, cx + 26, cy + hRY + 4);
    ctx.lineTo(cx - 26, cy + hRY + 4);
    ctx.quadraticCurveTo(cx - 40, cy + hRY + 4, cx - 70, H);
    ctx.closePath(); ctx.fill();

    // ── Hair back layer ───────────────────────────────────────────
    ctx.fillStyle = hairC;
    if (traits.baldness === 'Higher risk') {
        ctx.strokeStyle = hairC; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(cx, cy, hRX + 2, Math.PI * 0.7, Math.PI * 2.3); ctx.stroke();
    } else if (traits.hairTexture === 'Wavy / Curly') {
        ctx.beginPath(); ctx.ellipse(cx, cy - 18, hRX + 22, hRY + 18, 0, 0, Math.PI * 2); ctx.fill();
        for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 3;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(a) * (hRX + 10), cy - 18 + Math.sin(a) * (hRY + 6), 16, 0, Math.PI * 2);
            ctx.fill();
        }
    } else {
        ctx.beginPath(); ctx.ellipse(cx, cy - 16, hRX + 12, hRY + 8, 0, 0, Math.PI * 2); ctx.fill();
        // Side hair
        ctx.beginPath(); ctx.ellipse(cx - hRX - 4, cy + 12, 11, 36, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + hRX + 4, cy + 12, 11, 36, -0.1, 0, Math.PI * 2); ctx.fill();
    }

    // ── Head ─────────────────────────────────────────────────────
    const headG = ctx.createRadialGradient(cx - 12, cy - 16, 6, cx, cy, hRX + 16);
    headG.addColorStop(0, shiftColor(skinC, 20));
    headG.addColorStop(0.7, skinC);
    headG.addColorStop(1, shiftColor(skinC, -12));
    ctx.fillStyle = headG;
    ctx.beginPath(); ctx.ellipse(cx, cy, hRX, hRY, 0, 0, Math.PI * 2); ctx.fill();

    // Subtle jaw shadow
    ctx.fillStyle = shiftColor(skinC, -10) + '33';
    ctx.beginPath(); ctx.ellipse(cx, cy + hRY - 14, hRX - 4, 18, 0, 0, Math.PI); ctx.fill();

    // ── Ears ─────────────────────────────────────────────────────
    ctx.fillStyle = skinC;
    ctx.beginPath(); ctx.ellipse(cx - hRX + 2, cy + 6, 10, 16, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + hRX - 2, cy + 6, 10, 16, 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.07)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx - hRX + 2, cy + 6, 6, -0.6, 0.6); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + hRX - 2, cy + 6, 6, Math.PI - 0.6, Math.PI + 0.6); ctx.stroke();

    // ── Forehead / top hair ───────────────────────────────────────
    if (traits.baldness !== 'Higher risk') {
        ctx.fillStyle = hairC;
        ctx.beginPath();
        ctx.moveTo(cx - hRX - 2, cy - 20);
        ctx.quadraticCurveTo(cx - hRX + 8, cy - hRY - 10, cx, cy - hRY - 6);
        ctx.quadraticCurveTo(cx + hRX - 8, cy - hRY - 10, cx + hRX + 2, cy - 20);
        ctx.lineTo(cx + hRX + 2, cy - hRY + 14);
        ctx.quadraticCurveTo(cx, cy - hRY - 20, cx - hRX - 2, cy - hRY + 14);
        ctx.closePath(); ctx.fill();
        // Hairline highlight
        ctx.strokeStyle = shiftColor(hairC, 12); ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - hRX + 14, cy - hRY + 10);
        ctx.quadraticCurveTo(cx, cy - hRY - 4, cx + hRX - 14, cy - hRY + 10);
        ctx.stroke();
    } else {
        ctx.fillStyle = hairC; ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(cx - hRX + 14, cy - 24);
        ctx.quadraticCurveTo(cx, cy - hRY + 4, cx + hRX - 14, cy - 24);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    // ── Freckles ─────────────────────────────────────────────────
    if (traits.freckles) {
        ctx.fillStyle = 'rgba(160,100,50,0.3)';
        const freckleSpots = [
            [cx-20,cy+10],[cx-12,cy+16],[cx-6,cy+8],[cx+6,cy+8],
            [cx+12,cy+16],[cx+20,cy+10],[cx-16,cy+5],[cx+16,cy+5],
            [cx-8,cy+12],[cx+8,cy+12],[cx-24,cy+6],[cx+24,cy+6],
        ];
        freckleSpots.forEach(([fx,fy]) => {
            ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI * 2); ctx.fill();
        });
    }

    // ── Eyes ─────────────────────────────────────────────────────
    const eY = cy - 8, eOff = 20;
    // Sclera
    ctx.fillStyle = '#F5F5F5';
    ctx.beginPath(); ctx.ellipse(cx - eOff, eY, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + eOff, eY, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
    // Iris with gradient
    const irisG = ctx.createRadialGradient(cx - eOff, eY, 1, cx - eOff, eY, 8);
    irisG.addColorStop(0, shiftColor(eyeC, 30));
    irisG.addColorStop(0.5, eyeC);
    irisG.addColorStop(1, shiftColor(eyeC, -20));
    ctx.fillStyle = irisG;
    ctx.beginPath(); ctx.arc(cx - eOff, eY, 7, 0, Math.PI * 2); ctx.fill();
    const irisG2 = ctx.createRadialGradient(cx + eOff, eY, 1, cx + eOff, eY, 8);
    irisG2.addColorStop(0, shiftColor(eyeC, 30));
    irisG2.addColorStop(0.5, eyeC);
    irisG2.addColorStop(1, shiftColor(eyeC, -20));
    ctx.fillStyle = irisG2;
    ctx.beginPath(); ctx.arc(cx + eOff, eY, 7, 0, Math.PI * 2); ctx.fill();
    // Iris detail ring
    ctx.strokeStyle = shiftColor(eyeC, -25); ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(cx - eOff, eY, 6.5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + eOff, eY, 6.5, 0, Math.PI * 2); ctx.stroke();
    // Pupils
    ctx.fillStyle = '#0A0A0A';
    ctx.beginPath(); ctx.arc(cx - eOff, eY, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + eOff, eY, 3.5, 0, Math.PI * 2); ctx.fill();
    // Specular highlights
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.arc(cx - eOff + 2.5, eY - 2.5, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + eOff + 2.5, eY - 2.5, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(cx - eOff - 1.5, eY + 2, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + eOff - 1.5, eY + 2, 1.2, 0, Math.PI * 2); ctx.fill();
    // Upper eyelid line
    ctx.strokeStyle = shiftColor(skinC, -35); ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.ellipse(cx - eOff, eY - 1, 15, 10, 0, Math.PI + 0.3, -0.3); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx + eOff, eY - 1, 15, 10, 0, Math.PI + 0.3, -0.3); ctx.stroke();

    // ── Eyebrows ─────────────────────────────────────────────────
    ctx.strokeStyle = browC;
    ctx.lineWidth = traits.unibrow ? 3.5 : 2.8;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx - eOff - 14, eY - 15); ctx.quadraticCurveTo(cx - eOff, eY - 22, cx - eOff + 14, eY - 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + eOff - 14, eY - 14); ctx.quadraticCurveTo(cx + eOff, eY - 22, cx + eOff + 14, eY - 15); ctx.stroke();
    if (traits.unibrow) {
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx - eOff + 14, eY - 14); ctx.quadraticCurveTo(cx, eY - 17, cx + eOff - 14, eY - 14); ctx.stroke();
    }

    // ── Nose ─────────────────────────────────────────────────────
    const nY = cy + 8;
    ctx.strokeStyle = shiftColor(skinC, -22); ctx.lineWidth = 1.4; ctx.lineCap = 'round';
    if (traits.nose === 'narrow') {
        ctx.beginPath(); ctx.moveTo(cx, nY - 6); ctx.lineTo(cx - 4, nY + 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, nY - 6); ctx.lineTo(cx + 4, nY + 10); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx - 5, nY + 10, 2.5, 0.2, Math.PI - 0.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 5, nY + 10, 2.5, 0.2, Math.PI - 0.2); ctx.stroke();
    } else {
        ctx.beginPath(); ctx.moveTo(cx - 1, nY - 4); ctx.quadraticCurveTo(cx - 7, nY + 4, cx - 10, nY + 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 1, nY - 4); ctx.quadraticCurveTo(cx + 7, nY + 4, cx + 10, nY + 10); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx - 7, nY + 10, 3.5, 0.2, Math.PI - 0.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 7, nY + 10, 3.5, 0.2, Math.PI - 0.2); ctx.stroke();
    }
    // Nose highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, nY - 4); ctx.lineTo(cx, nY + 4); ctx.stroke();

    // ── Mouth ────────────────────────────────────────────────────
    const mY = cy + 28;
    const lipW = traits.lips === 'full' ? 15 : 12;
    const lipH = traits.lips === 'full' ? 9 : 6;
    // Upper lip
    ctx.fillStyle = shiftColor(skinC, -22);
    ctx.beginPath();
    ctx.moveTo(cx - lipW, mY);
    ctx.quadraticCurveTo(cx - lipW * 0.4, mY - 3, cx, mY - 2);
    ctx.quadraticCurveTo(cx + lipW * 0.4, mY - 3, cx + lipW, mY);
    ctx.quadraticCurveTo(cx, mY + lipH * 0.4, cx - lipW, mY);
    ctx.closePath(); ctx.fill();
    // Lower lip
    ctx.fillStyle = shiftColor(skinC, -18);
    ctx.beginPath();
    ctx.moveTo(cx - lipW + 1, mY + 1);
    ctx.quadraticCurveTo(cx, mY + lipH, cx + lipW - 1, mY + 1);
    ctx.quadraticCurveTo(cx, mY + 2, cx - lipW + 1, mY + 1);
    ctx.closePath(); ctx.fill();
    // Lip line
    ctx.strokeStyle = shiftColor(skinC, -32); ctx.lineWidth = 1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx - lipW, mY); ctx.lineTo(cx + lipW, mY); ctx.stroke();
    // Cupid's bow
    ctx.strokeStyle = 'rgba(160,60,40,0.3)'; ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - lipW * 0.55, mY - 1);
    ctx.quadraticCurveTo(cx - 3, mY - 3.5, cx, mY - 2);
    ctx.quadraticCurveTo(cx + 3, mY - 3.5, cx + lipW * 0.55, mY - 1);
    ctx.stroke();
    // Lip highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 4, mY + lipH * 0.45);
    ctx.quadraticCurveTo(cx, mY + lipH * 0.55, cx + 4, mY + lipH * 0.45);
    ctx.stroke();

    if (traits.dimples) {
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(cx - 22, mY, 3, 0.3, 2.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 22, mY, 3, 0.9, 2.8); ctx.stroke();
    }

    if (traits.cleftChin) {
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(cx, cy + hRY - 16); ctx.lineTo(cx, cy + hRY - 8); ctx.stroke();
    }

    // ── Glasses ──────────────────────────────────────────────────
    if (traits.myopia) {
        ctx.strokeStyle = 'rgba(80,100,180,0.5)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(cx - eOff, eY, 20, 14, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx + eOff, eY, 20, 14, 0, 0, Math.PI * 2); ctx.stroke();
        // Bridge
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx - eOff + 20, eY - 2); ctx.quadraticCurveTo(cx, eY - 6, cx + eOff - 20, eY - 2); ctx.stroke();
        // Temples
        ctx.beginPath(); ctx.moveTo(cx - eOff - 20, eY - 4); ctx.lineTo(cx - hRX + 4, eY - 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + eOff + 20, eY - 4); ctx.lineTo(cx + hRX - 4, eY - 2); ctx.stroke();
        // Lens reflection
        ctx.strokeStyle = 'rgba(180,200,255,0.08)'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(cx - eOff - 6, eY - 4, 10, -1.2, -0.3); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + eOff - 6, eY - 4, 10, -1.2, -0.3); ctx.stroke();
    }

    // ── Vignette ─────────────────────────────────────────────────
    const vig = ctx.createRadialGradient(cx, cy, 50, cx, cy, W * 0.85);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
}

// ── Canvas helpers ────────────────────────────────────────────────

function cRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function shiftColor(hex, amt) {
    // Works on 6-char hex strings like '#FDDCB5'
    const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amt));
    const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amt));
    const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amt));
    return `rgb(${r},${g},${b})`;
}

// ── Trait sections ────────────────────────────────────────────────

function renderTraitSections(parsedSNPs) {
    const container = document.getElementById('traitSections');
    if (!container) return;
    container.innerHTML = '';

    const order = ['eye', 'hair', 'skin', 'face', 'height', 'athletic', 'sleep', 'longevity', 'immune', 'vision'];
    let html = '';

    order.forEach(cat => {
        const ci = CATEGORIES[cat];
        if (!ci) return;
        const snpsInCat = Object.entries(SNP_DB).filter(([, v]) => v.category === cat);
        if (!snpsInCat.length) return;

        html += `<div class="trait-section fade-in">
            <div class="trait-section-header">
                <span class="trait-section-icon">${ci.icon}</span>
                <span class="trait-section-title">${ci.title}</span>
            </div>
            ${ci.note ? `<div class="trait-section-note">${ci.note}</div>` : ''}
            <div class="section-body"><div class="snp-grid">`;

        snpsInCat.forEach(([rsid, info]) => {
            const g = parsedSNPs[rsid];
            if (!g) {
                html += `<div class="snp-card not-genotyped">
                    <div class="snp-emoji">❓</div>
                    <div class="snp-info">
                        <div class="snp-trait-name">${info.trait}</div>
                        <div class="snp-prediction">Not genotyped</div>
                        <div class="snp-rsid">${rsid} (${info.gene})</div>
                    </div>
                    <div class="snp-right"><span class="confidence-badge conf-low">N/A</span></div>
                </div>`;
                return;
            }
            const r = info.interpret(g);
            const cc = r.conf >= 65 ? 'conf-high' : r.conf >= 40 ? 'conf-mid' : 'conf-low';
            html += `<div class="snp-card">
                <div class="snp-emoji">${r.emoji}</div>
                <div class="snp-info">
                    <div class="snp-trait-name">${info.trait}</div>
                    <div class="snp-prediction">${r.pred}</div>
                    <div class="snp-detail">${r.detail}</div>
                    <div class="snp-rsid">${rsid} · ${info.gene} · <strong>${g}</strong></div>
                </div>
                <div class="snp-right">
                    <span class="confidence-badge ${cc}">Conf ${r.conf}%</span>
                    <span class="snp-genotype">${g}</span>
                </div>
            </div>`;
        });

        html += '</div></div></div>';
    });

    container.innerHTML = html;
    requestAnimationFrame(() => document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')));
}
