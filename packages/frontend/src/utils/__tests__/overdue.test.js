import { isOverdue } from '../overdue';

describe('isOverdue', () => {
  const REFERENCE_DATE = new Date('2025-06-15T10:00:00');

  it('returns false when the todo has no due date', () => {
    const todo = { dueDate: null, completed: 0 };
    expect(isOverdue(todo, REFERENCE_DATE)).toBe(false);
  });

  it('returns false when the due date is today', () => {
    const todo = { dueDate: '2025-06-15', completed: 0 };
    expect(isOverdue(todo, REFERENCE_DATE)).toBe(false);
  });

  it('returns true when the due date is yesterday', () => {
    const todo = { dueDate: '2025-06-14', completed: 0 };
    expect(isOverdue(todo, REFERENCE_DATE)).toBe(true);
  });

  it('returns false when the due date is tomorrow', () => {
    const todo = { dueDate: '2025-06-16', completed: 0 };
    expect(isOverdue(todo, REFERENCE_DATE)).toBe(false);
  });

  it('returns false when a past-due todo is marked complete', () => {
    const todo = { dueDate: '2025-06-14', completed: 1 };
    expect(isOverdue(todo, REFERENCE_DATE)).toBe(false);
  });

  it('returns true one day after the due date, using an explicit later reference date', () => {
    const todo = { dueDate: '2025-06-14', completed: 0 };
    const oneDayLater = new Date('2025-06-15T10:00:00');
    expect(isOverdue(todo, oneDayLater)).toBe(true);
  });
});
