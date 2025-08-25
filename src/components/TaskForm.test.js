import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';

describe('TaskForm Component', () => {
  const mockOnAddTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form elements correctly', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Title:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your task...')).toBeInTheDocument();
    expect(screen.getByLabelText('Add time limit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });

  test('allows typing in task title input', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    await user.type(titleInput, 'New test task');
    
    expect(titleInput).toHaveValue('New test task');
  });

  test('shows time limit input when checkbox is checked', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const checkbox = screen.getByLabelText('Add time limit');
    await user.click(checkbox);
    
    expect(screen.getByLabelText('Time Limit (minutes):')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter time in minutes...')).toBeInTheDocument();
  });

  test('hides time limit input when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const checkbox = screen.getByLabelText('Add time limit');
    
    // Check and then uncheck
    await user.click(checkbox);
    expect(screen.getByLabelText('Time Limit (minutes):')).toBeInTheDocument();
    
    await user.click(checkbox);
    expect(screen.queryByLabelText('Time Limit (minutes):')).not.toBeInTheDocument();
  });

  test('allows typing in time limit input', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    // Enable time limit
    const checkbox = screen.getByLabelText('Add time limit');
    await user.click(checkbox);
    
    // Type in time limit
    const timeInput = screen.getByPlaceholderText('Enter time in minutes...');
    await user.type(timeInput, '30');
    
    expect(timeInput).toHaveValue(30);
  });

  test('submits form with task title only', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    await user.type(titleInput, 'Test task');
    await user.click(submitButton);
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Test task',
      timeLimit: null
    });
  });

  test('submits form with task title and time limit', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const checkbox = screen.getByLabelText('Add time limit');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    await user.type(titleInput, 'Timed task');
    await user.click(checkbox);
    
    const timeInput = screen.getByPlaceholderText('Enter time in minutes...');
    await user.type(timeInput, '45');
    
    await user.click(submitButton);
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Timed task',
      timeLimit: 45
    });
  });

  test('does not submit with empty title', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    await user.click(submitButton);
    
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  test('does not submit with whitespace-only title', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    await user.type(titleInput, '   ');
    await user.click(submitButton);
    
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  test('clears form after successful submission', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const checkbox = screen.getByLabelText('Add time limit');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    // Fill form
    await user.type(titleInput, 'Test task');
    await user.click(checkbox);
    
    const timeInput = screen.getByPlaceholderText('Enter time in minutes...');
    await user.type(timeInput, '30');
    
    // Submit
    await user.click(submitButton);
    
    // Check form is cleared
    expect(titleInput).toHaveValue('');
    expect(checkbox).not.toBeChecked();
    expect(screen.queryByPlaceholderText('Enter time in minutes...')).not.toBeInTheDocument();
  });

  test('submits form on Enter key press', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    
    await user.type(titleInput, 'Test task{enter}');
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Test task',
      timeLimit: null
    });
  });

  test('handles time limit checkbox with no time value', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const checkbox = screen.getByLabelText('Add time limit');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    await user.type(titleInput, 'Test task');
    await user.click(checkbox);
    // Don't enter time limit value
    await user.click(submitButton);
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Test task',
      timeLimit: null
    });
  });

  test('trims whitespace from task title', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    await user.type(titleInput, '  Trimmed task  ');
    await user.click(submitButton);
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Trimmed task',
      timeLimit: null
    });
  });
});
