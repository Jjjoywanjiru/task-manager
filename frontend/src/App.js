import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks (READ)
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    API.get("/")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  };

  // Create task (CREATE)
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    API.post("/", { title: newTask, completed: false })
      .then(() => {
        fetchTasks(); // refresh list
        setNewTask(""); // clear input
      })
      .catch((err) => console.error(err));
  };

  // Update task (UPDATE - toggle completed with PATCH)
  const toggleTask = (id, completed) => {
    API.patch(`/${id}/`, { completed: !completed })
      .then(() => fetchTasks())
      .catch((err) => console.error(err));
  };

  // Delete task (DELETE)
  const deleteTask = (id) => {
    API.delete(`/${id}/`)
      .then(() => fetchTasks())
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Task Manager Frontend</h1>

      {/* Add new task form */}
      <form onSubmit={addTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {Array.isArray(tasks) &&
          tasks.map((task) => (
            <li key={task.id}>
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
                onClick={() => toggleTask(task.id, task.completed)}
              >
                {task.title}
              </span>{" "}
              <button onClick={() => deleteTask(task.id)}>❌</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
