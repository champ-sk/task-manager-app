import React from "react";

export default function Input({
  label,
  error,
  hint,
  icon,
  style,
  containerStyle,
  ...props
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        ...containerStyle,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              display: "flex",
            }}
          >
            {icon}
          </span>
        )}
        <input
          style={{
            width: "100%",
            padding: icon ? "10px 14px 10px 38px" : "10px 14px",
            background: "var(--bg-input)",
            border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
            borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)",
            fontSize: 14,
            outline: "none",
            transition: "border-color var(--transition)",
            ...style,
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: 12, color: "var(--danger)" }}>{error}</span>
      )}
      {hint && !error && (
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{hint}</span>
      )}
    </div>
  );
}
