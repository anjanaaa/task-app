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

  test('allows typing in task title input', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    fireEvent.change(titleInput, { target: { value: 'New test task' } });
    
    expect(titleInput).toHaveValue('New test task');
  });

  test('shows time limit input when checkbox is checked', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const checkbox = screen.getByLabelText('Add time limit');
    fireEvent.click(checkbox);
    
    expect(screen.getByLabelText('Time Limit (minutes):')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter time in minutes...')).toBeInTheDocument();
  });

  test('hides time limit input when checkbox is unchecked', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const checkbox = screen.getByLabelText('Add time limit');
    
    // Check and then uncheck
    fireEvent.click(checkbox);
    expect(screen.getByLabelText('Time Limit (minutes):')).toBeInTheDocument();
    
    fireEvent.click(checkbox);
    expect(screen.queryByLabelText('Time Limit (minutes):')).not.toBeInTheDocument();
  });

  test('allows typing in time limit input', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    // Enable time limit
    const checkbox = screen.getByLabelText('Add time limit');
    fireEvent.click(checkbox);
    
    // Type in time limit
    const timeInput = screen.getByPlaceholderText('Enter time in minutes...');
    fireEvent.change(timeInput, { target: { value: '30' } });
    
    expect(timeInput).toHaveValue(30);
  });

  test('submits form with task title only', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    fireEvent.change(titleInput, { target: { value: 'Test task' } });
    fireEvent.click(submitButton);
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Test task',
      timeLimit: null
    });
  });

  test('submits form with task title and time limit', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const checkbox = screen.getByLabelText('Add time limit');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    fireEvent.change(titleInput, { target: { value: 'Timed task' } });
    fireEvent.click(checkbox);
    
    const timeInput = screen.getByPlaceholderText('Enter time in minutes...');
    fireEvent.change(timeInput, { target: { value: '45' } });
    
    fireEvent.click(submitButton);
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Timed task',
      timeLimit: 45
    });
  });

  test('does not submit with empty title', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    fireEvent.click(submitButton);
    
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  test('does not submit with whitespace-only title', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(submitButton);
    
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  test('clears form after successful submission', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const checkbox = screen.getByLabelText('Add time limit');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    // Fill form
    fireEvent.change(titleInput, { target: { value: 'Test task' } });
    fireEvent.click(checkbox);
    
    const timeInput = screen.getByPlaceholderText('Enter time in minutes...');
    fireEvent.change(timeInput, { target: { value: '30' } });
    
    // Submit
    fireEvent.click(submitButton);
    
    // Check form is cleared
    expect(titleInput).toHaveValue('');
    expect(checkbox).not.toBeChecked();
    expect(screen.queryByPlaceholderText('Enter time in minutes...')).not.toBeInTheDocument();
  });

  test('submits form on Enter key press', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const form = titleInput.closest('form');
    
    fireEvent.change(titleInput, { target: { value: 'Test task' } });
    fireEvent.submit(form);
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Test task',
      timeLimit: null
    });
  });

  test('handles time limit checkbox with no time value', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const checkbox = screen.getByLabelText('Add time limit');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    fireEvent.change(titleInput, { target: { value: 'Test task' } });
    fireEvent.click(checkbox);
    // Don't enter time limit value
    fireEvent.click(submitButton);
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Test task',
      timeLimit: null
    });
  });

  test('trims whitespace from task title', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    
    const titleInput = screen.getByPlaceholderText('Enter your task...');
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    
    fireEvent.change(titleInput, { target: { value: '  Trimmed task  ' } });
    fireEvent.click(submitButton);
    
    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Trimmed task',
      timeLimit: null
    });
  });
});
