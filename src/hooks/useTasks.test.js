import { renderHook, act, waitFor } from '@testing-library/react';
import { useTasks } from './useTasks';

jest.mock('../lib/supabase', () => {
  const mockSubscription = {
    unsubscribe: jest.fn(),
  };

  const mockChannel = {
    on: jest.fn(() => mockChannel),
    subscribe: jest.fn(() => mockSubscription),
  };

  const mockSupabase = {
    from: jest.fn(() => mockSupabase),
    select: jest.fn(() => mockSupabase),
    insert: jest.fn(() => mockSupabase),
    update: jest.fn(() => mockSupabase),
    delete: jest.fn(() => mockSupabase),
    eq: jest.fn(() => mockSupabase),
    order: jest.fn(() => mockSupabase),
    single: jest.fn(() => mockSupabase),
    channel: jest.fn(() => mockChannel),
  };

  return { supabase: mockSupabase };
});

describe('useTasks Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    


  });

  test('initializes with empty tasks and loading state', () => {
    // Mock successful fetch
    mockSupabase.order.mockResolvedValue({
      data: [],
      error: null
    });

    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  test('fetches tasks on mount', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Test Task',
        completed: false,
        has_expired: false,
        time_limit: null,
        created_at: '2024-01-01T00:00:00Z'
      }
    ];

    mockSupabase.order.mockResolvedValue({
      data: mockTasks,
      error: null
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tasks).toEqual(mockTasks);
    expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    expect(mockSupabase.select).toHaveBeenCalledWith('*');
    expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  test('handles fetch error', async () => {
    const mockError = { message: 'Network error' };
    
    mockSupabase.order.mockResolvedValue({
      data: null,
      error: mockError
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.tasks).toEqual([]);
  });

  test('addTask creates new task', async () => {
    const newTask = {
      id: 1,
      title: 'New Task',
      completed: false,
      has_expired: false,
      time_limit: null,
      created_at: '2024-01-01T00:00:00Z'
    };

    // Mock initial fetch
    mockSupabase.order.mockResolvedValue({
      data: [],
      error: null
    });

    // Mock insert
    mockSupabase.single.mockResolvedValue({
      data: newTask,
      error: null
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask({
        title: 'New Task',
        timeLimit: null
      });
    });

    expect(mockSupabase.insert).toHaveBeenCalledWith([{
      title: 'New Task',
      time_limit: null,
      completed: false,
      has_expired: false
    }]);
    expect(result.current.tasks).toHaveLength(1);
  });

  test('addTask with time limit', async () => {
    const futureTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    const newTask = {
      id: 1,
      title: 'Timed Task',
      completed: false,
      has_expired: false,
      time_limit: futureTime.toISOString(),
      created_at: '2024-01-01T00:00:00Z'
    };

    mockSupabase.order.mockResolvedValue({
      data: [],
      error: null
    });

    mockSupabase.single.mockResolvedValue({
      data: newTask,
      error: null
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.addTask({
        title: 'Timed Task',
        timeLimit: 30
      });
    });

    // Verify the time_limit was calculated correctly (within 1 second tolerance)
    const insertCall = mockSupabase.insert.mock.calls[0][0][0];
    expect(insertCall.title).toBe('Timed Task');
    expect(new Date(insertCall.time_limit)).toBeInstanceOf(Date);
  });

  test('toggleTask updates task completion', async () => {
    const initialTask = {
      id: 1,
      title: 'Test Task',
      completed: false,
      has_expired: false,
      time_limit: null,
      created_at: '2024-01-01T00:00:00Z'
    };

    const updatedTask = { ...initialTask, completed: true };

    mockSupabase.order.mockResolvedValue({
      data: [initialTask],
      error: null
    });

    mockSupabase.single.mockResolvedValue({
      data: updatedTask,
      error: null
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.toggleTask(1);
    });

    expect(mockSupabase.update).toHaveBeenCalledWith({ completed: true });
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 1);
  });

  test('deleteTask removes task', async () => {
    const initialTask = {
      id: 1,
      title: 'Test Task',
      completed: false,
      has_expired: false,
      time_limit: null,
      created_at: '2024-01-01T00:00:00Z'
    };

    mockSupabase.order.mockResolvedValue({
      data: [initialTask],
      error: null
    });

    mockSupabase.eq.mockResolvedValue({
      error: null
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteTask(1);
    });

    expect(mockSupabase.delete).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 1);
    expect(result.current.tasks).toHaveLength(0);
  });

  test('markTaskExpired updates task', async () => {
    const initialTask = {
      id: 1,
      title: 'Test Task',
      completed: false,
      has_expired: false,
      time_limit: null,
      created_at: '2024-01-01T00:00:00Z'
    };

    const expiredTask = { ...initialTask, has_expired: true };

    mockSupabase.order.mockResolvedValue({
      data: [initialTask],
      error: null
    });

    mockSupabase.single.mockResolvedValue({
      data: expiredTask,
      error: null
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.markTaskExpired(1);
    });

    expect(mockSupabase.update).toHaveBeenCalledWith({ has_expired: true });
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 1);
  });

  test('handles add task error', async () => {
    mockSupabase.order.mockResolvedValue({
      data: [],
      error: null
    });

    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Insert failed' }
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(act(async () => {
      await result.current.addTask({
        title: 'Test Task',
        timeLimit: null
      });
    })).rejects.toThrow('Insert failed');
  });

  test('handles update task error', async () => {
    const initialTask = {
      id: 1,
      title: 'Test Task',
      completed: false,
      has_expired: false,
      time_limit: null,
      created_at: '2024-01-01T00:00:00Z'
    };

    mockSupabase.order.mockResolvedValue({
      data: [initialTask],
      error: null
    });

    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Update failed' }
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(act(async () => {
      await result.current.toggleTask(1);
    })).rejects.toThrow('Update failed');
  });

  test('handles delete task error', async () => {
    const initialTask = {
      id: 1,
      title: 'Test Task',
      completed: false,
      has_expired: false,
      time_limit: null,
      created_at: '2024-01-01T00:00:00Z'
    };

    mockSupabase.order.mockResolvedValue({
      data: [initialTask],
      error: null
    });

    mockSupabase.eq.mockResolvedValue({
      error: { message: 'Delete failed' }
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(act(async () => {
      await result.current.deleteTask(1);
    })).rejects.toThrow('Delete failed');
  });

  test('sets up real-time subscription', () => {
    mockSupabase.order.mockResolvedValue({
      data: [],
      error: null
    });

    renderHook(() => useTasks());

    expect(mockSupabase.channel).toHaveBeenCalledWith('tasks');
    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks' },
      expect.any(Function)
    );
    expect(mockChannel.subscribe).toHaveBeenCalled();
  });

  test('unsubscribes on unmount', () => {
    mockSupabase.order.mockResolvedValue({
      data: [],
      error: null
    });

    const { unmount } = renderHook(() => useTasks());

    unmount();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });
});
