# Security Policy

## Reporting a vulnerability

Please **don't open a public issue** for security problems. Report them privately through
[GitHub Security Advisories](https://github.com/aniruddhaadak80/API_projects/security/advisories/new).

Include what you found, where (file and line, or page URL), and how to reproduce it. You'll get a reply within 7 days.

## Scope

- The static pages on the GitHub Pages site and their scripts
- `hammock/`, `git-ofrenda/` and `kodama/`

Third-party APIs these pages call are out of scope; report issues with them to their owners.

## What's already in place

- CodeQL code scanning on every push and pull request
- Dependabot for GitHub Actions and npm dependencies
- Least-privilege `GITHUB_TOKEN` permissions in workflows
- API responses are rendered with `textContent`, not `innerHTML`
