// src/components/TaskList.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import TaskModal from "./TaskModal";
import { toast } from "react-toastify";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/tasks");
      setTasks(response.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setError("Failed to fetch tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await api.post("/api/tasks", newTask);
      setTasks((prev) => [...prev, response.data]);
      toast.success("Task added successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setError("Failed to add task");
        toast.error("Failed to add task");
      }
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await api.put(`/api/tasks/${id}`, { completed });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.data : task))
      );
      toast.success(`Task marked as ${completed ? "completed" : "incomplete"}`);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setError("Failed to update task");
        toast.error("Failed to update task");
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task deleted successfully!");
      setIsModalOpen(false);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setError("Failed to delete task");
        toast.error("Failed to delete task");
      }
    }
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <h2>Your Tasks</h2>
      {error && <div className="error">{error}</div>}

      <TaskForm onAddTask={addTask} />

      <div className="task-table">
        <div className="task-table-header">
          <div className="task-name-column">Task</div>
          <div className="task-status-column">Status</div>
          <div className="task-actions-column">Actions</div>
        </div>

        {tasks.length === 0 ? (
          <div className="no-tasks">
            No tasks yet. Add a new task to get started!
          </div>
        ) : (
          <div className="task-table-body">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onDelete={deleteTask}
                onOpenModal={openTaskModal}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={closeTaskModal}
          onToggleComplete={toggleComplete}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
};

export default TaskList;
