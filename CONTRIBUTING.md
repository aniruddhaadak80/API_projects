# Contributing

Thanks for helping out! This repo is meant to stay small and readable, so beginners can learn from it.

## Quick start

```bash
git clone https://github.com/aniruddhaadak80/API_projects.git
cd API_projects
npx serve .        # or python3 -m http.server 8080
npm test           # Node 20+
```

## Adding a new small app

1. Pick a free API that needs **no key**, serves **HTTPS**, and sends **CORS** headers.
2. Add `yourApp.html` (or a section in `index.html`) and `yourApp.js`.
3. Follow the pattern in the README: `try` / `fetch` / check `res.ok` / `textContent` / friendly fallback.
4. Link it from the nav in `index.html` and back to home from your page.
5. If it has pure logic, export it and add a test in `test/`.
6. Add a row to the table in `README.md`.

## Rules of thumb

- Never put API data into `innerHTML`; use `textContent` or build elements.
- No API keys or secrets in the repo, ever.
- Poll politely: no faster than every 2 seconds, and pause when `document.hidden`.
- Keep images small (under ~300 KB).
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).

## Pull requests

- Branch from `main`, keep PRs focused, and fill in the PR template.
- CI (tests + link check) and CodeQL must pass.
