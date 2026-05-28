import React from "react";

const variants = {
  primary: { background: "var(--accent)", color: "white", border: "none" },
  secondary: {
    background: "var(--bg-card)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
  },
  danger: {
    background: "var(--danger-muted)",
    color: "var(--danger)",
    border: "1px solid rgba(239,68,68,0.2)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
  },
  success: {
    background: "var(--success-muted)",
    color: "var(--success)",
    border: "1px solid rgba(34,197,94,0.2)",
  },
};

const sizes = {
  sm: { padding: "6px 14px", fontSize: 13, borderRadius: "var(--radius-xs)" },
  md: { padding: "9px 20px", fontSize: 14, borderRadius: "var(--radius-sm)" },
  lg: { padding: "12px 28px", fontSize: 15, borderRadius: "var(--radius-sm)" },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  fullWidth,
  style,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        ...variants[variant],
        ...sizes[size],
        fontWeight: 500,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        transition: "all var(--transition)",
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? "100%" : undefined,
        justifyContent: fullWidth ? "center" : undefined,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
            display: "inline-block",
          }}
        />
      )}
      {children}
    </button>
  );
}
