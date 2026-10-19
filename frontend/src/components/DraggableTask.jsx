
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function DraggableTask({
  task,
  onOpen,
  onRename
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: `task-${task.id}`,
    disabled: editing
  });

  
const style = transform && !isDragging
  ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      position: "relative",
      zIndex: 100
    }
  : undefined;


  function startEditing() {
    setTitle(task.title);
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setError("");
  }

  async function saveTitle(event) {
    event.preventDefault();

    if (!title.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      await onRename(task, title);
      setEditing(false);
    } catch (err) {
      console.error("Rename failed:", err);
      setError("Could not save title.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={`task-card draggable-task ${
        isDragging ? "dragging" : ""
      }`}
      style={style}
    >
      {editing ? (
        <form
          className="title-edit-form"
          onSubmit={saveTitle}
        >
          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                cancelEditing();
              }
            }}
            autoFocus
            disabled={saving}
            aria-label="Task title"
          />

          <button
            type="submit"
            disabled={saving || !title.trim()}
          >
            Save
          </button>

          <button
            type="button"
            onClick={cancelEditing}
            disabled={saving}
          >
            Cancel
          </button>

          {error && (
            <span className="title-edit-error" role="alert">
              {error}
            </span>
          )}
        </form>
      ) : (
        <>
          <button
            type="button"
            className="task-open"
            onClick={() => onOpen(task)}
          >
            <strong>{task.title}</strong>
            <span>Click to view details</span>
          </button>

          <button
            type="button"
            className="title-edit-trigger"
            onClick={startEditing}
            title="Edit task title"
            aria-label={`Edit title of ${task.title}`}
          >
            ✏️
          </button>

          <button
            type="button"
            className="drag-handle"
            {...attributes}
            {...listeners}
            aria-label={`Drag ${task.title}`}
          >
            ⠿
          </button>
        </>
      )}
    </div>
  );
}
