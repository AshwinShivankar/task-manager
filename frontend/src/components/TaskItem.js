// src/components/TaskItem.js
import React from "react";

const TaskItem = ({ task, onToggleComplete, onDelete, onOpenModal }) => {
  return (
    <div
      className={`task-row ${task.completed ? "completed" : ""}`}
      onClick={() => onOpenModal(task)}
    >
      <div className="task-name-cell">{task.title}</div>
      <div className="task-status-cell">
        <span
          className={`status-badge ${
            task.completed ? "status-completed" : "status-pending"
          }`}
        >
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>
      <div className="task-actions-cell">
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal from opening
            onDelete(task.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
