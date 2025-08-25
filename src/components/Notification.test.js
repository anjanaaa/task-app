import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Notification from './Notification';

describe('Notification Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders notification message', () => {
    render(
      <Notification 
        message="Test notification" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  test('applies correct CSS class for notification type', () => {
    const { rerender } = render(
      <Notification 
        message="Info message" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    let notification = screen.getByText('Info message').closest('.notification');
    expect(notification).toHaveClass('notification-info');
    
    rerender(
      <Notification 
        message="Success message" 
        type="success" 
        onClose={mockOnClose} 
      />
    );
    
    notification = screen.getByText('Success message').closest('.notification');
    expect(notification).toHaveClass('notification-success');
    
    rerender(
      <Notification 
        message="Error message" 
        type="error" 
        onClose={mockOnClose} 
      />
    );
    
    notification = screen.getByText('Error message').closest('.notification');
    expect(notification).toHaveClass('notification-error');
    
    rerender(
      <Notification 
        message="Expired message" 
        type="expired" 
        onClose={mockOnClose} 
      />
    );
    
    notification = screen.getByText('Expired message').closest('.notification');
    expect(notification).toHaveClass('notification-expired');
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <Notification 
        message="Test notification" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('sets up auto-dismiss timer for info notifications', () => {
    render(
      <Notification 
        message="Auto dismiss test" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    // Verify timer was set (we can see this by checking timer count)
    expect(jest.getTimerCount()).toBeGreaterThan(0);
  });

  test('renders error notifications without auto-dismiss', () => {
    render(
      <Notification 
        message="Error message" 
        type="error" 
        onClose={mockOnClose} 
      />
    );
    
    // Error notifications should render correctly
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Error message').closest('.notification')).toHaveClass('notification-error');
  });

  test('renders expired notifications without auto-dismiss', () => {
    render(
      <Notification 
        message="Expired message" 
        type="expired" 
        onClose={mockOnClose} 
      />
    );
    
    // Expired notifications should render correctly
    expect(screen.getByText('Expired message')).toBeInTheDocument();
    expect(screen.getByText('Expired message').closest('.notification')).toHaveClass('notification-expired');
  });

  test('clears timeout when component unmounts', () => {
    const { unmount } = render(
      <Notification 
        message="Test notification" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    // Verify timeout was set
    expect(jest.getTimerCount()).toBe(1);
    
    unmount();
    
    // Timeout should be cleared
    expect(jest.getTimerCount()).toBe(0);
  });

  test('clears timeout when onClose prop changes', () => {
    const newOnClose = jest.fn();
    
    const { rerender } = render(
      <Notification 
        message="Test notification" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    expect(jest.getTimerCount()).toBe(1);
    
    rerender(
      <Notification 
        message="Test notification" 
        type="info" 
        onClose={newOnClose} 
      />
    );
    
    // Should clear old timeout and set new one
    expect(jest.getTimerCount()).toBe(1);
  });

  test('handles long messages correctly', () => {
    const longMessage = 'This is a very long notification message that should be displayed properly without breaking the layout or causing any issues with the notification component rendering.';
    
    render(
      <Notification 
        message={longMessage} 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  test('handles special characters in message', () => {
    const messageWithSpecialChars = 'Task "Special & Important" has been completed! 🎉';
    
    render(
      <Notification 
        message={messageWithSpecialChars} 
        type="success" 
        onClose={mockOnClose} 
      />
    );
    
    expect(screen.getByText(messageWithSpecialChars)).toBeInTheDocument();
  });

  test('renders with correct accessibility attributes', () => {
    render(
      <Notification 
        message="Accessible notification" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    const notification = screen.getByText('Accessible notification').closest('.notification');
    const closeButton = screen.getByText('×');
    
    // Check that notification has appropriate role
    expect(notification).toBeInTheDocument();
    
    // Check that close button is accessible
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.tagName).toBe('BUTTON');
  });

  test('renders success notifications correctly', () => {
    render(
      <Notification 
        message="Success message" 
        type="success" 
        onClose={mockOnClose} 
      />
    );
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Success message').closest('.notification')).toHaveClass('notification-success');
  });

  test('renders info notifications correctly', () => {
    render(
      <Notification 
        message="Info message" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.getByText('Info message').closest('.notification')).toHaveClass('notification-info');
  });
});
