import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggleTask, onDeleteTask }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <h2>Your Tasks</h2>
        <div className="no-tasks">
          <p>No tasks yet. Add your first task above!</p>
        </div>
      </div>
    );
  }

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="task-list">
      <h2>Your Tasks</h2>
      
      {activeTasks.length > 0 && (
        <div className="tasks-section">
          <h3>Active Tasks ({activeTasks.length})</h3>
          <div className="tasks-container">
            {activeTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                currentTime={currentTime}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="tasks-section">
          <h3>Completed Tasks ({completedTasks.length})</h3>
          <div className="tasks-container">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                currentTime={currentTime}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
