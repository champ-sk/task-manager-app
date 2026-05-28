import { format, isAfter, parseISO } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  try {
    const parsed = parseISO(typeof date === "string" ? date : date.toISOString());
    return format(parsed, "MMM d, yyyy");
  } catch {
    return "";
  }
};

export const isOverdue = (date) => {
  if (!date) return false;
  try {
    const parsed = parseISO(typeof date === "string" ? date : date.toISOString());
    return isAfter(new Date(), parsed);
  } catch {
    return false;
  }
};
