# Quickstart: Validating Overdue Todo Items

## Prerequisites

- Dependencies installed: `npm install` at the repository root
- No environment variables or backend data setup required beyond the existing in-memory/SQLite
  seed data

## Run the app

```bash
npm start
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3030/api/items

## Manual validation scenarios

1. **Overdue badge appears**
   - Create a todo with a due date in the past (e.g., yesterday) and leave it incomplete.
   - Expected: the todo card shows an "Overdue" badge in the danger color next to its due date.

2. **Due today is not overdue**
   - Create a todo with today's date as the due date.
   - Expected: no "Overdue" badge is shown.

3. **Completed todos are never overdue**
   - Create a todo with a past due date, then mark it complete (checkbox).
   - Expected: the "Overdue" badge disappears immediately after toggling complete.

4. **No due date, never overdue**
   - Create a todo with no due date set.
   - Expected: no "Overdue" badge is ever shown, regardless of time passing.

5. **List order is unaffected**
   - With a mix of overdue and non-overdue todos, confirm the list order is still by creation
     date (newest first), per FR-009 — overdue todos are not moved or grouped.

6. **Edit view shows overdue state**
   - Open an overdue todo for editing.
   - Expected: the overdue indicator remains visible/accurate while editing (per FR-007).

## Automated validation

```bash
# Frontend unit + component tests (includes new overdue.test.js and TodoCard.test.js additions)
npm run test:frontend

# Full suite
npm test
```

Expected: all existing tests continue to pass, plus new passing tests for:
- `packages/frontend/src/utils/__tests__/overdue.test.js`
- Overdue-related cases added to `packages/frontend/src/components/__tests__/TodoCard.test.js`
