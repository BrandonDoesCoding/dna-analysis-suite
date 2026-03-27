# 🧬 DNA Analysis Suite

> Phenotype predictions, haplogroup detection, and genetic health insights — 100% in your browser. Your DNA never leaves your device.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **Phenotype Report** | Predict physical traits (eye color, hair, skin tone, and more) from your SNPs |
| 🌍 **Haplogroup Detection** | Identify your maternal & paternal lineage haplogroups |
| 💊 **Genetic Health Analysis** | Screen 200+ SNPs linked to health traits and carrier status |
| 🔒 **100% Private** | Fully client-side — no uploads, no servers, no tracking |
| 📦 **Multi-Provider Support** | Works with `.zip`, `.txt`, `.csv`, `.raw`, `.tsv`, `.gz` files |

---

## 🧪 Supported DNA Providers

- 23andMe
- AncestryDNA
- MyHeritage
- FamilyTreeDNA
- LivingDNA
- And more — any raw SNP file in standard format

---

## 🚀 Getting Started

No installation required. Just open the file in your browser.

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/dna-analysis-suite.git

# Open in browser
open Website/index.html
```

Or simply **[download the latest release](#)** and double-click `index.html`.

---

## 🖥️ How It Works

```
1. Upload your raw DNA file  →  drag & drop or click to browse
2. File is parsed locally    →  zero network requests made
3. SNPs are analyzed         →  matched against built-in variant database
4. Reports are generated     →  Phenotype, Haplogroup, Health tabs
```

All processing happens inside your browser using vanilla JavaScript. No frameworks, no dependencies, no data ever sent anywhere.

---

## 📁 Project Structure

```
Website/
├── index.html      # Main UI — upload, phenotype, health panels
├── styles.css      # Full design system & responsive layout
├── app.js          # File handling, parsing, tab navigation
├── run.js          # SNP analysis engine & report generation
├── js/             # Additional modules
└── debug.html      # Developer debug view
```

---

## 🔒 Privacy

This app was built with privacy as the **#1 priority**.

- ✅ No account required
- ✅ No data sent to any server
- ✅ No cookies, no analytics, no tracking
- ✅ Works fully offline after loading
- ✅ Open source — audit the code yourself

Your genetic data is yours. It stays on your machine.

---

## 🛠️ Built With

- **HTML5** — semantic structure
- **CSS3** — custom design system, responsive layout
- **Vanilla JavaScript** — zero dependencies, fast & lightweight
- **Google Fonts** — Inter typeface

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<p align="center">Made with ❤️ for privacy-conscious DNA explorers</p>
