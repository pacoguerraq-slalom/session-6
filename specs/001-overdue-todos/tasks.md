# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Test tasks are INCLUDED — the feature specification explicitly requires automated tests
covering the overdue-determination logic and its display (spec.md FR-008), per
`docs/testing-guidelines.md` conventions.

**Organization**: Tasks are grouped by user story (from `spec.md`) to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are exact and relative to the repository root

## Path Conventions

This is the existing `packages/frontend` + `packages/backend` monorepo (per `plan.md`). This
feature is frontend-only — no `packages/backend` paths are touched.

---

## Phase 1: Setup

**Purpose**: Confirm the existing frontend toolchain is ready; no new dependencies are needed.

- [ ] T001 Run `npm run test:frontend` from the repo root to confirm the existing suite passes before making changes (baseline check, no code changes)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared logic and styling that every user story below depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 [P] Create `packages/frontend/src/utils/overdue.js` exporting `isOverdue(todo, referenceDate = new Date())`, returning `true` only when `todo.completed` is falsy, `todo.dueDate` is set, and `dueDate` is strictly earlier (calendar date comparison) than `referenceDate`
- [ ] T003 [P] Write unit tests in `packages/frontend/src/utils/__tests__/overdue.test.js` covering: no due date, due date today, due date yesterday, due date tomorrow, and completed todo with a past due date
- [ ] T004 [P] Add a `.overdue-badge` style rule to `packages/frontend/src/App.css` using `color: var(--danger-color)` and existing spacing tokens, matching the clarified badge design in `spec.md`

**Checkpoint**: Foundation ready — `isOverdue` is unit-tested and the badge style exists; user story implementation can now begin.

---

## Phase 3: User Story 1 - See which todos are overdue at a glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a past due date show a visible "Overdue" badge in the todo list; non-overdue todos do not.

**Independent Test**: Load a todo list containing an incomplete todo with a past due date, a completed todo with a past due date, and a todo with no due date — only the first shows the badge.

### Tests for User Story 1 ⚠️

> Write these tests FIRST, ensure they FAIL before implementation

- [ ] T005 [P] [US1] Add test to `packages/frontend/src/components/__tests__/TodoCard.test.js`: renders "Overdue" badge for an incomplete todo with a past `dueDate`
- [ ] T006 [P] [US1] Add test to `packages/frontend/src/components/__tests__/TodoCard.test.js`: does NOT render the badge for a completed todo with a past `dueDate`
- [ ] T007 [P] [US1] Add test to `packages/frontend/src/components/__tests__/TodoCard.test.js`: does NOT render the badge for a todo with no `dueDate`

### Implementation for User Story 1

- [ ] T008 [US1] Import `isOverdue` in `packages/frontend/src/components/TodoCard.js` and conditionally render `<span className="overdue-badge">Overdue</span>` next to the due date text in the non-editing view (depends on T002, T004)
- [ ] T009 [US1] Run `npm run test:frontend` and confirm T005–T007 now pass

**Checkpoint**: User Story 1 is fully functional and testable independently — this is the MVP.

---

## Phase 4: User Story 2 - Overdue status updates automatically as time passes (Priority: P2)

**Goal**: Overdue status is always computed from the current date at render time, so a todo becomes overdue the day after its due date with no manual recalculation.

**Independent Test**: A todo due today is not overdue; the same todo, evaluated a day later (simulated via `referenceDate` in tests), is overdue — with no code change or extra step required.

### Tests for User Story 2 ⚠️

- [ ] T010 [P] [US2] Add test to `packages/frontend/src/utils/__tests__/overdue.test.js`: `isOverdue` returns `false` when `referenceDate` equals `dueDate` (due today), and `true` when `referenceDate` is one day after `dueDate`, using explicit `referenceDate` arguments (no system clock mocking)
- [ ] T011 [P] [US2] Add test to `packages/frontend/src/components/__tests__/TodoCard.test.js`: re-rendering `TodoCard` with an unchanged todo but a later current date shows the badge without any prop other than the date changing

### Implementation for User Story 2

- [ ] T012 [US2] Confirm `TodoCard` calls `isOverdue(todo)` (defaulting `referenceDate` to `new Date()`) directly in the render body rather than in `useState`/`useMemo` with a stale dependency, so status is recomputed on every render (verify/adjust `packages/frontend/src/components/TodoCard.js`)

**Checkpoint**: User Stories 1 AND 2 both work independently — overdue status is correct today and stays correct as dates pass.

---

## Phase 5: User Story 3 - Overdue indicator is visible when editing a todo (Priority: P3)

**Goal**: A user editing an overdue todo can still see that it is overdue while editing.

**Independent Test**: Open an overdue todo's edit view and confirm the "Overdue" badge is still visible.

### Tests for User Story 3 ⚠️

- [ ] T013 [P] [US3] Add test to `packages/frontend/src/components/__tests__/TodoCard.test.js`: clicking "Edit" on an overdue todo keeps the "Overdue" badge visible in the edit-mode view

### Implementation for User Story 3

- [ ] T014 [US3] Render the same `<span className="overdue-badge">Overdue</span>` (via `isOverdue`) in the edit-mode branch of `packages/frontend/src/components/TodoCard.js`, next to the due-date input (depends on T002, T004, T008)

**Checkpoint**: All three user stories are independently functional and tested.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks across all stories.

- [ ] T015 [P] Add a one-line mention of the overdue indicator to `docs/functional-requirements.md` under Todo Item Management, per Constitution Principle V (Documentation Discipline)
- [ ] T016 Run `npm run test:frontend` (full suite) and confirm all new and existing tests pass with no regressions
- [ ] T017 Manually run through all 6 scenarios in `specs/001-overdue-todos/quickstart.md` against `npm start`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (T002, T004). No dependency on US2/US3.
- **User Story 2 (Phase 4)**: Depends on Foundational (T002). Independent of US1's UI changes, but its test T011 exercises `TodoCard`, so is easiest to verify once T008 (US1) exists.
- **User Story 3 (Phase 5)**: Depends on Foundational (T002, T004) and reuses the badge introduced in US1 (T008) inside the edit branch.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Completion Order

1. User Story 1 (P1) — MVP, delivers the core value alone.
2. User Story 2 (P2) — refines correctness of US1's behavior over time; no new UI.
3. User Story 3 (P3) — extends US1's badge into the edit view.

## Parallel Execution Examples

Within Phase 2 (Foundational), T002, T003, and T004 touch different files and can run in parallel:

```text
T002 [P] Create packages/frontend/src/utils/overdue.js
T003 [P] Create packages/frontend/src/utils/__tests__/overdue.test.js
T004 [P] Add .overdue-badge style to packages/frontend/src/App.css
```

Within Phase 3 (User Story 1), the three test tasks are independent additions to the same file's
test cases and can be drafted in parallel, then merged before T008:

```text
T005 [P] [US1] Overdue badge renders for past-due incomplete todo
T006 [P] [US1] No badge for completed past-due todo
T007 [P] [US1] No badge for todo with no due date
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (`isOverdue` utility + badge style + unit tests)
3. Complete Phase 3: User Story 1
4. **STOP and validate**: Run T009, confirm the badge appears correctly in the running app
5. This alone delivers the feature's core value (spec.md Success Criteria SC-001, SC-002)

### Incremental Delivery

1. Setup + Foundational → nothing user-visible yet, but fully tested groundwork
2. Add User Story 1 → test independently → **MVP deployable**
3. Add User Story 2 → test independently → confidence the badge stays correct over time
4. Add User Story 3 → test independently → edit view parity
5. Polish → docs + full regression pass

Each story adds value without breaking previously completed stories.
