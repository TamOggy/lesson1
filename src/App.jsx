import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskInput.trim() !== "") {
      setTasks((previousTasks) => [
        ...previousTasks,
        { task: taskInput, completed: false },
      ]);
      setTaskInput("");
    }
  };

  const deleteTask = (taskToDelete) => {
    const updatedTasks = tasks.filter((task) => task.task !== taskToDelete);
    setTasks(updatedTasks);
  };

  const toggleComplete = (taskToToggle) => {
    const updatedTasks = tasks.map((task) =>
      task.task === taskToToggle
        ? { ...task, completed: !task.completed }
        : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="container">
      <h1 className="content">TO-DO LIST</h1>
      <div className="container-body">
        <input
          className="inputask"
          type="text"
          placeholder="Add new task ?"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button className="addTask" onClick={addTask}>
          Add
        </button>
      </div>
      <ul className="taskList">
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              className="checkbox-list"
              checked={task.completed}
              onChange={() => toggleComplete(task.task)}
            />
            <p className={`taskList-info ${task.completed ? "completed" : ""}`}>
              {task.task}
            </p>
            <button className="delete" onClick={() => deleteTask(task.task)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
