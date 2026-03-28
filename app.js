// =============================================
// DNA ANALYSIS SUITE — Main App Controller
// =============================================

const $ = id => document.getElementById(id);
const uploadArea    = $('uploadArea');
const fileInput     = $('fileInput');
const fileLoaded    = $('fileLoaded');
const removeFileBtn = $('removeFile');
const providerDetect= $('providerDetect');
const parseProgress = $('parseProgress');
const parseLabel    = $('parseLabel');
const parseBarFill  = $('parseBarFill');
const parsePct      = $('parsePct');

let parsedSNPs = {}, detectedProviderName = '', totalSNPCount = 0;

// === Navigation ===
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); switchTab(link.dataset.tab); });
});

function switchTab(tab) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-tab="${tab}"]`)?.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
    const panel = $('panel' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (panel) panel.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === File Upload ===
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', e => {
    e.preventDefault(); uploadArea.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });
removeFileBtn.addEventListener('click', resetUpload);

function resetUpload() {
    parsedSNPs = {};
    fileInput.value = '';
    fileLoaded.style.display = 'none';
    uploadArea.style.display = 'block';
    providerDetect.style.display = 'none';
    parseProgress.style.display = 'none';
    const navPhen = $('navPhenotype');
    const navHlth = $('navHealth');
    if (navPhen) navPhen.style.display = 'none';
    if (navHlth) navHlth.style.display = 'none';
}

function formatSize(b) {
    if (b < 1024)     return b + ' B';
    if (b < 1048576)  return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
}

function showProvider(p) {
    const icons = { MyHeritage: 'MH', '23andMe': '23', AncestryDNA: 'A', FTDNA: 'FT', LivingDNA: 'L' };
    $('providerIcon').textContent = icons[p] || '?';
    $('providerLabel').textContent = p;
    providerDetect.style.display = 'flex';
}

// === Main File Handler ===
async function handleFile(file) {
    if (file.size > 200 * 1024 * 1024) { alert('File too large (max 200MB)'); return; }

    uploadArea.style.display = 'none';
    fileLoaded.style.display = 'flex';
    $('loadedFileName').textContent = file.name;
    $('loadedFileMeta').textContent = formatSize(file.size);

    parseProgress.style.display = 'block';
    parseLabel.textContent = 'Reading file…';
    parseBarFill.style.width = '5%';

    // Read the raw bytes — fast, non-blocking
    const buffer = await file.arrayBuffer();

    // Hand off ALL heavy work to a Web Worker so the UI stays live
    const result = await runWorker(buffer, file.name);
    if (!result) return; // worker posted an error

    parsedSNPs          = result.snps;
    totalSNPCount       = result.total;
    detectedProviderName= result.provider;

    showProvider(detectedProviderName);

    const matchedCount = Object.keys(parsedSNPs).length;
    $('snpCount').textContent = `${totalSNPCount.toLocaleString()} SNPs · ${matchedCount} trait markers matched`;

    parseLabel.textContent  = 'Building reports…';
    parseBarFill.style.width = '88%';

    // Yield one frame so the label repaints before DOM work
    await new Promise(r => requestAnimationFrame(r));

    buildPhenotypeReport(parsedSNPs, detectedProviderName, totalSNPCount);

    const healthContainer = $('healthSections');
    if (healthContainer) {
        buildHealthReport(parsedSNPs);
        const extraHTML = buildPSLScore(parsedSNPs)
            + buildPharmacoHTML(parsedSNPs)
            + buildCarrierReport(parsedSNPs)
            + buildDiseaseRiskReport(parsedSNPs);
        healthContainer.insertAdjacentHTML('beforeend', extraHTML);
    }

    parseBarFill.style.width = '100%';
    parseLabel.textContent = `Done — ${totalSNPCount.toLocaleString()} SNPs scanned, ${matchedCount} markers found`;

    const navPhen = $('navPhenotype');
    const navHlth = $('navHealth');
    if (navPhen) navPhen.style.display = '';
    if (navHlth) navHlth.style.display = '';

    requestAnimationFrame(() => {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    });

    setTimeout(() => switchTab('phenotype'), 500);
}

// === Web Worker bridge ===
function runWorker(buffer, filename) {
    return new Promise(resolve => {
        // Safety check: ensure SNP_DB is loaded
        if (typeof SNP_DB === 'undefined') {
            console.error('FATAL: SNP_DB not defined. Script loading failed.');
            parseLabel.textContent = 'Error: SNP database failed to load. Try refreshing the page.';
            parseBarFill.style.width = '0%';
            resolve(null);
            return;
        }

        const worker = new Worker('/js/parser-worker.js');

        // Pass the ArrayBuffer as a transferable — zero-copy, instant
        worker.postMessage(
            { buffer, filename, targetRsids: Object.keys(SNP_DB) },
            [buffer]
        );

        worker.onmessage = ({ data }) => {
            switch (data.type) {
                case 'progress':
                    parseLabel.textContent   = data.label;
                    parseBarFill.style.width = data.pct + '%';
                    if (parsePct) parsePct.textContent = Math.round(data.pct) + '%';
                    break;

                case 'provider':
                    showProvider(data.provider);
                    break;

                case 'done':
                    worker.terminate();
                    resolve({ snps: data.snps, total: data.total, provider: data.provider });
                    break;

                case 'error':
                    parseLabel.textContent   = 'Error: ' + data.message;
                    parseBarFill.style.width = '0%';
                    console.error('[Worker]', data.message);
                    worker.terminate();
                    resolve(null);
                    break;
            }
        };

        worker.onerror = err => {
            parseLabel.textContent = 'Worker error: ' + err.message;
            console.error('[Worker crash]', err);
            worker.terminate();
            resolve(null);
        };
    });
}
