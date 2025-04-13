// src/components/TaskModal.js
import React from "react";

const TaskModal = ({ task, onClose, onToggleComplete, onDelete }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.title}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <h3>Description:</h3>
          <p className="task-description">
            {task.description ? task.description : "No description provided."}
          </p>

          <div className="task-metadata">
            <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
            {task.updatedAt && (
              <p>Last Updated: {new Date(task.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className={`complete-btn ${task.completed ? "incomplete-btn" : ""}`}
            onClick={() => {
              onToggleComplete(task.id, !task.completed);
              onClose();
            }}
          >
            {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          </button>

          <button className="delete-btn" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
