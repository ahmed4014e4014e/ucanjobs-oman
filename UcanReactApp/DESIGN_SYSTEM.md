# UcanJobs Design System

Target architecture for UI refactoring and visual enhancement. Product architecture (routes, `lib`, Supabase) stays the same. This document describes **how UI is built and shared**.

**Status**

| Phase | Scope | Status |
|-------|--------|--------|
| Phase 0 | Tokens + `ui/*` + `layout/*` foundations | Done |
| Phase 1 | Shell + public pages | Done — AppShell, Home, Courses, Course detail, About, Contact, Policies |
| Phase 2 | Auth layouts | Planned |
| Phase 3 | Learner product UX | Planned |
| Phase 4 | Instructor | Planned |
| Phase 5 | Admin density | Planned |
| Phase 6 | Cleanup / dead code | Planned |

---

## Goals

| Goal | Meaning |
|------|---------|
| One visual language | Public + learner + instructor + admin feel like one product |
| Faster UI changes | Change a button once → every page updates |
| Safer mobile QA | Shared form/layout patterns reduce layout bugs |
| Thinner routes | Pages compose components; less copy-pasted Tailwind |
| Incremental migration | Ship page-by-page; app stays releasable |

Non-goals (for now): new CSS framework, TypeScript conversion, redesign of Supabase APIs.

---

## Design principles

1. **Oman brand stays** — terracotta, brass, sand, ink remain the source of truth  
2. **Composition over mega-pages** — dashboards = layout + sections + data widgets  
3. **Role variants, not three systems** — same atoms; denser layouts for admin  
4. **State is first-class** — loading / empty / error / success always designed  
5. **Mobile-first** for auth and dashboards (see README mobile QA rule)

---

## Folder structure

```
src/
  components/
    ui/                 # atoms + molecules (no Supabase)
      Button.jsx
      Card.jsx
      Field.jsx
      Alert.jsx
      index.js
    layout/             # page chrome
      Page.jsx
      PageHeader.jsx
      Hero.jsx
      Section.jsx
      index.js
    domain/             # product composites (future)
    guards/             # ProtectedRoute, RoleProtectedRoute (future move)
  routes/               # thin page composers
  lib/                  # data layer only
  index.css             # tokens + base oman-* utilities
```

**Rules**

| Layer | May do | Must not |
|-------|--------|----------|
| `ui/` | Presentational props, variants | Call Supabase / own product data |
| `layout/` | Structure, width, hero chrome | Business logic |
| `domain/` | Product-shaped UI from props | Prefer not calling Supabase directly |
| `routes/` | Fetch data, compose UI | Duplicate primitive class soup |
| `lib/` | APIs, config, translations | Own page layout |

---

## Tokens

Defined in `src/index.css` (`:root`).

### Brand (existing)

- `--oman-sand`, `--oman-sand-deep`
- `--oman-terracotta`, `--oman-terracotta-dark`
- `--oman-brass`, `--oman-olive`, `--oman-ink`
- `--oman-paper`, `--oman-border`

### Semantic (Phase 0)

```css
--color-bg-page
--color-bg-surface
--color-text
--color-text-muted
--color-primary
--color-secondary
--color-success
--color-warning
--color-danger
--color-info
--color-focus-ring
--radius-sm | md | lg | xl
--shadow-card
--space-page-x
```

Semantic tokens map to the Oman palette so brand tweaks do not require hunting class strings.

### Legacy utility classes (still valid)

Keep during migration; prefer components for new UI:

- `.oman-page`, `.oman-hero`, `.oman-card`, `.oman-card-soft`
- `.oman-dark-panel`, `.oman-outline-panel`
- `.oman-button-primary`, `.oman-button-secondary`
- `.oman-kicker`, `.oman-section-kicker`, `.oman-title-accent`
- `.oman-photo-frame`, `.oman-chip`, `.oman-stat-number`

---

## Component API conventions

### Button

```jsx
import { Button } from "../components/ui";

<Button variant="primary|secondary|ghost|danger" size="sm|md|lg" loading fullWidth>
  Label
</Button>

{/* React Router */}
<Button to="/courses/" variant="primary">Explore</Button>
```

### Card

```jsx
import { Card } from "../components/ui";

<Card variant="default|soft|outline|dark" padding="sm|md|lg" rounded="lg|xl">
  ...
</Card>
```

### Field

```jsx
import { Field } from "../components/ui";

<Field
  label="Email"
  name="email"
  type="email"
  required
  error={error}
  hint="We never share your email."
/>
```

### Alert

```jsx
import { Alert } from "../components/ui";

<Alert type="success|error|info|warning" title="Optional" message="Required" />
```

`ActionFeedback` remains for backward compatibility; new code should prefer `Alert`.

### Page / PageHeader / Hero / Section

```jsx
import { Page, PageHeader, Hero, Section } from "../components/layout";

<Page>
  <Hero backgroundImage={url}>...</Hero>
  <Section>
    <PageHeader kicker="..." title="..." description="..." align="left|center" />
  </Section>
</Page>
```

---

## Page templates

### Public marketing

```
Page → Hero → Section (stats) → Section (features) → Section (steps) → CTA → footer
```

### Auth (Phase 2)

```
AuthLayout → brand panel + Field stack + Button + Alert
```

### Role dashboard (Phase 3–4)

```
DashboardLayout → PageHeader → profile Card → grid of domain widgets
```

### Admin list (Phase 5)

```
Page → PageHeader (back + primary) → Alert → filters → list/table → detail
```

---

## Feedback contract

```js
{ type: "idle" | "loading" | "success" | "error", message: "" }
```

| State | UI |
|-------|-----|
| loading | Button `loading` / loading block |
| empty | EmptyState (Phase 1+) |
| error / success | `Alert` |
| disabled | consistent opacity on Button/Field |

---

## Migration order

1. **Phase 0** — Foundations (`ui/*`, `layout/*`, tokens)  
2. **Phase 1** — `Root` shell, public pages (`home` first, then courses, about, contact, terms)  
3. **Phase 2** — Auth access pages + application forms  
4. **Phase 3** — Learner dashboard + learn course  
5. **Phase 4** — Instructor dashboard + course kit  
6. **Phase 5** — Admin tools  
7. **Phase 6** — Remove dead `App.jsx` template, dedupe class strings  

Each phase ends with desktop + phone-viewport smoke tests (auth/dashboard rule from README).

---

## Success metrics

- 80%+ of buttons/fields/cards on migrated surfaces use `ui/*`  
- New admin page scaffoldable quickly from shared layout patterns  
- Brand CTA color change is tokens/components, not dozens of files  
- Migrated route files are thinner and easier to reason about  

---

## Related

- Product overview: codebase under `src/`  
- Launch readiness: `LAUNCH_READINESS_CHECKLIST.md`  
- Mobile QA after auth/dashboard changes: `README.md` (UcanJobs QA Rule)
