import React, { useState } from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { formatDate, isOverdue } from "../../utils/date";

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const overdue =
    task.status === "pending" && task.dueDate && isOverdue(task.dueDate);

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setDeleting(true);
    await onDelete(task._id);
    setDeleting(false);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 20,
        transition: "all var(--transition)",
        animation: "fadeIn 0.25s ease",
        opacity: task.status === "completed" ? 0.75 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-focus)";
        e.currentTarget.style.boxShadow = "var(--shadow)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task._id)}
          style={{
            width: 22,
            height: 22,
            border: `2px solid ${
              task.status === "completed" ? "var(--success)" : "var(--border)"
            }`,
            borderRadius: "50%",
            background:
              task.status === "completed" ? "var(--success)" : "transparent",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            marginTop: 2,
          }}
        >
          {task.status === "completed" && (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 5.5l2.5 2.5L9 3"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color:
                  task.status === "completed"
                    ? "var(--text-muted)"
                    : "var(--text-primary)",
                textDecoration:
                  task.status === "completed" ? "line-through" : "none",
                wordBreak: "break-word",
              }}
            >
              {task.title}
            </h3>
            <Badge type={task.priority} />
            <Badge type={task.status} />
          </div>

          {task.description && (
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginBottom: 10,
                lineHeight: 1.5,
              }}
            >
              {task.description.length > 120
                ? task.description.slice(0, 120) + "..."
                : task.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {task.dueDate && (
              <span
                style={{
                  fontSize: 12,
                  color: overdue ? "var(--danger)" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {overdue ? "⚠️" : "📅"}{" "}
                {overdue ? "Overdue · " : ""}
                {formatDate(task.dueDate)}
              </span>
            )}
            {task.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {task.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      background: "var(--accent-muted)",
                      color: "var(--accent)",
                      borderRadius: 999,
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            title="Edit task"
            style={{ padding: "6px 8px" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={deleting}
            title="Delete task"
            style={{ padding: "6px 8px" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
