import React from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const priorityOptions = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

const validate = (values) => {
  const errs = {};
  if (!values.title || !values.title.trim()) {
    errs.title = "Title is required";
  } else if (values.title.trim().length > 200) {
    errs.title = "Title too long";
  }
  return errs;
};

export default function TaskForm({ initialValues, onSubmit, onCancel, loading }) {
  const [values, setValues] = React.useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    tags: "",
    ...initialValues,
    tags: Array.isArray(initialValues?.tags)
      ? initialValues.tags.join(", ")
      : initialValues?.tags || "",
    dueDate: initialValues?.dueDate ? initialValues.dueDate.split("T")[0] : "",
  });

  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      dueDate: values.dueDate || null,
      tags: values.tags
        ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <Input
        label="Task title *"
        name="title"
        value={values.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="What needs to be done?"
        autoFocus
      />

      {/* Description */}
      <div>
        <label
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-secondary)",
            display: "block",
            marginBottom: 6,
          }}
        >
          Description
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Add more details..."
          rows={3}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)",
            fontSize: 14,
            outline: "none",
            resize: "vertical",
            fontFamily: "var(--font)",
            transition: "border-color var(--transition)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Priority + Due Date */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Select
          label="Priority"
          name="priority"
          value={values.priority}
          onChange={handleChange}
          options={priorityOptions}
        />
        <Input
          label="Due date"
          name="dueDate"
          type="date"
          value={values.dueDate}
          onChange={handleChange}
        />
      </div>

      {/* Tags */}
      <Input
        label="Tags"
        name="tags"
        value={values.tags}
        onChange={handleChange}
        placeholder="design, urgent, frontend (comma-separated)"
        hint="Separate tags with commas"
      />

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          paddingTop: 4,
        }}
      >
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialValues?._id ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
