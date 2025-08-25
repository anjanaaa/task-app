import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch user-specific tasks
  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTasks(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add a new task
  const addTask = async (taskData) => {
    if (!user) {
      throw new Error('User must be authenticated to add tasks');
    }

    try {
      const newTask = {
        title: taskData.title,
        time_limit: taskData.timeLimit ? new Date(Date.now() + taskData.timeLimit * 60 * 1000).toISOString() : null,
        completed: false,
        has_expired: false,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding task:', err);
      throw err;
    }
  };

  // Update task (toggle completion, mark as expired, etc.)
  const updateTask = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id ? data : task
      ));
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  // Toggle task completion
  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask(id, { completed: !task.completed });
  };

  // Mark task as expired
  const markTaskExpired = async (id) => {
    await updateTask(id, { has_expired: true });
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchTasks();

    if (!user) {
      return;
    }

    // Subscribe to real-time changes for user-specific tasks
    const subscription = supabase
      .channel(`tasks-${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => prev.map(task => 
              task.id === payload.new.id ? payload.new : task
            ));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(task => task.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    markTaskExpired,
    fetchTasks
  };
};
