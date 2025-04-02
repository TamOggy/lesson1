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
      const newTask = {
        id: Date.now(), 
        task: taskInput,
        completed: false,
      };
      setTasks((previousTasks) => [
        ...previousTasks,
        newTask,
      ]);
      setTaskInput("");
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const toggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
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
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              className="checkbox-list"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)} 
            />
            <p className={`taskList-info ${task.completed ? "completed" : ""}`}>
              {task.task}
            </p>
            <button className="delete" onClick={() => deleteTask(task.id)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
