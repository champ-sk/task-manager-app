import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import toast from "react-hot-toast";

// Fetch task statistics
export const useTaskStats = () =>
  useQuery({
    queryKey: ["tasks", "stats"],
    queryFn: async () => {
      const { data } = await tasksApi.getStats();
      return data.data.stats;
    },
  });

// Fetch tasks with optional filters
export const useTasks = (filters = {}) =>
  useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const { data } = await tasksApi.getAll(filters);
      return { tasks: data.data, pagination: data.pagination };
    },
    keepPreviousData: true,
  });

// Create a new task
export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => tasksApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created!");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create task"),
  });
};

// Update an existing task
export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => tasksApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated!");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update task"),
  });
};

// Toggle task status
export const useToggleTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => tasksApi.toggle(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      const status = res.data.data.task.status;
      toast.success(`Marked as ${status}`);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update task"),
  });
};

// Delete a task
export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => tasksApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete task"),
  });
};
