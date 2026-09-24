# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "As a todo application user, I want to easily identify and distinguish overdue tasks in my todo list, so that I can prioritize my work and quickly see which tasks are past their due date. Users need a clear, visual way to identify which todos have not been completed by their due date, without having to manually check dates against today's date. This feature must include automated tests covering the overdue determination logic and its display, following the existing Jest patterns in the repository."

## Clarifications

### Session 2026-09-24

- Q: How should an overdue todo be visually distinguished in the list? → A: Show a small "Overdue" text badge/label next to the due date, styled in the existing danger color from `docs/ui-guidelines.md`.
- Q: Should overdue todos be reordered or grouped, or keep the existing creation-date order? → A: No reordering — overdue todos are only visually marked; list order stays by creation date.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See which todos are overdue at a glance (Priority: P1)

As a user viewing my todo list, I want incomplete todos whose due date has passed to be
visually distinguished from other todos, so I can immediately tell what needs my attention
without comparing each due date to today's date myself.

**Why this priority**: This is the core value of the feature — without a visible indicator,
users get no benefit at all. Every other behavior (edge cases, updates) only matters once this
exists.

**Independent Test**: Can be fully tested by loading a todo list containing at least one
incomplete todo with a due date in the past, and confirming that todo is visually marked as
overdue while todos with future or no due dates are not.

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today and marked incomplete, **When** the todo
   list is displayed, **Then** that todo is shown with an "Overdue" badge in the existing danger
   color, not applied to non-overdue todos.
2. **Given** a todo with a due date earlier than today that is marked complete, **When** the
   todo list is displayed, **Then** that todo is NOT shown as overdue.
3. **Given** a todo with no due date set, **When** the todo list is displayed, **Then** that
   todo is NOT shown as overdue.

---

### User Story 2 - Overdue status updates automatically as time passes (Priority: P2)

As a user, I want a todo's overdue status to be based on the current date every time I view my
list, so that a todo automatically becomes overdue the day after its due date without me having
to edit or refresh anything beyond opening/viewing the app.

**Why this priority**: This ensures the feature keeps working correctly over time rather than
only at the moment a todo was created, but it is a refinement of the core display behavior in
User Story 1.

**Independent Test**: Can be fully tested by setting a todo's due date to today, confirming it is
not overdue, then confirming a todo with a due date of yesterday (relative to the test's current
date) is overdue — without any manual recalculation step.

**Acceptance Scenarios**:

1. **Given** a todo whose due date is today, **When** the todo list is displayed, **Then** the
   todo is NOT marked overdue (it is still due today, not past due).
2. **Given** a todo whose due date is yesterday, **When** the todo list is displayed, **Then**
   the todo is marked overdue.

---

### User Story 3 - Overdue indicator is visible when editing a todo (Priority: P3)

As a user editing an existing overdue todo, I want to still be able to see that it's overdue
while I edit it, so I have that context while deciding whether to change its due date or mark it
complete.

**Why this priority**: Nice-to-have consistency; the primary value is already delivered by the
list view in User Story 1, and most users will resolve overdue items directly from the list.

**Independent Test**: Can be fully tested by opening the edit view for a todo that is overdue in
the list, and confirming the overdue indicator remains visible/accurate during editing.

**Acceptance Scenarios**:

1. **Given** an overdue todo, **When** the user opens it for editing, **Then** the overdue
   indicator is still visible in that view.

---

### Edge Cases

- What happens when a todo's due date is exactly "today"? It is NOT overdue (only past due
  dates count as overdue; see User Story 2, Scenario 1).
- What happens when a todo has no due date at all? It is never marked overdue.
- What happens when a completed todo's due date is in the past? It is NOT marked overdue —
  overdue only applies to incomplete todos.
- How does the system handle a todo whose due date is edited to a past date? It MUST become
  overdue immediately on the next render, with no separate save/recalculate step required.
- How does the system handle timezones? Due dates are calendar dates (no time-of-day component);
  a todo becomes overdue starting the day after its due date, evaluated against the user's local
  date.
- Does the todo list reorder or group overdue items? No — the list retains its existing
  creation-date ordering (per `docs/functional-requirements.md`); overdue status is a visual
  marker only.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine a todo to be "overdue" when it is incomplete AND its due
  date is earlier than the current date.
- **FR-002**: System MUST NOT mark a todo as overdue if it has no due date set.
- **FR-003**: System MUST NOT mark a todo as overdue if it is marked complete, regardless of due
  date.
- **FR-004**: System MUST NOT mark a todo as overdue when its due date is the current date
  (due today is not yet overdue).
- **FR-005**: The todo list view MUST visually distinguish overdue todos from non-overdue todos
  by displaying an "Overdue" text badge next to the due date, styled using the existing danger
  color defined in `docs/ui-guidelines.md`, so a user can identify them without reading dates.
- **FR-006**: The overdue determination MUST be re-evaluated every time the todo list is
  rendered, based on the current date, rather than being fixed at todo-creation time.
- **FR-007**: The overdue indicator MUST remain accurate and visible in any view where an
  individual todo's details are shown (e.g., an edit view), consistent with the list view.
- **FR-008**: The feature MUST include automated tests covering the overdue-determination logic
  (unit tests) and its visual display (component/integration tests), following the existing Jest
  patterns already used in this repository.
- **FR-009**: The feature MUST NOT change the existing todo list ordering (creation date,
  newest first); overdue todos are marked in place, not moved or grouped.

### Key Entities

- **Todo**: Existing entity representing a single task; relevant existing attributes are
  `title`, `dueDate` (optional), and `completed` status. This feature adds a derived, computed
  "overdue" state based on `dueDate` and `completed` — it is not a new stored field.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can identify all overdue todos in their list within 2 seconds of viewing it,
  without reading or comparing any due date text.
- **SC-002**: 100% of incomplete todos with a due date earlier than the current date display the
  overdue indicator; 0% of completed todos or todos without a due date display it.
- **SC-003**: The overdue determination logic has automated test coverage for all cases described
  in the Edge Cases section (no due date, due today, due yesterday, completed with past due date).

## Assumptions

- Due dates are stored and compared as calendar dates without a time-of-day component, consistent
  with the existing todo data model.
- "Current date" means the end user's local system date, consistent with how due dates are
  already entered and displayed elsewhere in the app.
- This feature only adds a computed/derived overdue state for display purposes; it does not
  change the todo data model, add new API endpoints, or add notifications/reminders (both
  explicitly out of scope per `docs/functional-requirements.md`).
- The existing single-column, single-user todo list (per `docs/functional-requirements.md` and
  `docs/ui-guidelines.md`) remains the only view affected; no new pages are introduced.

