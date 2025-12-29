# PR Labels Assigner

Tiny GitHub Action that auto-labels every PR by target branch so reviewers instantly know what needs their eyes first (production hot-fixes jump the queue).

Impact: 1-file Action that saved our team several min/day of triage.

Feel free to steal, star or PR improvements.

## 30-Second Demo

- PR opened against production → label 🔥 hot-fix
- PR opened against staging → label 🪲 bug-fix
- PR opened against main → label 🚀 feature

No more scrolling through 30 PR titles to find the one that’s blocking users.

## How to use

### Option A – GitHub Actions (zero-code)

Fork / copy this repo
Add the workflow to .github/workflows/
Push – labels are applied on every new PR & on manual trigger

### Option B – Run locally (useful for bulk re-label)

```bash
npm install
```

Edit .env file

```
npm run assign_labels
```

## Config

Edit branches & labels in:

- `.github/workflows/pr-labeler.yml` (CI)
- `assign_labels.js` (local run)

## API Token Scope

repo (read PRs + write labels)
