import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);      // ⬅ loading state
  const [error, setError] = useState(null);           // ⬅ error state

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/");
      // DRF might return { results: [...] } if pagination is on
      setTasks(res.data.results || res.data);
    } catch (e) {
      setError("Failed to load tasks. Check if the backend is running.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setError(null);
    try {
      await API.post("/", { title: newTask, completed: false });
      setNewTask("");
      await fetchTasks();
    } catch (e) {
      setError("Could not create task.");
      console.error(e);
    }
  };

  const toggleTask = async (id, completed) => {
    setError(null);
    try {
      await API.patch(`/${id}/`, { completed: !completed });
      await fetchTasks();
    } catch (e) {
      setError("Could not update task.");
      console.error(e);
    }
  };

  const deleteTask = async (id) => {
    setError(null);
    try {
      await API.delete(`/${id}/`);
      await fetchTasks();
    } catch (e) {
      setError("Could not delete task.");
      console.error(e);
    }
  };

  return (
    <div style={{ margin: "20px", maxWidth: 600 }}>
      <h1>Task Manager</h1>

      {/* Create form */}
      <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={!newTask.trim() || loading}>
          {loading ? "..." : "Add Task"}
        </button>
      </form>

      {/* Feedback */}
      {loading && <p>Loading tasks…</p>}
      {error && (
        <p style={{ color: "crimson", marginTop: -8, marginBottom: 8 }}>{error}</p>
      )}

      {/* Empty state */}
      {!loading && tasks.length === 0 && <p>No tasks yet. Add your first one!</p>}

      {/* List */}
      <ul style={{ paddingLeft: 18 }}>
        {Array.isArray(tasks) &&
          tasks.map((task) => (
            <li key={task.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                onClick={() => toggleTask(task.id, task.completed)}
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  cursor: "pointer",
                  flex: 1,
                }}
                title="Toggle complete"
              >
                {task.title}
              </span>
              <button onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>
                ❌
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
