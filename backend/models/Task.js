const mongoose = require("mongoose");

// Define the Task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Cannot have more than 10 tags",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
taskSchema.index({ user: 1, status: 1, createdAt: -1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Task", taskSchema);
