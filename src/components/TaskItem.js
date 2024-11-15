import React from 'react';

function TaskItem({ task }) {
  return (
    <div className="task-item">
      <p><strong>{task.name}</strong>: {task.description}</p>
    </div>
  );
}

export default TaskItem;
