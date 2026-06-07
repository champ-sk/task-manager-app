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
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";

const CHART_COLORS = [
  "#6366f1","#22c55e","#f59e0b","#ef4444",
  "#8b5cf6","#06b6d4","#f97316","#64748b"
];

const MONTHS = ["","Jan","Feb","Mar","Apr","May",
                "Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
            {/* ADD these two new stat cards */}
            <StatCard
            label="Total Spent"
            value={`₹${(stats?.totalAmount || 0).toLocaleString()}`}
            icon="💰"
            color="#6366f1"
            />
            <StatCard
            label="This Month"
            value={`₹${(stats?.monthlyAmount || 0).toLocaleString()}`}
            icon="📅"
            color="#22c55e"
            />
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
        {/* RIGHT COLUMN — replace priority breakdown with charts */}
<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

  {/* Pie Chart */}
  <div style={{
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: 24,
  }}>
    <h2 style={{ fontSize: 16, fontWeight: 600, 
                 color: "var(--text-primary)", marginBottom: 16 }}>
      Spending by Category
    </h2>
    {stats?.byCategory?.length > 0 ? (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={stats.byCategory}
            dataKey="total"
            nameKey="_id"
            cx="50%" cy="50%"
            outerRadius={80}
            label={({ _id, percent }) =>
              `${_id} ${(percent * 100).toFixed(0)}%`
            }
          >
            {stats.byCategory.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <p style={{ color: "var(--text-muted)", fontSize: 13, 
                  textAlign: "center", padding: "40px 0" }}>
        No expense data yet
      </p>
    )}
  </div>

  {/* Line Chart */}
  <div style={{
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: 24,
  }}>
    <h2 style={{ fontSize: 16, fontWeight: 600, 
                 color: "var(--text-primary)", marginBottom: 16 }}>
      Monthly Trend
    </h2>
    {stats?.byMonth?.length > 0 ? (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={stats.byMonth}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="_id.month"
            tickFormatter={(m) => MONTHS[m]}
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v) => `₹${v}`}
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          />
          <Tooltip
            formatter={(val) => [`₹${val.toLocaleString()}`, "Spent"]}
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone" dataKey="total"
            stroke="#6366f1" strokeWidth={2}
            dot={{ r: 4, fill: "#6366f1" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <p style={{ color: "var(--text-muted)", fontSize: 13, 
                  textAlign: "center", padding: "40px 0" }}>
        No trend data yet
      </p>
    )}
  </div>

</div>
      </div>
    </div>
  );
}
