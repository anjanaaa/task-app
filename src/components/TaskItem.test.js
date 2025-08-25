import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem';

describe('TaskItem Component', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const currentTime = new Date('2024-01-01T12:00:00Z');

  const basicTask = {
    id: 1,
    title: 'Test Task',
    completed: false,
    has_expired: false,
    time_limit: null,
    created_at: '2024-01-01T10:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic task information', () => {
    render(
      <TaskItem 
        task={basicTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByTitle('Delete task')).toBeInTheDocument();
  });

  test('displays task as not completed by default', () => {
    render(
      <TaskItem 
        task={basicTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    const taskItem = screen.getByText('Test Task').parentElement.parentElement.parentElement;
    expect(taskItem).not.toHaveClass('completed');
  });

  test('displays completed task correctly', () => {
    const completedTask = { ...basicTask, completed: true };
    
    render(
      <TaskItem 
        task={completedTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    
    const taskItem = screen.getByText('Test Task').parentElement.parentElement.parentElement;
    expect(taskItem).toHaveClass('completed');
  });

  test('calls onToggle when checkbox is clicked', () => {
    render(
      <TaskItem 
        task={basicTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <TaskItem 
        task={basicTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const deleteButton = screen.getByTitle('Delete task');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('displays remaining time for task with time limit', () => {
    const timedTask = {
      ...basicTask,
      time_limit: new Date(currentTime.getTime() + 5 * 60 * 1000).toISOString() // 5 minutes from now
    };
    
    render(
      <TaskItem 
        task={timedTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText(/5m 0s remaining/)).toBeInTheDocument();
    expect(screen.getByText(/⏱️/)).toBeInTheDocument();
  });

  test('displays expired message for expired task', () => {
    const expiredTask = {
      ...basicTask,
      time_limit: new Date(currentTime.getTime() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      has_expired: true
    };
    
    render(
      <TaskItem 
        task={expiredTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText(/Time expired!/)).toBeInTheDocument();
    expect(screen.getByText(/⏰/)).toBeInTheDocument();
    
    const taskItem = screen.getByText('Test Task').parentElement.parentElement.parentElement;
    expect(taskItem).toHaveClass('expired');
  });

  test('formats time correctly for hours and minutes', () => {
    const timedTask = {
      ...basicTask,
      time_limit: new Date(currentTime.getTime() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000).toISOString() // 2h 30m 45s
    };
    
    render(
      <TaskItem 
        task={timedTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText(/2h 30m 45s remaining/)).toBeInTheDocument();
  });

  test('formats time correctly for minutes and seconds only', () => {
    const timedTask = {
      ...basicTask,
      time_limit: new Date(currentTime.getTime() + 15 * 60 * 1000 + 30 * 1000).toISOString() // 15m 30s
    };
    
    render(
      <TaskItem 
        task={timedTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText(/15m 30s remaining/)).toBeInTheDocument();
  });

  test('formats time correctly for seconds only', () => {
    const timedTask = {
      ...basicTask,
      time_limit: new Date(currentTime.getTime() + 45 * 1000).toISOString() // 45s
    };
    
    render(
      <TaskItem 
        task={timedTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText(/45s remaining/)).toBeInTheDocument();
  });

  test('formats created time correctly', () => {
    render(
      <TaskItem 
        task={basicTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Check that created time is displayed (format may vary by locale)
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  test('does not display time limit info for task without time limit', () => {
    render(
      <TaskItem 
        task={basicTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.queryByText(/remaining/)).not.toBeInTheDocument();
    expect(screen.queryByText('⏱️')).not.toBeInTheDocument();
    expect(screen.queryByText('⏰')).not.toBeInTheDocument();
  });

  test('applies expired class when task has expired', () => {
    const expiredTask = {
      ...basicTask,
      time_limit: new Date(currentTime.getTime() - 1000).toISOString(),
      has_expired: true
    };
    
    render(
      <TaskItem 
        task={expiredTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const taskItem = screen.getByText('Test Task').parentElement.parentElement.parentElement;
    expect(taskItem).toHaveClass('expired');
  });

  test('applies both completed and expired classes when appropriate', () => {
    const completedExpiredTask = {
      ...basicTask,
      completed: true,
      time_limit: new Date(currentTime.getTime() - 1000).toISOString(),
      has_expired: true
    };
    
    render(
      <TaskItem 
        task={completedExpiredTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const taskItem = screen.getByText('Test Task').parentElement.parentElement.parentElement;
    expect(taskItem).toHaveClass('completed');
    expect(taskItem).toHaveClass('expired');
  });

  test('handles edge case of exactly expired time', () => {
    const exactlyExpiredTask = {
      ...basicTask,
      time_limit: currentTime.toISOString(), // Exactly now
      has_expired: false // Not marked as expired yet
    };
    
    render(
      <TaskItem 
        task={exactlyExpiredTask} 
        currentTime={currentTime} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText(/Time expired!/)).toBeInTheDocument();
    
    const taskItem = screen.getByText('Test Task').parentElement.parentElement.parentElement;
    expect(taskItem).toHaveClass('expired');
  });
});
