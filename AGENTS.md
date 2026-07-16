# Agent instructions (UcanJobs)

## Always ship to GitHub + Vercel preview

After any code change in this repo:

1. **Commit** the changes with a clear message (no secrets / `.env`).
2. **Push** immediately to the active remote branch (usually `origin/preview`).
3. Do **not** wait for the user to ask — push so the **Vercel preview** link updates right away.

Default remote for previews: `origin` → `https://github.com/ahmed4014e4014e/ucanjobs-oman.git`  
Preview branch: `preview`

Only skip push if the user explicitly says not to, or if credentials/network fail (then report the error).
