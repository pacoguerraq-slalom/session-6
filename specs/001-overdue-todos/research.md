# Phase 0 Research: Support for Overdue Todo Items

All open questions from the spec were already resolved during `/speckit-clarify` (see
`spec.md` → Clarifications). No `NEEDS CLARIFICATION` markers remain in the Technical Context.
This file records the remaining implementation-level decisions made during planning.

## Decision: Where to compute "overdue"

- **Decision**: Compute overdue status in a new pure utility function,
  `packages/frontend/src/utils/overdue.js` → `isOverdue(todo, referenceDate = new Date())`,
  called from `TodoCard` at render time.
- **Rationale**: Keeps the check a single, unit-testable source of truth (Constitution Principle
  I — DRY), independent of any specific component. Passing an explicit `referenceDate` (defaulting
  to "now") makes the function trivial to unit-test deterministically without mocking global
  `Date`.
- **Alternatives considered**:
  - Compute inline inside `TodoCard` — rejected, not reusable if another view needs the same
    check, and harder to unit test in isolation from rendering.
  - Compute on the backend and add an `overdue` field to the API response — rejected; the spec
    explicitly scopes this as a display-only concern (Assumptions section), and doing it in the
    backend would require API and data-access changes for a value derivable from data the
    frontend already has.

## Decision: Date comparison semantics

- **Decision**: Compare using calendar dates only (strip time-of-day), matching the existing
  `dueDate` storage format (`YYYY-MM-DD` string, already used elsewhere via `formatDate` in
  `TodoCard.js`). A todo is overdue when `dueDate < today` (strictly earlier), never when equal.
- **Rationale**: Matches FR-004 (due today is not overdue) and the Edge Cases/Assumptions in the
  spec regarding timezones — using the browser's local date avoids introducing a timezone
  library or UTC conversion that isn't needed anywhere else in this codebase.
- **Alternatives considered**: Comparing full `Date` objects/timestamps — rejected, introduces
  false positives/negatives around midnight due to time-of-day components that don't exist in
  the stored data.

## Decision: Visual treatment

- **Decision**: Render a small `<span class="overdue-badge">Overdue</span>` next to the due date
  text in `TodoCard`, styled with `color: var(--danger-color)` and a subtle background tint,
  added to `App.css` alongside the other component styles already defined there.
- **Rationale**: Directly implements the clarified answer in `spec.md` (badge in the existing
  danger color); reuses `--danger-color`, which is already defined for both light and dark themes
  in `packages/frontend/src/styles/theme.css`, satisfying Constitution Principle IV (Design
  System Fidelity) with zero new tokens.
- **Alternatives considered**: Recoloring the whole card or the due-date text — explicitly
  rejected by the clarification answer in favor of the dedicated badge.

## Decision: Test strategy

- **Decision**: Two test additions —
  1. `packages/frontend/src/utils/__tests__/overdue.test.js` — pure unit tests for `isOverdue`
     covering: no due date, due date today, due date yesterday, due date tomorrow, completed
     todo with past due date.
  2. Additions to the existing `packages/frontend/src/components/__tests__/TodoCard.test.js` —
     component tests asserting the badge renders/doesn't render for the same cases, using
     `@testing-library/react`, matching existing test patterns in that file.
- **Rationale**: Matches FR-008 and Constitution Principle II (Test-First Development); reuses
  the existing Jest + Testing Library stack already configured in `packages/frontend`.
- **Alternatives considered**: End-to-end/browser tests — rejected as out of scope; per
  `docs/testing-guidelines.md`, end-to-end testing is explicitly out of scope for this project.
