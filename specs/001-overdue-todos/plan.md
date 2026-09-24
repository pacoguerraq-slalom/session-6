# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

## Summary

Add a purely client-side, derived "overdue" state to existing todos: an incomplete todo whose
`dueDate` is earlier than today's date is shown with an "Overdue" badge (styled with the existing
`--danger-color` design token) next to its due date, in both the todo list and the edit view.
Overdue status is computed at render time from data the frontend already has (`dueDate`,
`completed`) — no new stored field, no API changes, and no change to list ordering.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18 (per `packages/frontend/package.json`)

**Primary Dependencies**: React, `@testing-library/react`, Jest (existing frontend stack; no new
dependencies introduced)

**Storage**: N/A — overdue status is derived in the frontend from the existing `dueDate` and
`completed` fields already returned by the backend API; no schema or persistence change

**Testing**: Jest + `@testing-library/react`, colocated in `__tests__/` per
`docs/testing-guidelines.md`

**Target Platform**: Existing React web app (`packages/frontend`), desktop-focused per
`docs/functional-requirements.md`

**Project Type**: Web application (existing `packages/frontend` + `packages/backend` monorepo) —
this feature only touches `packages/frontend`

**Performance Goals**: Negligible — overdue check is an O(1) date comparison per todo, run during
existing render cycles; no measurable impact on the list rendering already in place

**Constraints**: Must not change the todo data model, API contracts, or list ordering (per spec
Assumptions and FR-009); must use the existing `--danger-color` design token for both light and
dark themes rather than introducing new colors

**Scale/Scope**: Single component-level change (`TodoCard`) plus one new shared utility function;
no impact on list size/scale beyond what already exists

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|-----------|-------|--------|
| I. Code Quality & Consistency | New logic extracted into a single reusable utility (`isOverdue`) rather than duplicated inline in each component that needs it | PASS |
| II. Test-First Development | Spec FR-008 explicitly requires unit tests for the overdue logic and component tests for its display; tests will be added colocated in `__tests__/` before/alongside implementation | PASS |
| III. Component-Based Architecture | Change is contained to `packages/frontend`; no cross-package coupling; `TodoCard` keeps rendering as its single responsibility, delegating the overdue *calculation* to a utility function | PASS |
| IV. Design System Fidelity | Reuses the existing `--danger-color` token (already defined for both light/dark themes in `theme.css`) instead of a new color; follows the 8px spacing grid for badge padding | PASS |
| V. Documentation Discipline | No new comments beyond explaining the overdue-boundary rule (why "due today" is excluded); `docs/functional-requirements.md` will get a one-line addition once implemented (tracked as a task) | PASS |

No violations — Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

No `contracts/` directory is generated — this feature adds no new API endpoints or external
interfaces; it is a purely client-side, derived-state display change.

### Source Code (repository root)

```text
packages/frontend/src/
├── utils/
│   ├── overdue.js                 # NEW: isOverdue(todo, referenceDate) pure function
│   └── __tests__/
│       └── overdue.test.js        # NEW: unit tests for overdue determination logic
├── components/
│   ├── TodoCard.js                # MODIFIED: render "Overdue" badge when isOverdue(todo) is true
│   ├── __tests__/
│   │   └── TodoCard.test.js       # MODIFIED: add overdue-display test cases
│   └── ...                        # TodoList.js, TodoForm.js, ConfirmDialog.js unaffected
├── styles/
│   └── theme.css                  # Reused as-is (--danger-color already defined); one new
│                                   #   `.overdue-badge` class added to App.css or a component-
│                                   #   local stylesheet, not a new theme token
└── App.css                        # MODIFIED: add `.overdue-badge` styles using existing tokens

packages/backend/                  # UNCHANGED — no API or data model changes required
```

**Structure Decision**: This is a frontend-only addition to the existing
`packages/frontend/src/components` and a new `packages/frontend/src/utils/` module (the project
currently has no `utils/` directory; per Constitution Principle I, DRY favors extracting the
overdue check as a shared utility rather than duplicating the date comparison inside `TodoCard`
and any future consumer). The backend and its existing `packages/backend/src/services/todoService.js`
require no changes since `dueDate` and `completed` are already returned by the existing API.

## Complexity Tracking

*No violations — table intentionally left empty.*
