import React, { useState } from "react";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useToggleTask,
  useDeleteTask,
} from "../hooks/useTasks";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

const filterOptions = [
  { value: "", label: "All Tasks" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const priorityOptions = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const sortOptions = [
  { value: "createdAt", label: "Date Created" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
];

export default function TasksPage() {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const { data, isLoading, isFetching } = useTasks(
    Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
  );
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  const tasks = data?.tasks || [];
  const pagination = data?.pagination;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        handleFilterChange("search", e.target.value);
      }, 400)
    );
  };

  const handleCreate = async (taskData) => {
    await createTask.mutateAsync(taskData);
    setModalOpen(false);
  };

  const handleUpdate = async (taskData) => {
    await updateTask.mutateAsync({ id: editingTask._id, data: taskData });
    setEditingTask(null);
  };

  const handleEdit = (task) => setEditingTask(task);

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 1000 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
            }}
          >
            My Tasks
          </h1>
          {pagination && (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {pagination.total} tasks total
            </p>
          )}
        </div>
        <Button onClick={() => setModalOpen(true)} size="md">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "16px 20px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto auto",
            gap: 12,
            alignItems: "end",
          }}
        >
          <Input
            placeholder="Search tasks..."
            value={searchInput}
            onChange={handleSearch}
            icon={
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
          />
          <Select
            options={filterOptions}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            style={{ width: 140 }}
          />
          <Select
            options={priorityOptions}
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            style={{ width: 140 }}
          />
          <Select
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            style={{ width: 140 }}
          />
          <button
            onClick={() =>
              handleFilterChange(
                "sortOrder",
                filters.sortOrder === "desc" ? "asc" : "desc"
              )
            }
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 12px",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: 14,
            }}
            title={filters.sortOrder === "desc" ? "Newest first" : "Oldest first"}
          >
            {filters.sortOrder === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* Task list */}
      <div style={{ position: "relative" }}>
        {isFetching && !isLoading && (
          <div
            style={{
              position: "absolute",
              top: -8,
              right: 0,
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            Refreshing...
          </div>
        )}

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 100 }} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: 64,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {filters.search || filters.status || filters.priority ? "🔍" : "📝"}
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              {filters.search || filters.status || filters.priority
                ? "No matching tasks"
                : "No tasks yet"}
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                marginBottom: 20,
              }}
            >
              {filters.search || filters.status || filters.priority
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
            {!filters.search && !filters.status && !filters.priority && (
              <Button onClick={() => setModalOpen(true)}>
                Create your first task
              </Button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {tasks.map((task) => (
              <TaskCard key={task._id} task={task}
                onToggle={(id) => toggleTask.mutate(id)}
                onEdit={handleEdit}
                onDelete={(id) => deleteTask.mutate(id)} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}>
          <Button variant="secondary" size="sm" disabled={!pagination.hasPrevPage} onClick={() => handleFilterChange("page", filters.page - 1)}>← Prev</Button>
          <span style={{ fontSize: 14, color: "var(--text-secondary)", padding: "0 12px" }}>Page {pagination.page} of {pagination.totalPages}</span>
          <Button variant="secondary" size="sm" disabled={!pagination.hasNextPage} onClick={() => handleFilterChange("page", filters.page + 1)}>Next →</Button>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Task">
        <TaskForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} loading={createTask.isPending} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        {editingTask && (
          <TaskForm initialValues={editingTask} onSubmit={handleUpdate} onCancel={() => setEditingTask(null)} loading={updateTask.isPending} />
        )}
      </Modal>
    </div>
  );
}