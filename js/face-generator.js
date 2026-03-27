// =============================================
// ENHANCED CANVAS AVATAR GENERATOR
// Full body with proper proportions
// =============================================

function generateFaceAvatar(traits) {
    const W = 280, H = 440;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // === Color lookup ===
    const skinTones = {
        'Light':  { base: '#F5D6C3', mid: '#ECC5AD', shadow: '#D6A98A', blush: 'rgba(210,130,130,0.15)' },
        'Medium': { base: '#D4A574', mid: '#C29363', shadow: '#A87B50', blush: 'rgba(180,100,80,0.12)' },
        'Dark':   { base: '#8D5524', mid: '#7A471C', shadow: '#5E3512', blush: 'rgba(120,60,40,0.10)' },
    };
    const eyeColors = {
        'Blue': '#5B9BD5', 'Green/Hazel': '#7CB342', 'Green': '#6B9E2A',
        'Hazel': '#9D7E5C', 'Brown': '#5C3317',
    };
    const hairColors = {
        'Blond / Light': '#DBBD6E', 'Blond': '#DBBD6E',
        'Red / Auburn': '#B5451B', 'Strawberry Blond': '#D49B52',
        'Light Brown': '#917154', 'Dark / Brown': '#5A3A22', 'Black': '#1C1C1E',
    };

    const skin  = skinTones[traits.skin] || skinTones['Light'];
    const eye   = eyeColors[traits.eyes] || '#5C3317';
    const hair  = hairColors[traits.hair] || '#5A3A22';
    const cx = W / 2;  // 140

    // === Background ===
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#16162e');
    bg.addColorStop(1, '#0d0d1a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ────────────────── BODY ──────────────────

    // Legs
    ctx.fillStyle = '#1a1a2e';
    roundRect(ctx, cx - 28, 310, 22, 110, 6);
    ctx.fill();
    roundRect(ctx, cx + 6, 310, 22, 110, 6);
    ctx.fill();

    // Shoes
    ctx.fillStyle = '#2c2c44';
    roundRect(ctx, cx - 32, 405, 30, 18, 5);
    ctx.fill();
    roundRect(ctx, cx + 2, 405, 30, 18, 5);
    ctx.fill();

    // Torso
    const shirtCol = '#2D4A8A';
    ctx.fillStyle = shirtCol;
    ctx.beginPath();
    ctx.moveTo(cx - 48, 230);
    ctx.quadraticCurveTo(cx - 52, 280, cx - 36, 320);
    ctx.lineTo(cx + 36, 320);
    ctx.quadraticCurveTo(cx + 52, 280, cx + 48, 230);
    ctx.closePath();
    ctx.fill();

    // Shirt shading
    const shirtShade = ctx.createLinearGradient(cx - 50, 230, cx + 50, 230);
    shirtShade.addColorStop(0, 'rgba(0,0,0,0.18)');
    shirtShade.addColorStop(0.4, 'rgba(0,0,0,0)');
    shirtShade.addColorStop(0.6, 'rgba(0,0,0,0)');
    shirtShade.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = shirtShade;
    ctx.beginPath();
    ctx.moveTo(cx - 48, 230);
    ctx.quadraticCurveTo(cx - 52, 280, cx - 36, 320);
    ctx.lineTo(cx + 36, 320);
    ctx.quadraticCurveTo(cx + 52, 280, cx + 48, 230);
    ctx.closePath();
    ctx.fill();

    // Collar detail
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 22, 230);
    ctx.quadraticCurveTo(cx, 242, cx + 22, 230);
    ctx.stroke();

    // Arms
    ctx.fillStyle = shirtCol;
    // Left arm
    ctx.beginPath();
    ctx.moveTo(cx - 48, 235);
    ctx.quadraticCurveTo(cx - 68, 260, cx - 62, 310);
    ctx.lineTo(cx - 46, 310);
    ctx.quadraticCurveTo(cx - 50, 265, cx - 40, 245);
    ctx.closePath();
    ctx.fill();
    // Right arm
    ctx.beginPath();
    ctx.moveTo(cx + 48, 235);
    ctx.quadraticCurveTo(cx + 68, 260, cx + 62, 310);
    ctx.lineTo(cx + 46, 310);
    ctx.quadraticCurveTo(cx + 50, 265, cx + 40, 245);
    ctx.closePath();
    ctx.fill();

    // Hands
    ctx.fillStyle = skin.base;
    ctx.beginPath(); ctx.ellipse(cx - 54, 312, 9, 11, 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 54, 312, 9, 11, -0.1, 0, Math.PI * 2); ctx.fill();

    // ────────────────── NECK ──────────────────
    ctx.fillStyle = skin.mid;
    ctx.fillRect(cx - 16, 202, 32, 32);
    // Neck shadow
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(cx - 16, 224, 32, 10);

    // ────────────────── HAIR (back layer) ──────────────────
    const headCY = 130;
    ctx.fillStyle = hair;

    if (traits.texture === 'Wavy/Curly' || traits.texture === 'Curly') {
        ctx.beginPath(); ctx.ellipse(cx, headCY - 10, 82, 90, 0, 0, Math.PI * 2); ctx.fill();
        for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(a) * 74, headCY - 10 + Math.sin(a) * 82, 16, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (traits.texture === 'Slightly Wavy' || traits.texture === 'Wavy') {
        ctx.beginPath(); ctx.ellipse(cx, headCY - 8, 76, 82, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx - 62, headCY + 20, 20, 45, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 62, headCY + 20, 20, 45, -0.2, 0, Math.PI * 2); ctx.fill();
    } else {
        ctx.beginPath(); ctx.ellipse(cx, headCY - 6, 72, 76, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(cx - 68, headCY + 5, 16, 55);
        ctx.fillRect(cx + 52, headCY + 5, 16, 55);
    }

    // ────────────────── HEAD ──────────────────
    // Face shape
    const headGrad = ctx.createRadialGradient(cx - 10, headCY - 15, 15, cx, headCY, 85);
    headGrad.addColorStop(0, skin.base);
    headGrad.addColorStop(0.85, skin.mid);
    headGrad.addColorStop(1, skin.shadow);
    ctx.fillStyle = headGrad;
    ctx.beginPath(); ctx.ellipse(cx, headCY, 62, 74, 0, 0, Math.PI * 2); ctx.fill();

    // Subtle highlight
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath(); ctx.ellipse(cx - 12, headCY - 25, 35, 40, -0.2, 0, Math.PI * 2); ctx.fill();

    // Cheek blush
    ctx.fillStyle = skin.blush;
    ctx.beginPath(); ctx.ellipse(cx - 38, headCY + 10, 18, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 38, headCY + 10, 18, 12, 0, 0, Math.PI * 2); ctx.fill();

    // ────────────────── EARS ──────────────────
    ctx.fillStyle = skin.mid;
    ctx.beginPath(); ctx.ellipse(cx - 62, headCY - 2, 10, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 62, headCY - 2, 10, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx - 62, headCY - 2, 6, -0.8, 0.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 62, headCY - 2, 6, Math.PI - 0.8, Math.PI + 0.8); ctx.stroke();

    // ────────────────── HAIR (front layer / bangs) ──────────────────
    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.moveTo(cx - 58, headCY - 30);
    ctx.quadraticCurveTo(cx - 35, headCY - 68, cx, headCY - 60);
    ctx.quadraticCurveTo(cx + 35, headCY - 68, cx + 58, headCY - 30);
    ctx.lineTo(cx + 58, headCY - 55);
    ctx.quadraticCurveTo(cx, headCY - 80, cx - 58, headCY - 55);
    ctx.closePath();
    ctx.fill();

    // Hair shine
    const hairShine = ctx.createRadialGradient(cx - 20, headCY - 60, 5, cx - 20, headCY - 60, 45);
    hairShine.addColorStop(0, 'rgba(255,255,255,0.18)');
    hairShine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hairShine;
    ctx.beginPath(); ctx.ellipse(cx - 20, headCY - 55, 40, 30, -0.2, 0, Math.PI * 2); ctx.fill();

    // ────────────────── FRECKLES (only if genetically predicted) ──────────────────
    if (traits.freckles === 'Likely') {
        ctx.fillStyle = 'rgba(139, 85, 36, 0.22)';
        const freckleSpots = [
            [cx - 30, headCY + 2], [cx - 22, headCY + 7], [cx - 15, headCY],
            [cx + 15, headCY], [cx + 22, headCY + 7], [cx + 30, headCY + 2],
            [cx - 18, headCY + 14], [cx + 18, headCY + 14],
        ];
        freckleSpots.forEach(([fx, fy]) => {
            ctx.beginPath(); ctx.arc(fx, fy, 1.8, 0, Math.PI * 2); ctx.fill();
        });
    }

    // ────────────────── EYES ──────────────────
    const eyeY = headCY - 12;
    const eyeSpacing = 24;

    [-1, 1].forEach(side => {
        const ex = cx + side * eyeSpacing;

        // Sclera
        const scl = ctx.createRadialGradient(ex, eyeY, 2, ex, eyeY, 16);
        scl.addColorStop(0, '#FEFEFE');
        scl.addColorStop(1, '#F0EDED');
        ctx.fillStyle = scl;
        ctx.beginPath(); ctx.ellipse(ex, eyeY, 16, 12, 0, 0, Math.PI * 2); ctx.fill();

        // Outline
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.ellipse(ex, eyeY, 16, 12, 0, 0, Math.PI * 2); ctx.stroke();

        // Iris
        const iGrad = ctx.createRadialGradient(ex, eyeY + 1, 1, ex, eyeY + 1, 9);
        iGrad.addColorStop(0, lightenColor(eye, 30));
        iGrad.addColorStop(0.55, eye);
        iGrad.addColorStop(1, darkenColor(eye, 50));
        ctx.fillStyle = iGrad;
        ctx.beginPath(); ctx.arc(ex, eyeY + 1, 8, 0, Math.PI * 2); ctx.fill();

        // Iris ring
        ctx.strokeStyle = darkenColor(eye, 70);
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.arc(ex, eyeY + 1, 8, 0, Math.PI * 2); ctx.stroke();

        // Pupil
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath(); ctx.arc(ex, eyeY + 1, 4, 0, Math.PI * 2); ctx.fill();

        // Catchlight
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath(); ctx.arc(ex + side * 3, eyeY - 2, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath(); ctx.arc(ex - side * 2, eyeY + 3, 1.2, 0, Math.PI * 2); ctx.fill();

        // Upper eyelid shadow
        ctx.strokeStyle = 'rgba(0,0,0,0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(ex, eyeY - 1, 17, 13, 0, Math.PI + 0.3, Math.PI * 2 - 0.3);
        ctx.stroke();

        // Eyelashes (top)
        ctx.strokeStyle = hair === '#1C1C1E' ? '#111' : darkenColor(hair, 40);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(ex, eyeY, 17, 12, 0, Math.PI + 0.15, Math.PI * 2 - 0.15);
        ctx.stroke();
    });

    // ────────────────── EYEBROWS ──────────────────
    const browCol = (traits.hair === 'Blond / Light' || traits.hair === 'Blond')
        ? darkenColor(hair, 20) : hair;
    ctx.strokeStyle = browCol;
    ctx.lineWidth = traits.unibrow ? 4 : 3;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(cx - 42, headCY - 28);
    ctx.quadraticCurveTo(cx - 24, headCY - 36, cx - 10, headCY - 27);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 10, headCY - 27);
    ctx.quadraticCurveTo(cx + 24, headCY - 36, cx + 42, headCY - 28);
    ctx.stroke();

    if (traits.unibrow) {
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx - 10, headCY - 27);
        ctx.quadraticCurveTo(cx, headCY - 30, cx + 10, headCY - 27);
        ctx.stroke();
    }

    // ────────────────── NOSE ──────────────────
    const noseY = headCY + 8;
    ctx.strokeStyle = 'rgba(0,0,0,0.13)';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';

    if (traits.nose === 'narrow') {
        ctx.beginPath();
        ctx.moveTo(cx, headCY - 4);
        ctx.quadraticCurveTo(cx - 2, noseY, cx - 5, noseY + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, headCY - 4);
        ctx.quadraticCurveTo(cx + 2, noseY, cx + 5, noseY + 8);
        ctx.stroke();
        ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.arc(cx - 5, noseY + 8, 2.5, 0.2, Math.PI - 0.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 5, noseY + 8, 2.5, 0.2, Math.PI - 0.2); ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(cx, headCY - 4);
        ctx.quadraticCurveTo(cx - 4, noseY + 2, cx - 10, noseY + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, headCY - 4);
        ctx.quadraticCurveTo(cx + 4, noseY + 2, cx + 10, noseY + 8);
        ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx - 7, noseY + 8, 3.5, 0.2, Math.PI - 0.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 7, noseY + 8, 3.5, 0.2, Math.PI - 0.2); ctx.stroke();
    }

    // ────────────────── MOUTH ──────────────────
    const mouthY = headCY + 28;
    const lipW = traits.lips === 'full' ? 20 : 16;
    const lipH = traits.lips === 'full' ? 4.5 : 3;

    // Lower lip
    ctx.fillStyle = 'rgba(190, 90, 80, 0.5)';
    ctx.beginPath();
    ctx.moveTo(cx - lipW, mouthY);
    ctx.quadraticCurveTo(cx, mouthY + lipH * 2.5, cx + lipW, mouthY);
    ctx.fill();

    // Upper lip (cupid's bow)
    ctx.fillStyle = 'rgba(185, 85, 75, 0.55)';
    ctx.beginPath();
    ctx.moveTo(cx - lipW, mouthY);
    ctx.quadraticCurveTo(cx - lipW * 0.4, mouthY - lipH * 1.5, cx, mouthY - lipH * 0.5);
    ctx.quadraticCurveTo(cx + lipW * 0.4, mouthY - lipH * 1.5, cx + lipW, mouthY);
    ctx.fill();

    // Lip line
    ctx.strokeStyle = 'rgba(140, 60, 50, 0.35)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - lipW + 2, mouthY);
    ctx.lineTo(cx + lipW - 2, mouthY);
    ctx.stroke();

    // ────────────────── DIMPLES ──────────────────
    if (traits.dimples) {
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(cx - 26, mouthY - 2, 4, 0.3, 2.3); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 26, mouthY - 2, 4, 0.8, 2.8); ctx.stroke();
    }

    // ────────────────── CHIN CLEFT ──────────────────
    if (traits.cleftChin) {
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx, headCY + 52);
        ctx.lineTo(cx, headCY + 60);
        ctx.stroke();
    }

    // ────────────────── GLASSES ──────────────────
    if (traits.glasses) {
        ctx.strokeStyle = 'rgba(80, 100, 160, 0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(cx - eyeSpacing, eyeY, 20, 16, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx + eyeSpacing, eyeY, 20, 16, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - 4, eyeY); ctx.lineTo(cx + 4, eyeY); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - eyeSpacing - 20, eyeY - 4);
        ctx.quadraticCurveTo(cx - 56, eyeY, cx - 62, headCY - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + eyeSpacing + 20, eyeY - 4);
        ctx.quadraticCurveTo(cx + 56, eyeY, cx + 62, headCY - 2);
        ctx.stroke();
    }

    return canvas.toDataURL('image/png');
}

// ── Utility helpers ──────────────────────────────────────

function roundRect(ctx, x, y, w, h, r) {
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

function lightenColor(hex, pct) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + pct);
    const g = Math.min(255, ((num >> 8) & 0xFF) + pct);
    const b = Math.min(255, (num & 0xFF) + pct);
    return `rgb(${r},${g},${b})`;
}

function darkenColor(hex, pct) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - pct);
    const g = Math.max(0, ((num >> 8) & 0xFF) - pct);
    const b = Math.max(0, (num & 0xFF) - pct);
    return `rgb(${r},${g},${b})`;
}
