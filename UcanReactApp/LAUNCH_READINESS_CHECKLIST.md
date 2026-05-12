# Ucan Oman Launch Readiness Checklist

This checklist is designed to help decide whether Ucan Oman is ready for:

- a small pilot launch
- a broader public launch
- a nationwide rollout across academic institutions in Oman

---

## Current Recommendation

Current status:
- `Ready for a controlled pilot`: Yes
- `Ready for full nationwide public rollout`: Not yet

Reason:
- The platform has a strong full-stack foundation and a usable interface.
- However, repeated auth/session instability and a few operational gaps still make a large public launch too risky right now.

---

## Pilot Ready

These items should be complete before inviting a limited group of real students and tutors from 1 to 2 institutions.

- [done] Public website pages are live and accessible
- [done] Student sign up and login are working
- [done] Tutor login and tutor application flow are working
- [done] Admin dashboard is available
- [done] Contact form submits to Supabase
- [done] Tutoring requests submit to Supabase
- [done] File attachments work in contact and tutoring flows
- [done] Admin can review contact messages
- [done] Admin can review tutoring requests
- [done] Tutor can review assigned tutoring requests
- [done] Platform policies page exists
- [done] Required-field indicators are visible on important forms
- [done] Mobile styling has been improved

Recommended before pilot:
- [done] Test all login flows on at least 2 phones and 1 laptop
- [ ] Test student sign up with a real email confirmation
- [ ] Test tutor application with real attachment uploads
- [ ] Test admin review of uploaded files
- [ ] Test logout from student, tutor, and admin accounts
- [ ] Confirm Vercel production link is stable and publicly accessible
- [ ] Confirm no hidden debug text is visible to normal users

---

## Must Fix Before Nationwide Rollout

These are the most important blockers before promoting the product widely across Oman.

### 1. Session and Auth Stability

- [ ] Confirm admin session no longer jams after refresh
- [ ] Confirm logout always works for admin, tutor, and student
- [ ] Confirm protected routes never hang on "Checking your session..."
- [ ] Confirm missing profile rows are handled safely
- [ ] Confirm role detection always matches `public.profiles.role`

Why it matters:
- If users cannot reliably log in, log out, refresh, or access the correct dashboard, trust in the platform will drop quickly.

### 2. Role and Access Protection

- [ ] Student accounts must never enter tutor-only pages incorrectly
- [ ] Tutor accounts must never enter student-only flows incorrectly
- [ ] Admin-only pages must stay fully protected
- [ ] Uploaded sensitive files must only be visible to authorized roles

Why it matters:
- Your platform handles student and tutor data, including transcripts and IDs. Access mistakes are serious.

### 3. End-to-End QA

- [ ] Test student flow from sign up to tutoring request
- [ ] Test tutor flow from application to dashboard access
- [ ] Test admin flow from login to request review
- [ ] Test contact form submission and admin reading flow
- [ ] Test file download from dashboard
- [ ] Test password reset flow fully
- [ ] Test resend confirmation flow fully

Why it matters:
- A platform can look finished but still fail in real usage unless all major flows are tested end to end.

### 4. Operational Workflow

- [ ] Define how tutors will respond to requests
- [ ] Define expected reply time for tutor applications
- [ ] Define expected reply time for tutoring requests
- [ ] Define how admins monitor unresolved requests
- [ ] Define who handles misuse reports or harassment reports

Why it matters:
- Once students start using the platform, process matters as much as code.

### 5. Privacy and Safety

- [ ] Review how tutor documents are stored
- [ ] Review who can access Omani ID and transcript files
- [ ] Confirm policies match actual data handling
- [ ] Add a clearer privacy notice if needed
- [ ] Prepare a simple incident-response plan for abuse or misuse

Why it matters:
- You collect sensitive academic and personal information. This requires extra care before public scale.

### 6. Notifications and Responsiveness

- [ ] Add a clear method to notify admins of new submissions
- [ ] Add a clear method to notify tutors of new tutoring requests
- [ ] Add a clear method to confirm request progress to students

Why it matters:
- Without notifications, requests may sit unseen and students may assume the platform is not working.

### 7. Performance and Production Hardening

- [ ] Reduce the large Vite bundle warning if possible
- [ ] Check performance on slower mobile networks
- [ ] Re-test the full mobile experience after every major auth/dashboard change
- [ ] Confirm image-heavy pages still load quickly

Why it matters:
- Students across institutions may use older devices and weaker connections.

---

## Public Launch Ready

These items should be complete before wider promotion across many institutions.

- [ ] Pilot launch completed successfully
- [ ] No repeated auth/session jam reports for at least 1 to 2 weeks
- [ ] Admin workflows operate smoothly under real usage
- [ ] Tutor response workflow is consistent
- [ ] Student requests are being answered in a timely way
- [ ] File access permissions are verified
- [ ] Password reset and email confirmation work reliably
- [ ] Mobile experience is verified across multiple devices
- [ ] Production deployment is stable
- [ ] Privacy, conduct, and reporting policies are clearly visible
- [ ] Contact/support process is clear for users

---

## Suggested Rollout Plan

### Phase 1: Soft Pilot

Target:
- 10 to 30 students
- 2 to 5 tutors
- 1 to 2 institutions

Goals:
- catch real bugs
- test request handling workflow
- verify dashboard reliability

### Phase 2: Expanded Pilot

Target:
- 50 to 150 students
- several tutors across multiple institutions

Goals:
- test scalability of admin operations
- verify auth and support stability
- refine tutor response process

### Phase 3: Public Promotion

Target:
- broader publicity across institutions in Oman

Only start this after:
- auth/session issues are fully stable
- support workflow is reliable
- pilot feedback has been addressed

---

## Final Decision Rule

You are ready for a pilot if:
- core flows work
- admin can manage submissions
- major bugs are not blocking usage

You are ready for nationwide promotion only if:
- auth/session stability is proven
- access control is reliable
- support operations are clearly defined
- privacy handling is trustworthy
- pilot results are positive

