

```md
# Ucan

Ucan is a React-based e-learning platform being transformed for the Omani market. The platform is designed to offer career-focused technology courses for fresh graduates and job seekers, especially in areas such as software engineering, artificial intelligence, cyber security, data analytics, and job readiness.

The project is built with React, Vite, Tailwind CSS, React Router, Supabase, and Vercel.

## Project Purpose

Ucan aims to help improve employment readiness for graduates in Oman by providing practical, market-aligned courses. The long-term direction is to use job-market data, open government data, and AI-assisted recommendations to guide learners toward skills that are relevant to real employment demand.

## Current Status

The project is currently in transformation from a peer-tutoring platform into a commercial e-learning platform.

Completed so far:

- Rebranded the platform to Ucan
- Added English and Arabic language support
- Added a public course catalog page
- Added course detail pages
- Added initial course marketplace database schema
- Added starter course seed SQL
- Updated public navigation toward courses
- Kept older tutoring logic temporarily for safety during migration

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Supabase
- Vercel

## Local Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Vite will provide a local URL, usually:

```text
http://localhost:5173/
```

Use this local link while developing. It updates automatically when files are saved.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Linting

Run ESLint:

```bash
npm run lint
```

## Environment Variables

Create a `.env.local` file in the project root and add the required database/auth environment variables.

Example:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Do not commit real secret values to GitHub.

## Database Notes

Database SQL files are stored in the `supabase/` folder.

Important files include:

- `ucan_course_marketplace_schema.sql`
- `phase3_seed_steps/`
- `APPLIED_SQL_TRACKER.md`

When applying SQL manually, run each file or step carefully in the Supabase SQL editor and update `APPLIED_SQL_TRACKER.md` after successful execution.

## Deployment

The project is intended to deploy on Vercel.

Recommended workflow:

1. Develop locally with `npm run dev`
2. Commit changes in Git
3. Push to GitHub
4. Let Vercel create an automatic preview deployment
5. Use the stable branch preview URL for repeated testing
6. Deploy or merge to production only when stable

## QA Rule

After every major auth, dashboard, mobile layout, or database-connected feature change, test the affected pages on a mobile-sized viewport.

Minimum mobile QA checklist:

- Page loads without getting stuck
- Buttons and forms are usable
- Text does not overflow
- Cards and modals fit the screen
- Auth state remains correct after refresh
- No important action button is hidden or clipped

## Project Direction

Upcoming phases may include:

- Connecting the course catalog directly to database tables
- Learner enrollment flow
- Course progress tracking
- Admin course management
- Instructor/course creator tools
- Payment integration
- AI-powered course recommendations
- SEO improvements for course discovery
- Cleaner removal or archival of old tutoring-specific code

## License

Private project. All rights reserved.
```
