import React from "react";

const configs = {
  pending: {
    bg: "var(--warning-muted)",
    color: "var(--warning)",
    label: "Pending",
  },
  completed: {
    bg: "var(--success-muted)",
    color: "var(--success)",
    label: "Completed",
  },
  high: { bg: "var(--danger-muted)", color: "var(--danger)", label: "High" },
  medium: {
    bg: "var(--warning-muted)",
    color: "var(--warning)",
    label: "Medium",
  },
  low: { bg: "var(--success-muted)", color: "var(--success)", label: "Low" },
};

export default function Badge({ type, children, style }) {
  const cfg =
    configs[type] || { bg: "var(--border)", color: "var(--text-secondary)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        ...style,
      }}
    >
      {children || cfg.label}
    </span>
  );
}
