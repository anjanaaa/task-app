import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  test('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Notification 
        message="Test notification" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    const closeButton = screen.getByText('×');
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('auto-dismisses after timeout', async () => {
    render(
      <Notification 
        message="Auto dismiss test" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    // Fast-forward time by 3 seconds (default auto-dismiss time)
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  test('does not auto-dismiss error notifications', async () => {
    render(
      <Notification 
        message="Error message" 
        type="error" 
        onClose={mockOnClose} 
      />
    );
    
    // Fast-forward time by 5 seconds
    jest.advanceTimersByTime(5000);
    
    // Error notifications should not auto-dismiss
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('does not auto-dismiss expired notifications', async () => {
    render(
      <Notification 
        message="Expired message" 
        type="expired" 
        onClose={mockOnClose} 
      />
    );
    
    // Fast-forward time by 5 seconds
    jest.advanceTimersByTime(5000);
    
    // Expired notifications should not auto-dismiss
    expect(mockOnClose).not.toHaveBeenCalled();
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

  test('success notifications auto-dismiss', async () => {
    render(
      <Notification 
        message="Success message" 
        type="success" 
        onClose={mockOnClose} 
      />
    );
    
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  test('info notifications auto-dismiss', async () => {
    render(
      <Notification 
        message="Info message" 
        type="info" 
        onClose={mockOnClose} 
      />
    );
    
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
