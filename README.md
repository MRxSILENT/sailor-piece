# ⚓ Sailor Piece Hub

> The ultimate tier list platform and AI build generator for the Roblox game **Sailor Piece** — production-ready, statically hosted, and auto-updating.

![Season 4](https://img.shields.io/badge/Season-4-gold)
![Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF)
![React](https://img.shields.io/badge/React-18-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🏆 Tier List | S+ → D ranked Fruits, Swords, Traits & Specs with collapsible rows |
| 🧠 AI Builder | Rule-based build optimizer for Farming / Boss / PvP playstyles |
| ❤️ Favorites | Save items to localStorage, manage from a dedicated page |
| 🔍 Search | Real-time filter across all items and tiers |
| 🔄 Auto-Update | GitHub Actions scraper runs every 30 minutes |
| 🎨 Dark Gaming UI | Pirata One font, gold/cyan accents, Framer Motion animations |
| 📱 Responsive | Works on desktop, tablet, and mobile |

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/your-username/sailor-piece-hub.git
cd sailor-piece-hub

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📁 Project Structure

```
sailor-piece-hub/
├── .github/
│   └── workflows/
│       └── scrape.yml          # Auto-update every 30 minutes
├── public/
│   └── data.json               # All tier data (auto-updated by scraper)
├── scripts/
│   └── scraper.js              # Node.js scraper (axios + cheerio)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation with active state animation
│   │   ├── TierRow.jsx         # Collapsible tier row with item grid
│   │   ├── ItemCard.jsx        # Item card with favorite toggle
│   │   └── SearchBar.jsx       # Animated search input
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with hero + feature cards
│   │   ├── TierList.jsx        # Full tier list with tabs + filters
│   │   ├── AIBuilder.jsx       # Build generator UI
│   │   └── Favorites.jsx       # Saved items management
│   ├── utils/
│   │   ├── buildGenerator.js   # AI build logic (rule-based, no API)
│   │   └── favorites.js        # localStorage favorites hook
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Global dark theme + design system
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## 🔄 Auto-Update System

The scraper runs automatically via GitHub Actions every 30 minutes:

```
scrape.yml  →  node scripts/scraper.js  →  public/data.json  →  git commit  →  Vercel redeploy
```

### Run manually:
```bash
npm run scrape
```

### GitHub Secrets needed (optional):
| Secret | Purpose |
|---|---|
| `VERCEL_DEPLOY_HOOK` | Trigger instant redeploy after data update |

---

## 🧠 AI Build Generator

`generateBuild(data, type)` returns a full build object:

```js
{
  type: 'pvp',
  fruit:  { name: 'Light',   tier: 'S+', emoji: '✨', tags: ['pvp','speed'] },
  sword:  { name: 'Enma',    tier: 'S+', emoji: '🗡️', tags: ['pvp','boss'] },
  trait:  { name: "Conqueror's Haki", tier: 'S+', ... },
  spec:   { name: 'Six Powers', tier: 'S+', ... },
  synergy:       { name: 'Emperor Combo', description: '...' },
  overallRating: 'S+',
  tip:           'Observation Haki + Six Powers makes you nearly undodgeable.'
}
```

**Scoring logic:**
- Base score from tier weight (S+ = 100, S = 80 ... D = 5)
- +15 per matched gameplay tag (pvp / farming / boss)
- +30 if item name matches priority list for that build type
- Synergy bonus if ≥2 items match a known synergy combo

---

## 🌐 Deployment

### Vercel (recommended — zero config)

```bash
npm install -g vercel
vercel deploy
```

`vercel.json` handles SPA routing automatically.

### GitHub Pages

```bash
npm run build
# Deploy the dist/ folder to gh-pages branch
npx gh-pages -d dist
```

Add to `vite.config.js`:
```js
base: '/your-repo-name/'  // for GitHub Pages
```

---

## 🔧 Extending the Project

### Add a new category (e.g. Ships)
1. Add `"ships": { "S+": [...], ... }` to `public/data.json`
2. Add `{ key: 'ships', label: '🚢 Ships' }` to `CATEGORIES` in `TierList.jsx`
3. Add `ships` to `CAT_ICONS` in `Favorites.jsx`

### Add a new build type (e.g. Ranked)
1. Add an entry to `BUILD_RULES` in `utils/buildGenerator.js`
2. Add `{ id: 'ranked', label: 'Ranked', icon: '🏅', desc: '...' }` in `AIBuilder.jsx`

### Update tier data manually
Edit `public/data.json` directly — format is self-explanatory.

---

## 📦 Tech Stack

- **React 18** + **Vite 5** — lightning-fast dev + builds
- **React Router 6** — client-side SPA routing
- **Framer Motion 11** — page transitions + card animations
- **axios + cheerio** — headless scraping (Node.js only)
- **localStorage** — zero-backend favorites persistence
- **GitHub Actions** — scheduled auto-update pipeline
- **Vercel** — static hosting + instant deploys

---

## 📜 License

MIT — fork it, mod it, sail the seas with it. 🏴‍☠️
