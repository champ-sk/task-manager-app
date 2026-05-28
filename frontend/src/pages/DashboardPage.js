import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useTaskStats,
  useTasks,
  useToggleTask,
  useDeleteTask,
} from "../hooks/useTasks";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/date";

// Stat card component
const StatCard = ({ label, value, icon, color, sub }) => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "var(--radius-sm)",
        background: `${color}22`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 20,
      }}
    >
      {icon}
    </div>
    <div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          marginTop: 4,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  </div>
);

// Priority bar component
const PriorityBar = ({ label, count, total, color }) => {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {count}
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "var(--border)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 999,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useTaskStats();
  const { data, isLoading: tasksLoading } = useTasks({
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const toggle = useToggleTask();
  const remove = useDeleteTask();

  const recentTasks = data?.tasks || [];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.5px",
          }}
        >
          {greeting}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginTop: 6,
            fontSize: 14,
          }}
        >
          Here&apos;s your task overview for today
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {statsLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 100 }} />
          ))
        ) : (
          <>
            <StatCard label="Total Tasks" value={stats?.total ?? 0} icon="📋" color="#6366f1" />
            <StatCard
              label="Completed"
              value={stats?.completed ?? 0}
              icon="✅"
              color="#22c55e"
              sub={`${stats?.completionRate ?? 0}% completion rate`}
            />
            <StatCard label="Pending" value={stats?.pending ?? 0} icon="⏳" color="#f59e0b" />
            <StatCard label="High Priority" value={stats?.high ?? 0} icon="🔴" color="#ef4444" />
          </>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Recent tasks */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
              Recent Tasks
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")}>
              View all →
            </Button>
          </div>

          {tasksLoading ? (
            <div style={{ padding: 24 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 64, marginBottom: 12 }} />
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                No tasks yet. Create your first task!
              </p>
              <Button style={{ marginTop: 16 }} onClick={() => navigate("/tasks")}>
                Get started
              </Button>
            </div>
          ) : (
            <div>
              {recentTasks.map((task, i) => (
                <div
                  key={task._id}
                  style={{
                    padding: "14px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom:
                      i < recentTasks.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <button
                    onClick={() => toggle.mutate(task._id)}
                    style={{
                      width: 20,
                      height: 20,
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
                    }}
                  >
                    {task.status === "completed" && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: task.status === "completed" ? "var(--text-muted)" : "var(--text-primary)", textDecoration: task.status === "completed" ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</div>
                    {task.dueDate && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Due {formatDate(task.dueDate)}</div>}
                  </div>
                  <Badge type={task.priority} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority breakdown */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 20 }}>Priority Breakdown</h2>
          {statsLoading ? (
            [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 36, marginBottom: 16 }} />)
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <PriorityBar label="High Priority" count={stats?.high ?? 0} total={stats?.total ?? 0} color="var(--danger)" />
              <PriorityBar label="Medium Priority" count={stats?.medium ?? 0} total={stats?.total ?? 0} color="var(--warning)" />
              <PriorityBar label="Low Priority" count={stats?.low ?? 0} total={stats?.total ?? 0} color="var(--success)" />
            </div>
          )}

          {/* Completion ring */}
          {!statsLoading && stats && (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ margin: "0 auto", display: "block" }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent)" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (stats.completionRate || 0) / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700" fontFamily="DM Sans">{stats.completionRate}%</text>
              </svg>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>Completion Rate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
