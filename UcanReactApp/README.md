# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## UcanJobs QA Rule

After every major auth or dashboard change, always do a mobile re-test before treating the work as complete.

Changes that require mobile re-testing include:
- login, signup, logout, reset-password, or session behavior
- role-based redirects or protected routes
- navbar account state or dashboard access buttons
- admin, tutor, or student dashboard layout and popup behavior
- request-management, status-update, or attachment-download flows

Minimum mobile re-test checklist:
- open the affected page on a phone-sized viewport
- confirm the page loads without getting stuck on a loading state
- confirm buttons, popups, and forms remain usable on small screens
- confirm auth state is shown correctly after refresh
- confirm no overflow, clipped cards, or hidden action buttons appear
