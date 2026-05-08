# Applied SQL Tracker

Use this file to keep track of which Supabase SQL files have already been applied in the SQL Editor.

Status guide:
- `Confirmed applied` = successfully run in Supabase
- `Pending / not confirmed` = not yet confirmed as applied
- `Failed / retry needed` = attempted, but did not complete successfully

| SQL file | Status | Notes |
|---|---|---|
| `admin_attachment_storage_access.sql` | Pending / not confirmed | Needed for admin attachment downloads from storage buckets. |
| `admin_contact_policy.sql` | Confirmed applied | Previously confirmed as successfully run. |
| `admin_tutoring_requests_policy.sql` | Pending / not confirmed | Confirm after successful run in Supabase. |
| `contact_messages_role_attachments.sql` | Pending / not confirmed | Needed for contact role + attachment metadata support. |
| `contact_messages_schema.sql` | Pending / not confirmed | Base contact form table and insert policy. |
| `full_stack_services_schema.sql` | Pending / not confirmed | Base tutoring/services schema and seed setup. |
| `profiles_admin_role_update.sql` | Pending / not confirmed | Enables `admin` in `public.profiles.role`. |
| `profiles_auth_sync.sql` | Failed / retry needed | Attempted, but Supabase returned `Failed to fetch (api.supabase.com)`. Retry after refresh/login. |
| `profiles_self_access_policy.sql` | Pending / not confirmed | Allows users to manage their own profile row. |
| `request_volume_indexes.sql` | confirmed applied | Adds scaling indexes for request-heavy tables on `created_at`, `status`, and `tutor_id`. |
| `status_workflow_updates.sql` | confirmed applied  | Normalizes contact statuses and adds admin update policies for request workflows. |
| `tutoring_attachments_storage.sql` | confirmed applied | Needed for tutoring request attachments and tutor-side attachment downloads. |

## Update rule

After you successfully run a SQL file in Supabase:
1. Change its status to `Confirmed applied`
2. Optionally add the date in the notes column

Example:
- `Confirmed applied - 2026-05-08`
