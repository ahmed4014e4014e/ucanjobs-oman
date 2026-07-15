# Udemy-style course experience — UI mocks

Interactive prototypes (no database). Use these to approve layout before Schema/API work.

## Open in the browser

| Screen | Path |
|--------|------|
| Hub | `/mock/course-experience/` |
| Instructor kit | `/mock/instructor-course-kit/` |
| Learner player | `/mock/learn-player/` |

```bash
npm run dev
```

Then visit: `http://localhost:5173/mock/course-experience/`

## What’s mocked

### Instructor kit
- Sections + lectures curriculum tree
- Lecture types: video, article, quiz, resources
- Multi-file resources per lecture
- Reorder (move up/down), add/remove
- Preview as student link
- Save is local-only (toast message)

### Learner player
- Sticky curriculum sidebar with section expand + completion
- Video stage placeholder
- Lesson text + multi downloads + quiz
- Mark complete, previous/next
- Progress %

## Code map

| Path | Role |
|------|------|
| `src/lib/mockCourseExperience.js` | Demo data + stats helpers |
| `src/components/domain/CurriculumSidebar.jsx` | Shared curriculum tree |
| `src/components/domain/LecturePlayerPanel.jsx` | Learner content pane |
| `src/routes/mock*.jsx` | Mock pages |

## Production (phases A–D shipped)

| Path | Role |
|------|------|
| `/instructor-course-kit/:courseId/` | Live sectioned instructor kit |
| `/learn/:slug/` | Live learner player (+ `?preview=1` for instructor) |
| `/courses/:slug/` | Public curriculum + free previews |
| SQL | `supabase/phase_a_sectioned_curriculum.sql` — **apply in Supabase** |

Mocks remain as demos under `/mock/*`.
