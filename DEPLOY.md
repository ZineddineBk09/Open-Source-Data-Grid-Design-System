# Deploy & publish guide

## Push to GitHub (first time)

```bash
cd Open-Source-Data-Grid-Design-System

# Verify build passes locally
pnpm install
pnpm build
pnpm test

# Initialize git (skip if already done)
git init
git branch -M main

# Stage everything (screenshots live in apps/demo/public/screenshots/)
git add .

# First commit
git commit -m "feat: open-source data grid design system with React/Vue adapters"

# Create repo on GitHub: github.com/new → name: Open-Source-Data-Grid-Design-System
# Then connect and push:
git remote add origin https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System.git
git push -u origin main
```

## Enable GitHub Pages

1. Open **Settings → Pages**
2. Under **Build and deployment**, set Source to **GitHub Actions**
3. After the first push to `main`, the **Deploy Demo** workflow runs automatically
4. Your site will be at:
   - Demo: `https://zineddinebk09.github.io/Open-Source-Data-Grid-Design-System/`
   - Storybook: `https://zineddinebk09.github.io/Open-Source-Data-Grid-Design-System/storybook/`

If Pages shows 404, check **Actions** tab for a green **Deploy Demo** run.

## Pin the repo on your GitHub profile

1. Go to your profile → **Customize your pins**
2. Pin **Open-Source-Data-Grid-Design-System**
3. The README screenshots render automatically on the repo card

## Share links for recruiters

| Link | URL |
|------|-----|
| Live demo | https://zineddinebk09.github.io/Open-Source-Data-Grid-Design-System/ |
| Storybook | https://zineddinebk09.github.io/Open-Source-Data-Grid-Design-System/storybook/ |
| Source | https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System |

## Screenshots location

Static assets for the demo and README must live in:

```
apps/demo/public/screenshots/
├── grid-light.png
├── grid-dark.png
├── column-filters.png
├── virtual-scroll.png
├── pinned-column.png
└── expandable-hierarchy.png
```

Vite copies `public/` into the build output — do **not** use `apps/demo/screenshots/` (outside `public/`).

## Optional: publish to npm later

1. Create npm account and login: `npm login`
2. Add `NPM_TOKEN` secret to GitHub repo settings
3. Run `pnpm changeset` → merge version PR → CI publishes `@zineddinebk09/grid-*`
