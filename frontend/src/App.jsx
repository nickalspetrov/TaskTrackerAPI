import { DndContext, DragOverlay } from "@dnd-kit/core";
import DraggableTask from "./components/DraggableTask";
import DroppableColumn from "./components/DroppableColumn";

import { useEffect, useState } from "react";import "./App.css";
const columns = [
  { id: "ToDo", title: "To Do" },
  { id: "InProgress", title: "In Progress" },
  { id: "Done", title: "Done" }
];


async function readApiError(response) {
  const text = await response.text();

  try {
    const data = JSON.parse(text);

    if (typeof data === "string") {
      return data;
    }

    // ASP.NET Core ValidationProblemDetails
    if (data.errors) {
      const messages = Object.values(data.errors).flat();

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }

    return data.detail || data.title ||
      `HTTP error ${response.status}`;

  } catch {
    return text || `HTTP error ${response.status}`;
  }
}


export default function App() {


  const [selectedTask, setSelectedTask] = useState(null);

const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  document.documentElement.dataset.theme =
    darkMode ? "dark" : "light";

  localStorage.setItem(
    "theme",
    darkMode ? "dark" : "light"
  );
}, [darkMode]);

const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [newTask, setNewTask] = useState(null);
const [creating, setCreating] = useState(false);
const [createError, setCreateError] = useState("");

const [editedTask, setEditedTask] = useState(null);
const [detailsBusy, setDetailsBusy] = useState(false);
const [detailsError, setDetailsError] = useState("");

const [toast, setToast] = useState(null);
const [activeTask, setActiveTask] = useState(null);


const [searchQuery, setSearchQuery] = useState("");


useEffect(() => {
  if (!toast) return;

  const timer = setTimeout(() => {
    setToast(null);
  }, 3000);

  return () => clearTimeout(timer);
}, [toast]);


useEffect(() => {
  async function loadTasks() {
    try {
      const response = await fetch("/api/tasks");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setTasks(data);
      setError("");
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Could not load tasks from the API.");
    } finally {
      setLoading(false);
    }
  }



  loadTasks();
}, []);
async function handleDragEnd(event) {
  setActiveTask(null);
  const { active, over } = event;

  // Ако задачата е пусната извън колоните
  if (!over) return;

  // Пример: "task-5" -> 5
  const taskId = Number(
    String(active.id).replace("task-", "")
  );

  // Пример: "InProgress"
  const newStatus = String(over.id);

  const task = tasks.find((t) => t.id === taskId);

  if (!task || task.status === newStatus) {
    return;
  }

  if (!["ToDo", "InProgress", "Done"].includes(newStatus)) {
    return;
  }

  try {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description ?? "",
        status: newStatus,
        isCompleted: newStatus === "Done"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Обновяваме задачата в React
    setTasks((previousTasks) =>
      previousTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              isCompleted: newStatus === "Done"
            }
          : t
      )
    );

  setToast({ message: "Task moved successfully!" });

  setToast({ message: "Task moved successfully!" });

    setError("");
  } catch (err) {
    console.error("Failed to move task:", err);
    setError("Could not save the task's new status.");
  }

}

function openNewTask(status) {
  setNewTask({
    title: "",
    description: "",
    status: status
  });

  setCreateError("");
}

async function handleCreateTask(event) {
  event.preventDefault();

  if (!newTask || !newTask.title.trim()) {
    return;
  }

  setCreating(true);
  setCreateError("");

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newTask.title.trim(),
        description: newTask.description,
        status: newTask.status,
        isCompleted: newTask.status === "Done"
      })
    });

    if (!response.ok) {
    throw new Error(await readApiError(response));
    }

    const createdTask = await response.json();

    // Добавяме новата задача в React
    setTasks((previousTasks) => [
      ...previousTasks,
      createdTask
    ]);

    // Затваряме popup-а
    setNewTask(null);
    setToast({ message: "Task created successfully!" });
  } catch (error) {
  console.error("Failed to create task:", error);

  setCreateError(
    error.message || "Could not create task."
  );
} finally {
  setCreating(false);
  }
}

function openTaskDetails(task) {
  setSelectedTask(task);

  setEditedTask({
    title: task.title,
    description: task.description ?? "",
    status: task.status
  });

  setDetailsError("");
}

async function handleSaveTask(event) {
  event.preventDefault();

  if (!selectedTask || !editedTask?.title.trim()) {
    return;
  }

  setDetailsBusy(true);
  setDetailsError("");

  const updatedTask = {
    ...selectedTask,
    title: editedTask.title.trim(),
    description: editedTask.description,
    status: editedTask.status,
    isCompleted: editedTask.status === "Done"
  };

  try {
    const response = await fetch(
      `/api/tasks/${selectedTask.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
      }
    );

    if (!response.ok) {
      throw new Error(await readApiError(response));
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === selectedTask.id
          ? updatedTask
          : task
      )
    );

    setSelectedTask(null);
    setEditedTask(null);
    setToast({ message: "Task updated successfully!" });

  } catch (error) {
  console.error("Failed to update task:", error);

  setDetailsError(
    error.message || "Could not save task changes."
  );
} finally {
  setDetailsBusy(false);
  }
}

async function handleDeleteTask() {
  if (!selectedTask) return;

  const confirmed = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmed) return;

  setDetailsBusy(true);
  setDetailsError("");

  try {
    const response = await fetch(
      `/api/tasks/${selectedTask.id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => task.id !== selectedTask.id
      )
    );

    setSelectedTask(null);
    setEditedTask(null);
    setToast({ message: "Task deleted successfully!" });

  } catch (error) {
    console.error("Failed to delete task:", error);
    setDetailsError("Could not delete task.");
  } finally {
    setDetailsBusy(false);
  }
}


async function renameTask(task, newTitle) {
  const title = newTitle.trim();

  if (!title) return;

  const response = await fetch(`/api/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...task,
      title: title,
      description: task.description ?? "",
      status: task.status,
      isCompleted: task.status === "Done"
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  setTasks((previousTasks) =>
    previousTasks.map((t) =>
      t.id === task.id
        ? { ...t, title: title }
        : t
    )
  );
}

function handleDragStart(event) {
  const taskId = Number(
    String(event.active.id).replace("task-", "")
  );

  const task = tasks.find((t) => t.id === taskId);

  setActiveTask(task ?? null);
}

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>My Task Board</h1>
          <p>Organize your work with React and .NET</p>

        </div>
         <button
    type="button"
    className="theme-toggle"
    aria-pressed={darkMode}
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
        {loading && <p>Loading tasks...</p>}

        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </header>

<div className="task-search">
  <input
    type="search"
    placeholder="🔍 Search tasks by title..."
    aria-label="Search tasks"
    value={searchQuery}
    onChange={(event) =>
      setSearchQuery(event.target.value)
    }
  />

  {searchQuery && (
    <button
      type="button"
      onClick={() => setSearchQuery("")}
      aria-label="Clear search"
    >
      Clear
    </button>
  )}
</div>

      
<DndContext
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  onDragCancel={() => setActiveTask(null)}
>
  <div className="board">
    {columns.map((column) => (
      <DroppableColumn
        key={column.id}
        id={column.id}
        title={column.title}
        onAddTask={openNewTask}
        taskCount={
        tasks.filter((task) => task.status === column.id).length
        }
      >
        {tasks
          .filter((task) =>
          task.status === column.id &&
          task.title
            .toLowerCase()
              .includes(searchQuery.trim().toLowerCase())
) 
          .map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              onOpen={openTaskDetails}
              onRename={renameTask}

            />
          ))}
      </DroppableColumn>
    ))}
  </div>
  
<DragOverlay>
  {activeTask ? (
    <div className="task-card drag-overlay-card">
      <strong>{activeTask.title}</strong>
      <span>Moving task...</span>
    </div>
  ) : null}
</DragOverlay>
</DndContext>

{newTask && (
  <div
    className="modal-backdrop"
    onClick={() => {
      if (!creating) setNewTask(null);
    }}
  >
    <section
      className="task-modal create-task-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-heading"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="close-btn"
        onClick={() => setNewTask(null)}
        disabled={creating}
        aria-label="Close"
      >
        ×
      </button>

      <h2 id="create-task-heading">Create New Task</h2>

      <p className="modal-status">
        {columns.find(
          (column) => column.id === newTask.status
        )?.title}
      </p>

      <form
        className="create-task-form"
        onSubmit={handleCreateTask}
      >
        <label htmlFor="new-task-title">
          Title
        </label>

        <input
          id="new-task-title"
          type="text"
          placeholder="Enter task title..."
          value={newTask.title}
          onChange={(event) =>
            setNewTask({
              ...newTask,
              title: event.target.value
            })
          }
          required
          autoFocus
        />

        <label htmlFor="new-task-description">
          Description
        </label>

        <textarea
          id="new-task-description"
          placeholder="Add a description..."
          rows={5}
          value={newTask.description}
          onChange={(event) =>
            setNewTask({
              ...newTask,
              description: event.target.value
            })
          }
        />

        {createError && (
          <p className="form-error">{createError}</p>
        )}

        <button
          type="submit"
          className="create-task-btn"
          disabled={creating || !newTask.title.trim()}
        >
          {creating ? "Creating..." : "Create Task"}
        </button>
      </form>
    </section>
  </div>
)}


      

{selectedTask && editedTask && (
  <div
    className="modal-backdrop"
    onClick={() => {
      if (!detailsBusy) setSelectedTask(null);
    }}
  >
    <section
      className="task-modal details-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="details-header">
        <span className="details-status">
          {columns.find(
            (column) => column.id === editedTask.status
          )?.title}
        </span>

        <button
          type="button"
          className="details-close"
          onClick={() => setSelectedTask(null)}
          disabled={detailsBusy}
          aria-label="Close task details"
        >
          ×
        </button>
      </div>

      <h2 id="modal-title">Edit task</h2>

      <p className="details-subtitle">
        Task #{selectedTask.id}
      </p>

      <form
        className="details-editor"
        onSubmit={handleSaveTask}
      >
        <div className="details-layout">
          <div className="details-main">
            <label htmlFor="edit-task-title">
              Title
            </label>

            <input
              id="edit-task-title"
              type="text"
              required
              value={editedTask.title}
              onChange={(event) =>
                setEditedTask({
                  ...editedTask,
                  title: event.target.value
                })
              }
            />

            <label htmlFor="edit-task-description">
              ☰ Description
            </label>

            <textarea
              id="edit-task-description"
              rows={7}
              placeholder="Add a description..."
              value={editedTask.description}
              onChange={(event) =>
                setEditedTask({
                  ...editedTask,
                  description: event.target.value
                })
              }
            />
          </div>

          <aside className="details-sidebar">
            <label htmlFor="edit-task-status">
              Status
            </label>

            <select
              id="edit-task-status"
              value={editedTask.status}
              onChange={(event) =>
                setEditedTask({
                  ...editedTask,
                  status: event.target.value
                })
              }
            >
              <option value="ToDo">To Do</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <p className="details-label">Task ID</p>
            <strong>#{selectedTask.id}</strong>
          </aside>
        </div>

        {detailsError && (
          <p className="form-error" role="alert">
            {detailsError}
          </p>
        )}

        <div className="details-actions">
          <button
            type="button"
            className="details-delete"
            onClick={handleDeleteTask}
            disabled={detailsBusy}
          >
            Delete Task
          </button>

          <button
            type="submit"
            className="details-save"
            disabled={
              detailsBusy || !editedTask.title.trim()
            }
          >
            {detailsBusy ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  </div>
)}

{toast && (
  <div className="toast-notification" role="status">
    <span className="toast-icon">✓</span>
    <span>{toast.message}</span>
  </div>
)}


    </main>
  );
}
