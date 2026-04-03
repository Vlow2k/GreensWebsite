# GreensWebsite

Greens Global Website from Scratch - ReactJS, Tailwind, Vite, FramerMotion

## Deploy via GitHub Actions (GitHub Pages)

This repo is configured to deploy to GitHub Pages using:

- `.github/workflows/deploy.yml`
- Vite base path in `vite.config.js`: `/GreensWebsite/`

### Trigger deployment

1. Push to `main` (auto deploy), or
2. Open GitHub -> Actions -> `Deploy to GitHub Pages` -> `Run workflow`

### First-time GitHub setup

1. GitHub repo -> Settings -> Pages
2. Source: `GitHub Actions`

After the workflow completes, the site will be available at:

`https://vlow2k.github.io/GreensWebsite/`
