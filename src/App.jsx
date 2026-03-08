import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // LOAD TASKS FROM LOCAL STORAGE OR USE DEFAULT TASKS
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return [
      { id: 1, title: "Learn React Basics", status: "todo", priority: "High" },
      {
        id: 2,
        title: "Build Kanban Layout",
        status: "inprogress",
        priority: "Medium",
      },
      { id: 3, title: "Deploy Project", status: "done", priority: "Low" },
    ];
  });

  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");

  // SAVE TASKS WHENEVER THEY CHANGE
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ADD TASK
  const addTask = () => {
    if (newTask.trim() === "") return;

    const task = {
      id: Date.now(),
      title: newTask,
      status: "todo",
      priority: priority,
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  // DELETE TASK
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // MOVE TASK BETWEEN COLUMNS
  const moveTask = (id, newStatus) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, status: newStatus };
      }

      return task;
    });

    setTasks(updatedTasks);
  };

  // DASHBOARD STATS
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "inprogress").length;
  const completed = tasks.filter((t) => t.status === "done").length;

  const efficiency = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="container">
      <div className="header">
        <h1>FocusFlow</h1>
        <p>Task Management Board</p>
      </div>

      <div className="dashboard">
        Total: {total} | In Progress: {inProgress} | Completed: {completed} |
        Efficiency: {efficiency}%
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="board">
        {/* TODO COLUMN */}
        <div className="column">
          <div className="column-title">To Do ({todo})</div>

          {tasks
            .filter((task) => task.status === "todo")
            .map((task) => (
              <div className="task" key={task.id}>
                <div className="task-title">
                  {task.title}

                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="task-buttons">
                  <button onClick={() => moveTask(task.id, "inprogress")}>
                    Move →
                  </button>

                  <button onClick={() => deleteTask(task.id)}>✕</button>
                </div>
              </div>
            ))}
        </div>

        {/* IN PROGRESS COLUMN */}
        <div className="column">
          <div className="column-title">In Progress ({inProgress})</div>

          {tasks
            .filter((task) => task.status === "inprogress")
            .map((task) => (
              <div className="task" key={task.id}>
                <div className="task-title">
                  {task.title}

                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="task-buttons">
                  <button onClick={() => moveTask(task.id, "todo")}>
                    ← Back
                  </button>

                  <button onClick={() => moveTask(task.id, "done")}>
                    Move →
                  </button>

                  <button onClick={() => deleteTask(task.id)}>✕</button>
                </div>
              </div>
            ))}
        </div>

        {/* DONE COLUMN */}
        <div className="column">
          <div className="column-title">Done ({completed})</div>

          {tasks
            .filter((task) => task.status === "done")
            .map((task) => (
              <div className="task" key={task.id}>
                <div className="task-title">
                  {task.title}

                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="task-buttons">
                  <button onClick={() => moveTask(task.id, "inprogress")}>
                    ← Back
                  </button>

                  <button onClick={() => deleteTask(task.id)}>✕</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
