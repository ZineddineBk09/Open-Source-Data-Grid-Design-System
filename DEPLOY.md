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

## npm publish (optional — not needed for GitHub Pages)

Your **live demo and Storybook do not require npm**. Skip this entire section unless you want `@zineddinebk09/grid-*` on npmjs.com.

### If the publish workflow failed with "not permitted to create pull requests"

The version bump **already succeeded** on branch `changeset-release/main`. Merge it manually:

**https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System/compare/main...changeset-release/main**

1. Click **Create pull request** → merge into `main`
2. That adds CHANGELOGs and bumps package versions

To fix automated PRs for next time, enable this **repo setting**:

1. **Settings → Actions → General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

Then run **Actions → Publish Packages → Run workflow** manually.

### Alternative: use a Personal Access Token

If the checkbox is unavailable (some orgs block it):

1. GitHub → **Settings → Developer settings → Fine-grained tokens**
2. Create token for this repo with **Contents: Read and write** + **Pull requests: Read and write**
3. Add repo secret: **Settings → Secrets → Actions → New secret**
   - Name: `CHANGESET_GITHUB_TOKEN`
   - Value: your PAT
4. Run **Publish Packages** workflow manually

### Publish to npm (when ready)

1. `npm login` locally
2. Add secret `NPM_TOKEN` in repo **Settings → Secrets → Actions**
3. Merge the version PR (or run `pnpm version-packages` locally and push)
4. **Actions → Publish Packages → Run workflow** — publishes `@zineddinebk09/grid-*`

The publish workflow is **manual only** (`workflow_dispatch`) so it won't fail CI on every push.
