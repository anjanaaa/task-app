import React from 'react';

const TaskItem = ({ task, currentTime, onToggle, onDelete }) => {
  const formatTimeRemaining = (timeLimit, currentTime) => {
    if (!timeLimit) return null;
    
    const timeDiff = new Date(timeLimit) - currentTime;
    
    if (timeDiff <= 0) {
      return { text: 'Time expired!', isExpired: true };
    }
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    let timeText = '';
    if (hours > 0) {
      timeText = `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      timeText = `${minutes}m ${seconds}s`;
    } else {
      timeText = `${seconds}s`;
    }
    
    return { text: timeText, isExpired: false };
  };

  const formatCreatedTime = (createdAt) => {
    return new Date(createdAt).toLocaleString();
  };

  const timeRemaining = formatTimeRemaining(task.timeLimit, currentTime);

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${timeRemaining?.isExpired || task.hasExpired ? 'expired' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <label className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            />
            <span className="checkmark"></span>
          </label>
          <h4 className="task-title">{task.title}</h4>
        </div>
        
        <div className="task-meta">
          <div className="task-info">
            <span className="created-time">Created: {formatCreatedTime(task.createdAt)}</span>
            {task.timeLimit && (
              <span className={`time-limit ${timeRemaining?.isExpired ? 'expired' : ''}`}>
                {timeRemaining?.isExpired ? (
                  <span className="expired-text">⏰ {timeRemaining.text}</span>
                ) : (
                  <span className="remaining-text">⏱️ {timeRemaining.text} remaining</span>
                )}
              </span>
            )}
          </div>
          
          <button 
            className="delete-button"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
