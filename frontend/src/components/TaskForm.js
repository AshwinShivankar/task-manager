// src/components/TaskForm.js
import React, { useState } from "react";

const TaskForm = ({ onAddTask }) => {
  const [task, setTask] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.title.trim()) return;

    onAddTask(task);
    setTask({ title: "", description: "" });
  };

  return (
    <div className="task-form">
      <h3>Add New Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description (optional)</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
