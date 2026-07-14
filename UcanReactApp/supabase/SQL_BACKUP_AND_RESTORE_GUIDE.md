# SQL Backup And Restore Guide

Use the `supabase/` folder as the local backup pack for rebuilding the UcanJobs database and storage policies.

## Backup Rule

Whenever a SQL file is added or changed:
1. Keep the updated `.sql` file in this `supabase/` folder
2. Update [APPLIED_SQL_TRACKER.md](C:/Users/AHMED/Desktop/UCan%20project%20desktop/UcanReact/UcanReactApp/supabase/APPLIED_SQL_TRACKER.md)
3. Do not delete old SQL files unless they are fully replaced by a newer file with the same purpose

## Recommended Restore Order

Run these in Supabase SQL Editor from top to bottom when recreating the project:

1. `profiles_self_access_policy.sql`
   Purpose: lets users manage their own `public.profiles` row safely.

2. `profiles_admin_role_update.sql`
   Purpose: expands the allowed `role` values so `admin` can exist in `public.profiles`.

3. `profiles_auth_sync.sql`
   Purpose: keeps `public.profiles` synced with real Supabase auth users.

4. `full_stack_services_schema.sql`
   Purpose: creates the main tutoring, institutes, courses, tutor profile, and tutoring request tables.

5. `contact_messages_schema.sql`
   Purpose: creates the base contact form table.

6. `contact_messages_role_attachments.sql`
   Purpose: adds role and attachment metadata to contact submissions.

7. `tutoring_attachments_storage.sql`
   Purpose: creates tutoring attachment storage rules.

8. `admin_contact_policy.sql`
   Purpose: lets admins read and update contact messages.

9. `admin_tutoring_requests_policy.sql`
   Purpose: lets admins read and update tutoring requests.

10. `admin_attachment_storage_access.sql`
    Purpose: lets admins download attachment files from storage.

11. `request_volume_indexes.sql`
    Purpose: adds scaling indexes for request-heavy tables.

12. `status_workflow_updates.sql`
    Purpose: normalizes workflow statuses and reinforces admin update policies for current projects.

## Notes

- Some files are base schema files, while others are upgrade files added later.
- If a brand-new Supabase project is being created, use the order above.
- If an existing project already has tables and policies, only run the missing files.
- Always check [APPLIED_SQL_TRACKER.md](C:/Users/AHMED/Desktop/UCan%20project%20desktop/UcanReact/UcanReactApp/supabase/APPLIED_SQL_TRACKER.md) before re-running anything.

## Practical Backup Tip

If you want an extra offline backup, copy the entire `supabase/` folder to:
- cloud storage
- OneDrive
- or a separate ZIP archive named like `ucan-oman-supabase-backup-YYYY-MM-DD.zip`
