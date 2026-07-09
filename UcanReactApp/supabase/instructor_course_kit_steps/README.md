# Instructor Course Kit SQL

Run these files in Supabase SQL Editor in numerical order:

1. `00_ensure_course_proposals.sql`
1. `01_add_course_ownership_columns.sql`
2. `02_add_proposal_review_columns.sql`
3. `03_add_course_ownership_indexes.sql`
4. `04_create_admin_review_function.sql`
5. `05_create_instructor_publish_function.sql`
6. `06_add_instructor_course_policies.sql`
7. `07_add_instructor_content_policies.sql`
8. `08_verify_course_kit_foundation.sql`
9. `09_create_quiz_tables.sql`
10. `10_add_quiz_indexes.sql`
11. `11_add_quiz_author_policies.sql`
12. `12_create_learner_quiz_reader.sql`
13. `13_create_quiz_submission_function.sql`
14. `14_create_course_content_storage.sql`
15. `15_strengthen_publication_validation.sql`
16. `16_verify_quizzes_and_storage.sql`
17. `17_test_complete_course_lifecycle.sql`

Steps 00 through 7 establish course ownership. Step 8 verifies that foundation.
Steps 9 through 15 add quizzes, uploads, and publication validation. Step 16 is read-only verification.
Step 17 runs a complete role-aware lifecycle test and rolls all test records back.
