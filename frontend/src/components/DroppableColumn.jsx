
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({
  id,
  title,
  children,
  onAddTask,
  taskCount
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const [columnTitle, setColumnTitle] = useState(() =>
    localStorage.getItem(`column-title-${id}`) || title
  );

  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(columnTitle);

  function saveTitle(event) {
    event.preventDefault();

    const newTitle = draftTitle.trim();
    if (!newTitle) return;

    setColumnTitle(newTitle);
    localStorage.setItem(`column-title-${id}`, newTitle);
    setEditing(false);
  }

  function cancelEditing() {
    setDraftTitle(columnTitle);
    setEditing(false);
  }

  return (
    <section
      ref={setNodeRef}
      className={`board-column ${isOver ? "drop-over" : ""}`}
    >
      <div className="column-header">
        {editing ? (
          <form
            className="column-title-form"
            onSubmit={saveTitle}
          >
            <input
              type="text"
              value={draftTitle}
              onChange={(event) =>
                setDraftTitle(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  cancelEditing();
                }
              }}
              autoFocus
              aria-label="Column title"
            />

            <button type="submit" title="Save">
              ✓
            </button>

            <button
              type="button"
              onClick={cancelEditing}
              title="Cancel"
            >
              ×
            </button>
          </form>
        ) : (
          <div className="column-title-row">
             <span className="column-count">
                {taskCount}
            </span>
            <h2>{columnTitle}</h2>

            <button
              type="button"
              className="column-edit-btn"
              onClick={() => {
                setDraftTitle(columnTitle);
                setEditing(true);
              }}
              title="Rename column"
            >
              ✏️
            </button>
          </div>
        )}

        <button
          type="button"
          className="add-task-btn"
          onClick={() => onAddTask(id)}
          aria-label={`Add task to ${columnTitle}`}
        >
          +
        </button>
      </div>

      {children}
    </section>
  );
}
