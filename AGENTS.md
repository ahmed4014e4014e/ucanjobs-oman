# Agent instructions (UcanJobs)

## ALWAYS auto-commit and push to GitHub (mandatory)

**Never leave finished code changes only on the local machine.**

After any code edit in this repo (even small CSS/padding tweaks):

1. **Stage** the relevant files (`git add …`).
2. **Commit** with a clear message (never commit secrets / `.env`).
3. **Push immediately** to the current tracking branch on GitHub — do not wait for the user to ask.

Default for this project:

| Item | Value |
|------|--------|
| Remote | `origin` → `https://github.com/ahmed4014e4014e/ucanjobs-oman.git` |
| Branch | usually `preview` (use whatever branch is checked out) |
| Why | Vercel **preview** deploys from GitHub and must update instantly |

### Rules

- Push is the default. Treat “remember to push” as already standing instructions.
- If already on `preview`, run: `git push origin preview` (or `git push -u origin HEAD` if needed).
- Only skip push if the user **explicitly** says not to, or push fails (then report the error and the commit hash).
- After push, briefly confirm the commit hash and branch.

## Related

- Mobile top-right nav inset is tuned in `UcanReactApp/src/index.css` (`.app-shell-mobile-actions`, `left: calc(100vw - …)`).
