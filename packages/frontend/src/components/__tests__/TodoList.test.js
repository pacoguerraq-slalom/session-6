import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    const { container } = render(
      <TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />
    );
    
    const cards = container.querySelectorAll('.todo-card');
    expect(cards).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });

  it('should preserve todo order even when the list contains overdue items', () => {
    const todosWithOverdue = [
      { id: 1, title: 'Newest', dueDate: null, completed: 0, createdAt: '2025-11-03T00:00:00Z' },
      { id: 2, title: 'Overdue Todo', dueDate: '2020-01-01', completed: 0, createdAt: '2025-11-02T00:00:00Z' },
      { id: 3, title: 'Oldest', dueDate: null, completed: 0, createdAt: '2025-11-01T00:00:00Z' },
    ];

    const { container } = render(
      <TodoList todos={todosWithOverdue} {...mockHandlers} isLoading={false} />
    );

    const titles = Array.from(container.querySelectorAll('.todo-title')).map((el) => el.textContent);
    expect(titles).toEqual(['Newest', 'Overdue Todo', 'Oldest']);
  });
});
