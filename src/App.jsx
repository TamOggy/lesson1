import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("Low Priority");
  const [category, setCategory] = useState("job");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskId, setEditedTaskId] = useState(null);
  const [editedTaskInput, setEditedTaskInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const addTask = () => {
    if (taskInput.trim() !== "") {
      const newTask = {
        id: Date.now(),
        task: taskInput,
        completed: false,
        priority,
        category,
      };
      setTasks((previousTasks) => [...previousTasks, newTask]);
      setTaskInput("");
      setPriority("Low Priority");
      setCategory("job");
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const toggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const editTask = (taskId, taskText) => {
    setTaskToEdit({ id: taskId, task: taskText });
    setShowConfirmation(true);
  };

  const saveEditedTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskToEdit.id ? { ...task, task: editedTaskInput } : task
    );
    setTasks(updatedTasks);
    setIsEditing(false);
    setEditedTaskId(null);
    setEditedTaskInput("");
    setShowConfirmation(false);
    setTaskToEdit(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedTaskId(null);
    setEditedTaskInput("");
    setShowConfirmation(false);
    setTaskToEdit(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const taskText = task.task.toLowerCase();
    const search = debouncedSearchTerm.toLowerCase();
    const priorityMatch =
      filterPriority === "All" || task.priority === filterPriority;
    const categoryMatch =
      filterCategory === "All" || task.category === filterCategory;

    return taskText.includes(search) && priorityMatch && categoryMatch;
  });

  const ConfirmationPopup = ({ task, onConfirm, onCancel }) => {
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <p>Bạn có chắc chắn muốn chỉnh sửa task này?</p>
          <input
            type="text"
            value={editedTaskInput}
            onChange={(e) => setEditedTaskInput(e.target.value)}
            placeholder="Chỉnh sửa task..."
            autoFocus
          />
          <div className="popup-buttons">
            <button onClick={onConfirm}>Lưu</button>
            <button onClick={onCancel}>Hủy</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`container ${isDarkMode ? "dark" : ""}`}>
      <div className="content">
        <h1 className="name-list">TO-DO LIST</h1>
        <button className="dark-mode" onClick={toggleDarkMode}>
          {isDarkMode ? (
    <i className="fa-solid fa-sun"></i> 
  ) : (
    <i className="fa-solid fa-moon"></i>
  )}
        </button>
      </div>
      <div className="container-body">
        <input
          className="inputask"
          type="text"
          placeholder="Add new task ?"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <div className="option-content">
          <select
            className="option-content-task"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low Priority">Low Priority</option>
            <option value="Medium Priority">Medium Priority</option>
            <option value="High Priority">High Priority</option>
          </select>
          <select
            className="option-content-task"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="job">Job</option>
            <option value="Study">Study</option>
            <option value="Individual">Individual</option>
          </select>
        </div>
        <button className="addTask" onClick={addTask}>
          Add
        </button>
      </div>
      <div className="search-content">
        <input
          className="searchtask"
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="option-content-task"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Low Priority">Low Priority</option>
          <option value="Medium Priority">Medium Priority</option>
          <option value="High Priority">High Priority</option>
        </select>
        <select
          className="option-content-task"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Category</option>
          <option value="job">Job</option>
          <option value="Study">Study</option>
          <option value="Individual">Individual</option>
        </select>
      </div>
      <ul className="taskList">
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              className="checkbox-list"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />
            <div className="taskinfo-category">
              {isEditing && editedTaskId === task.id ? (
                <div>
                  <input
                    type="text"
                    value={editedTaskInput}
                    onChange={(e) => setEditedTaskInput(e.target.value)}
                    autoFocus
                  />
                </div>
              ) : (
                <p
                  className={`taskList-info ${
                    task.completed ? "completed" : ""
                  }`}
                >
                  {task.task}
                </p>
              )}
              <p className="task-category">{task.category}</p>
            </div>
            <p
              className={`task-priority ${
                task.priority === "Low Priority"
                  ? "low-priority"
                  : task.priority === "Medium Priority"
                  ? "medium-priority"
                  : "high-priority"
              }`}
            >
              {task.priority}
            </p>
            <div className="button-task-li">
              <button
                className="edit"
                onClick={() => editTask(task.id, task.task)}
              >
                <i className="fa-solid fa-pen"></i>
              </button>
              <button className="delete" onClick={() => deleteTask(task.id)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showConfirmation && (
  <ConfirmationPopup
    task={taskToEdit}
    onConfirm={saveEditedTask}
    onCancel={cancelEdit}
    editedTaskInput={editedTaskInput}
    setEditedTaskInput={setEditedTaskInput}
  />
)}
    </div>
  );
}

export default App;
