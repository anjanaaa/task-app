import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Notification from './components/Notification';
import Login from './components/Login';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    tasks, 
    loading: tasksLoading, 
    error, 
    addTask: addTaskToDb, 
    toggleTask: toggleTaskInDb, 
    deleteTask: deleteTaskFromDb,
    markTaskExpired 
  } = useTasks();
  
  const [expiredTasks, setExpiredTasks] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

  const addTask = async (taskData) => {
    try {
      await addTaskToDb(taskData);
      addNotification(`Task "${taskData.title}" added successfully!`, 'success');
    } catch (err) {
      addNotification(`Error adding task: ${err.message}`, 'error');
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      // Task is being completed
      addNotification(`Great job! You completed "${task.title}"`, 'success');
    }
    
    try {
      await toggleTaskInDb(id);
    } catch (err) {
      addNotification(`Error updating task: ${err.message}`, 'error');
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskFromDb(id);
      // Remove from expired tasks set when deleted
      setExpiredTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      addNotification('Task deleted successfully!', 'success');
    } catch (err) {
      addNotification(`Error deleting task: ${err.message}`, 'error');
    }
  };

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleTaskExpired = useCallback(async (taskId, taskTitle) => {
    // Only alert if this task hasn't expired before and isn't completed
    const task = tasks.find(t => t.id === taskId);
    if (!expiredTasks.has(taskId) && task && !task.completed) {
      setExpiredTasks(prev => new Set([...prev, taskId]));
      
      // Show custom notification
      addNotification(`Time's up! Your task "${taskTitle}" has expired.`, 'expired');
      
      // Also show browser alert as backup
      alert(`⏰ Time's up! Your task "${taskTitle}" has expired.`);
      
      // Mark task as expired in database
      try {
        await markTaskExpired(taskId);
      } catch (err) {
        console.error('Error marking task as expired:', err);
      }
    }
  }, [tasks, expiredTasks, markTaskExpired]);

  // Check for expired tasks periodically
  useEffect(() => {
    const checkExpired = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.time_limit && !task.completed && !task.has_expired) {
          if (now >= new Date(task.time_limit)) {
            handleTaskExpired(task.id, task.title);
          }
        }
      });
    };

    const interval = setInterval(checkExpired, 1000);
    return () => clearInterval(interval);
  }, [tasks, expiredTasks, handleTaskExpired]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Tasks Manager</h1>
          <p>Loading...</p>
        </header>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Tasks Manager</h1>
          <p style={{ color: 'red' }}>Error: {error}</p>
          <p>Please check your Supabase configuration.</p>
        </header>
      </div>
    );
  }

  if (tasksLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Tasks Manager</h1>
          <p>Loading your tasks...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Tasks Manager</h1>
            <p>Add tasks with optional time limits and track your progress</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button className="signout-btn" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="App-main">
        <div className="container">
          <TaskForm onAddTask={addTask} />
          <TaskList 
            tasks={tasks} 
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </main>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
