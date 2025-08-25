import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      timeLimit: timeLimitEnabled && timeLimit ? parseInt(timeLimit) : null
    };

    onAddTask(taskData);
    setTitle('');
    setTimeLimit('');
    setTimeLimitEnabled(false);
  };

  return (
    <div className="task-form">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your task..."
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={timeLimitEnabled}
              onChange={(e) => setTimeLimitEnabled(e.target.checked)}
            />
            Add time limit
          </label>
        </div>

        {timeLimitEnabled && (
          <div className="form-group">
            <label htmlFor="timeLimit">Time Limit (minutes):</label>
            <input
              type="number"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="Enter time in minutes..."
              min="1"
            />
          </div>
        )}

        <button type="submit" className="add-button">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
