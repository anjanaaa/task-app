import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the useTasks hook with basic functionality
jest.mock('./hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    loading: false,
    error: null,
    addTask: jest.fn().mockResolvedValue({}),
    toggleTask: jest.fn().mockResolvedValue({}),
    deleteTask: jest.fn().mockResolvedValue({}),
    markTaskExpired: jest.fn().mockResolvedValue({})
  })
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders app title and description', () => {
    render(<App />);
    
    expect(screen.getByText('Tasks Manager')).toBeInTheDocument();
    expect(screen.getByText('Add tasks with optional time limits and track your progress')).toBeInTheDocument();
  });

  test('renders task form', () => {
    render(<App />);
    
    // Check if task form is rendered
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your task...')).toBeInTheDocument();
  });

  test('renders empty task list state', () => {
    render(<App />);
    
    // Should show empty state when no tasks
    expect(screen.getByText('No tasks yet. Add one above to get started!')).toBeInTheDocument();
  });
});
