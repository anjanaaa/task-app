import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from './TaskList';

// Mock TaskItem component to simplify testing
jest.mock('./TaskItem', () => {
  return function MockTaskItem({ task, onToggle, onDelete }) {
    return (
      <div data-testid={`task-${task.id}`}>
        <span>{task.title}</span>
        <button onClick={() => onToggle(task.id)}>Toggle</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
        <span className={task.completed ? 'completed' : 'active'}>{task.completed ? 'Completed' : 'Active'}</span>
      </div>
    );
  };
});

describe('TaskList Component', () => {
  const mockOnToggleTask = jest.fn();
  const mockOnDeleteTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleTasks = [
    {
      id: 1,
      title: 'Active Task 1',
      completed: false,
      has_expired: false,
      time_limit: null,
      created_at: '2024-01-01T10:00:00Z'
    },
    {
      id: 2,
      title: 'Active Task 2',
      completed: false,
      has_expired: false,
      time_limit: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      created_at: '2024-01-01T11:00:00Z'
    },
    {
      id: 3,
      title: 'Completed Task 1',
      completed: true,
      has_expired: false,
      time_limit: null,
      created_at: '2024-01-01T09:00:00Z'
    },
    {
      id: 4,
      title: 'Completed Task 2',
      completed: true,
      has_expired: false,
      time_limit: null,
      created_at: '2024-01-01T08:00:00Z'
    }
  ];

  test('renders empty state when no tasks', () => {
    render(
      <TaskList 
        tasks={[]} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    expect(screen.getByText('No tasks yet. Add one above to get started!')).toBeInTheDocument();
  });

  test('renders all tasks when provided', () => {
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    expect(screen.getByText('Active Task 1')).toBeInTheDocument();
    expect(screen.getByText('Active Task 2')).toBeInTheDocument();
    expect(screen.getByText('Completed Task 1')).toBeInTheDocument();
    expect(screen.getByText('Completed Task 2')).toBeInTheDocument();
  });

  test('organizes tasks into active and completed sections', () => {
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    // Check section headers
    expect(screen.getByText('Active Tasks (2)')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks (2)')).toBeInTheDocument();
    
    // Verify tasks are in correct sections
    const activeTasks = screen.getAllByText('Active');
    const completedTasks = screen.getAllByText('Completed');
    
    expect(activeTasks).toHaveLength(2);
    expect(completedTasks).toHaveLength(2);
  });

  test('shows only active tasks when no completed tasks', () => {
    const activeTasks = sampleTasks.filter(task => !task.completed);
    
    render(
      <TaskList 
        tasks={activeTasks} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    expect(screen.getByText('Active Tasks (2)')).toBeInTheDocument();
    expect(screen.queryByText(/Completed Tasks/)).not.toBeInTheDocument();
  });

  test('shows only completed tasks when no active tasks', () => {
    const completedTasks = sampleTasks.filter(task => task.completed);
    
    render(
      <TaskList 
        tasks={completedTasks} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    expect(screen.getByText('Completed Tasks (2)')).toBeInTheDocument();
    expect(screen.queryByText(/Active Tasks/)).not.toBeInTheDocument();
  });

  test('passes correct props to TaskItem components', () => {
    render(
      <TaskList 
        tasks={[sampleTasks[0]]} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    // Check that TaskItem is rendered with correct data
    expect(screen.getByTestId('task-1')).toBeInTheDocument();
    expect(screen.getByText('Active Task 1')).toBeInTheDocument();
  });

  test('forwards onToggle calls to parent component', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={[sampleTasks[0]]} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    const toggleButton = screen.getByText('Toggle');
    await user.click(toggleButton);
    
    expect(mockOnToggleTask).toHaveBeenCalledWith(1);
  });

  test('forwards onDelete calls to parent component', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={[sampleTasks[0]]} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(mockOnDeleteTask).toHaveBeenCalledWith(1);
  });

  test('counts tasks correctly in section headers', () => {
    const tasksWithDifferentCounts = [
      ...sampleTasks,
      {
        id: 5,
        title: 'Active Task 3',
        completed: false,
        has_expired: false,
        time_limit: null,
        created_at: '2024-01-01T12:00:00Z'
      }
    ];
    
    render(
      <TaskList 
        tasks={tasksWithDifferentCounts} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    expect(screen.getByText('Active Tasks (3)')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks (2)')).toBeInTheDocument();
  });

  test('handles single task correctly', () => {
    render(
      <TaskList 
        tasks={[sampleTasks[0]]} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    expect(screen.getByText('Active Tasks (1)')).toBeInTheDocument();
    expect(screen.queryByText(/Completed Tasks/)).not.toBeInTheDocument();
  });

  test('renders tasks in correct order (newest first)', () => {
    // TaskList should maintain the order passed from parent
    const orderedTasks = [
      {
        id: 2,
        title: 'Newer Task',
        completed: false,
        has_expired: false,
        time_limit: null,
        created_at: '2024-01-01T12:00:00Z'
      },
      {
        id: 1,
        title: 'Older Task',
        completed: false,
        has_expired: false,
        time_limit: null,
        created_at: '2024-01-01T10:00:00Z'
      }
    ];
    
    render(
      <TaskList 
        tasks={orderedTasks} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    const taskElements = screen.getAllByTestId(/task-/);
    expect(taskElements[0]).toHaveAttribute('data-testid', 'task-2');
    expect(taskElements[1]).toHaveAttribute('data-testid', 'task-1');
  });

  test('updates when tasks prop changes', () => {
    const { rerender } = render(
      <TaskList 
        tasks={[sampleTasks[0]]} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    expect(screen.getByText('Active Tasks (1)')).toBeInTheDocument();
    
    rerender(
      <TaskList 
        tasks={sampleTasks} 
        onToggleTask={mockOnToggleTask} 
        onDeleteTask={mockOnDeleteTask} 
      />
    );
    
    expect(screen.getByText('Active Tasks (2)')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks (2)')).toBeInTheDocument();
  });
});
