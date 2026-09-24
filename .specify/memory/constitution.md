<!--
Sync Impact Report
- Version change: [TEMPLATE] → 1.0.0
- Modified principles: N/A (initial ratification)
- Added sections:
  - Core Principles: Code Quality & Consistency, Test-First Development, Component-Based
    Architecture, Design System Fidelity, Documentation Discipline
  - Technology Stack & Structure
  - Development Workflow
  - Governance
- Removed sections: N/A
- Deferred TODOs: none
- Templates requiring follow-up: none — spec/plan/tasks templates consume this file at
  runtime and do not embed principle names.
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Code Quality & Consistency
All code MUST follow the conventions in `docs/coding-guidelines.md`: 2-space indentation,
`camelCase` for variables/functions, `UPPER_SNAKE_CASE` for constants, `PascalCase` for React
components and classes, and one component per file with a matching filename. Code MUST apply
DRY, KISS, and SOLID principles — extract duplicated logic into shared utilities, keep functions
and components single-purpose, and prefer straightforward solutions over premature abstraction.
Imports MUST be ordered (external libraries, then internal modules, then styles) and grouped with
blank lines. Rationale: a small, consistent codebase is what makes AI-assisted changes safe and
reviewable; inconsistent style multiplies review cost and hides real defects.

### II. Test-First Development (NON-NEGOTIABLE)
Every new behavior MUST have Jest tests colocated in a `__tests__/` directory next to the code
under test, named `{filename}.test.js`. Tests MUST verify observable behavior, not implementation
details, follow Arrange-Act-Assert, and be independent (no shared mutable state, dependencies
mocked). The project targets 80%+ coverage across unit tests (components, route handlers, utility
functions) and integration tests (component interactions, frontend-to-backend API calls). Tests
MUST be written or updated alongside the change that motivates them, and MUST pass before a task
is considered complete. Rationale: this project is built through spec-driven, AI-generated
changes; automated tests are the primary guardrail against regressions the author didn't foresee.

### III. Component-Based Architecture
The system MUST remain a monorepo with two independently runnable packages: `packages/frontend`
(React) and `packages/backend` (Express.js), managed through npm workspaces. Frontend components
MUST follow Single Responsibility — a component renders and handles its own interaction, and
delegates data access to `services/`. Backend logic MUST separate route handling from business
logic and data access. Cross-package coupling MUST go through the documented HTTP API only; no
package may reach into another's internal files. Rationale: keeping frontend and backend
independently testable and runnable is what allows each spec/plan/tasks cycle to change one layer
without destabilizing the other.

### IV. Design System Fidelity
Any UI change MUST conform to `docs/ui-guidelines.md`: the defined color palette (light and dark
mode), the 8px spacing grid, typography scale, and documented component patterns (todo card,
input section, confirmation dialog). New UI elements MUST support both light and dark mode using
the existing theme mechanism rather than introducing ad-hoc colors or one-off spacing values.
Rationale: a documented design system is only useful if every generated change honors it; drift
here is invisible in code review until it reaches the browser.

### V. Documentation Discipline
Comments MUST explain *why*, not *what* — no comments restating obvious code. Public functions
and components exposed for reuse SHOULD carry JSDoc describing parameters and return values.
Functional scope changes (new features, altered behavior) MUST be reflected in
`docs/functional-requirements.md` when they affect user-facing requirements. Rationale: this
project is a teaching artifact; documentation that drifts from behavior actively misleads the
next contributor (human or AI).

## Technology Stack & Structure

- Frontend: React + React DOM, styled with plain CSS following the design tokens in
  `docs/ui-guidelines.md`; tests via Jest and `@testing-library/react`.
- Backend: Node.js + Express.js exposing a REST API; tests via Jest and `supertest`.
- Package management: npm workspaces from the repository root (`packages/*`); no additional
  package managers may be introduced without amending this constitution.
- Persistence: the existing backend persistence mechanism is the single source of truth; the
  app is single-user, with no authentication or per-user data isolation.
- No new production dependency (frontend or backend) may be added solely to satisfy a
  convenience; prefer the existing stack and standard library first.

## Development Workflow

- Work happens on feature branches (e.g. `feature/<name>`); direct commits to `main` are
  reserved for automation/scaffolding steps such as this one.
- Every commit MUST represent one logical, atomic change with a descriptive message explaining
  the "why," per the Git Practices in `docs/coding-guidelines.md`.
- Before opening a pull request, all Jest suites (`npm test` at the root, which runs both
  workspaces) MUST pass locally.
- Spec-Driven Development commands (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`,
  `/speckit-implement`) are the required path for non-trivial feature work; ad-hoc
  implementation without a spec/plan is discouraged for anything beyond a trivial fix.

## Governance

This constitution supersedes ad-hoc conventions and prior undocumented practice for this
project. Amendments are made by editing this file directly:

- **PATCH**: wording clarifications, typo fixes, non-semantic edits.
- **MINOR**: a new principle or materially expanded guidance added.
- **MAJOR**: a principle removed or redefined in a backward-incompatible way.

Every amendment MUST update the Sync Impact Report at the top of this file and bump
`CONSTITUTION_VERSION` accordingly. Pull requests and AI-generated implementation plans MUST be
checked against these principles; any deliberate deviation MUST be called out and justified in
the plan's Complexity Tracking section rather than silently applied. Use
`docs/coding-guidelines.md`, `docs/testing-guidelines.md`, and `docs/ui-guidelines.md` for
day-to-day operational guidance that supports these principles.

**Version**: 1.0.0 | **Ratified**: 2026-09-24 | **Last Amended**: 2026-09-24
