# Phase 1 Data Model: Support for Overdue Todo Items

No new persisted entities, fields, or database migrations are introduced by this feature. It adds
one derived/computed concept on top of the existing `Todo` entity.

## Todo (existing entity — unchanged shape)

Source of truth: `packages/backend/src/services/todoService.js` (SQLite `todos` table) and the
shape already consumed by `packages/frontend/src/services/todoService.js`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | number | Existing, unchanged |
| `title` | string | Existing, unchanged (max 255 chars) |
| `dueDate` | string (`YYYY-MM-DD`) \| `null` | Existing, unchanged |
| `completed` | 0 \| 1 | Existing, unchanged |
| `createdAt` | ISO datetime string | Existing, unchanged |

## Overdue (derived, computed — not persisted)

Not a stored field. Computed at render time in the frontend from the `Todo` fields above.

- **Definition**: `overdue = !completed && dueDate != null && dueDate < today`
- **Inputs**: `todo.dueDate`, `todo.completed`, and the current date (`today`, browser-local,
  defaulting to `new Date()` unless a reference date is explicitly passed for testing).
- **Lifecycle**: Recomputed on every render; never cached or written back to the todo record or
  the API. A todo transitions in/out of `overdue` purely as a function of the current date and
  its existing fields — no explicit state transition or migration is needed.
- **Relationships**: One-to-one, ephemeral relationship to a single `Todo`; has no independent
  identity, validation rules, or storage of its own.
