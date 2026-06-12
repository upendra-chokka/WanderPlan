# WanderPlan 🗺️
**Your personal family travel planner — installable on any phone, free to deploy.**

---

## Deploy to Vercel (Free) — Step by Step

### 1. Prerequisites (one-time setup)
- Install [Node.js](https://nodejs.org) (v18 or higher)
- Create a free account at [github.com](https://github.com) and [vercel.com](https://vercel.com)
- Install Git: [git-scm.com](https://git-scm.com)

---

### 2. Set up the project locally
```bash
# In your terminal / command prompt:
cd wanderplan
npm install
npm run dev
```
Open `http://localhost:5173` to see the app running locally.

---

### 3. Push to GitHub
```bash
git init
git add .
git commit -m "Initial WanderPlan commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/wanderplan.git
git push -u origin main
```

---

### 4. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo `wanderplan`
3. Framework: **Vite** (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy** — done in ~60 seconds ✅

Your app will be live at:
`https://wanderplan-YOUR_NAME.vercel.app`

---

## Install on Phone (PWA)

### Android (Chrome)
1. Open the Vercel URL in Chrome
2. Tap the **⋮ menu** → **"Add to Home Screen"**
3. Tap **Add** — icon appears on home screen like a native app

### iPhone (Safari)
1. Open the Vercel URL in **Safari** (must be Safari)
2. Tap the **Share button** (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add** — done!

---

## Custom Domain (Optional, Free)
- In Vercel dashboard → **Settings → Domains**
- Add your domain e.g. `wanderplan.yourdomain.com`
- Vercel gives you free SSL automatically

---

## Project Structure
```
wanderplan/
├── public/
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── icon-192.png       ← Android PWA icon
│   ├── icon-512.png       ← Android PWA icon (large)
│   └── apple-touch-icon.png  ← iPhone home screen icon
├── src/
│   ├── App.jsx            ← Main app (all trip logic + UI)
│   ├── main.jsx           ← React entry point
│   └── index.css          ← Global styles + safe area insets
├── index.html
├── vite.config.js         ← Vite + PWA plugin config
├── vercel.json            ← Vercel routing config
└── package.json
```

---

## Make it Yours
- Edit trip data in `src/App.jsx` → `SEED_TRIP` object
- Change app name: update `vite.config.js` → `manifest.name`
- Change colours: search `#0D1B2A` and `#52B788` in App.jsx

---

*Built with React + Vite + vite-plugin-pwa*
