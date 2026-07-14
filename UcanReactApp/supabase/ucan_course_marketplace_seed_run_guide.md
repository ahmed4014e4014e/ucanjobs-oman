# UcanJobs Course Marketplace Seed Run Guide

You already ran `STEP 01` through `STEP 21` successfully.

For the remaining seed data, run only `STEP 22` through `STEP 27` from
`ucan_course_marketplace_schema.sql`.

Important copy rule:

- It is safe to copy lines that start with `-- STEP`, because they are SQL comments.
- Do not copy a step title if it appears without the `--` prefix.
- The error `relation "clear" does not exist` means the database received plain English text such as `Clear old seeded outcomes...` as SQL.

Run the remaining steps like this:

1. Copy from `-- STEP 22: Seed the initial course categories.` down to the semicolon before `-- STEP 23`.
2. Run it.
3. Copy from `-- STEP 23: Seed the initial published courses.` down to the semicolon before `-- STEP 24`.
4. Run it.
5. Copy from `-- STEP 24: Clear old seeded outcomes before re-inserting them.` down to the semicolon before `-- STEP 25`.
6. Run it.
7. Copy from `-- STEP 25: Seed course outcomes.` down to the semicolon before `-- STEP 26`.
8. Run it.
9. Copy from `-- STEP 26: Clear old seeded modules before re-inserting them.` down to the semicolon before `-- STEP 27`.
10. Run it.
11. Copy from `-- STEP 27: Seed course modules.` to the end of the file.
12. Run it.

After all six seed steps succeed, run this verification query:

```sql
select 'categories' as table_name, count(*) from public.course_categories
union all
select 'courses', count(*) from public.learning_courses
union all
select 'outcomes', count(*) from public.course_outcomes
union all
select 'modules', count(*) from public.course_modules;
```

Expected result:

- `categories`: 5
- `courses`: 6
- `outcomes`: 18
- `modules`: 24
