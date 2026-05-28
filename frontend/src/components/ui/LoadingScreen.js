import React from "react";

export default function LoadingScreen() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "var(--bg)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid var(--border)",
            borderTop: "3px solid var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Loading TaskFlow...
        </p>
      </div>
    </div>
  );
}
