import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    signInWithGoogle: jest.fn(),
    loading: false
  })
}));

describe('Login Component', () => {
  test('renders login header', () => {
    render(<Login />);
    
    expect(screen.getByText('🎯 Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Organize your life, one task at a time')).toBeInTheDocument();
  });

  test('renders feature list', () => {
    render(<Login />);
    
    expect(screen.getByText('Create and manage tasks')).toBeInTheDocument();
    expect(screen.getByText('Set time limits')).toBeInTheDocument();
    expect(screen.getByText('Real-time updates')).toBeInTheDocument();
    expect(screen.getByText('Secure cloud storage')).toBeInTheDocument();
  });

  test('renders Google sign-in button', () => {
    render(<Login />);
    
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('renders footer message', () => {
    render(<Login />);
    
    expect(screen.getByText('Your data is securely stored and private')).toBeInTheDocument();
  });
});
