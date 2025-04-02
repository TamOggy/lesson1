import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');


  const addTask = () => {
    if (taskInput.trim() !== "") {
      setTasks([...tasks, taskInput]);
      setTaskInput(""); 
    }
  };

  const deleteTask = (taskToDelete) => {
    setTasks(tasks.filter(task => task !== taskToDelete));
  };

  return (
    <div className="container">
      <h1 className="content">To-Do List</h1>
      <input 
        className="inputask" 
        type="text" 
        placeholder="Add new task ?" 
        value={taskInput} 
        onChange={(e) => setTaskInput(e.target.value)} 
      />
      <button className="addTask" onClick={addTask}>Add Task</button>
      <ul className="taskList">
        {tasks.map((task, index) => (
          <li key={index}>
            {task}
            <button className="delete" onClick={() => deleteTask(task)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
