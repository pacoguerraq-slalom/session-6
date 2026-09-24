/**
 * Determines whether a todo is overdue.
 *
 * A todo is overdue when it is incomplete, has a due date, and that due date
 * is strictly earlier than the reference date (a due date of "today" is not
 * yet overdue). Comparison is calendar-date only (no time-of-day component),
 * consistent with how dueDate is stored and displayed elsewhere in the app.
 *
 * @param {{dueDate?: string|null, completed?: number|boolean}} todo
 * @param {Date} [referenceDate] - Defaults to the current date/time.
 * @returns {boolean}
 */
export function isOverdue(todo, referenceDate = new Date()) {
  if (!todo || !todo.dueDate || todo.completed) {
    return false;
  }

  const due = new Date(`${todo.dueDate}T00:00:00`);
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  return due.getTime() < today.getTime();
}
