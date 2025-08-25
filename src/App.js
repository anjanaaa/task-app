import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Notification from './components/Notification';

function App() {
  const [tasks, setTasks] = useState([]);
  const [expiredTasks, setExpiredTasks] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      timeLimit: taskData.timeLimit ? new Date(Date.now() + taskData.timeLimit * 60 * 1000) : null,
      createdAt: new Date(),
      completed: false,
      hasExpired: false
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      // Task is being completed
      addNotification(`Great job! You completed "${task.title}"`, 'success');
    }
    
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    // Remove from expired tasks set when deleted
    setExpiredTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
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

  const handleTaskExpired = useCallback((taskId, taskTitle) => {
    // Only alert if this task hasn't expired before and isn't completed
    const task = tasks.find(t => t.id === taskId);
    if (!expiredTasks.has(taskId) && task && !task.completed) {
      setExpiredTasks(prev => new Set([...prev, taskId]));
      
      // Show custom notification
      addNotification(`Time's up! Your task "${taskTitle}" has expired.`, 'expired');
      
      // Also show browser alert as backup
      alert(`⏰ Time's up! Your task "${taskTitle}" has expired.`);
      
      // Mark task as expired in state
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, hasExpired: true } : t
      ));
    }
  }, [tasks, expiredTasks]);

  // Check for expired tasks periodically
  useEffect(() => {
    const checkExpired = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.timeLimit && !task.completed && !task.hasExpired) {
          if (now >= new Date(task.timeLimit)) {
            handleTaskExpired(task.id, task.title);
          }
        }
      });
    };

    const interval = setInterval(checkExpired, 1000);
    return () => clearInterval(interval);
  }, [tasks, expiredTasks, handleTaskExpired]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tasks Manager</h1>
        <p>Add tasks with optional time limits and track your progress</p>
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
