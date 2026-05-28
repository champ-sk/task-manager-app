const express = require("express");
const { body } = require("express-validator");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats,
} = require("../controllers/task.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

// All task routes require authentication
router.use(protect);

/**
 * Get all tasks (with filters, pagination, sorting)
 */
router.get("/", getTasks);

/**
 * Get task statistics
 */
router.get("/stats", getTaskStats);

/**
 * Get a single task by ID
 */
router.get("/:id", getTaskById);

/**
 * Create a new task
 */
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }),
    body("description").optional().isLength({ max: 2000 }),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("dueDate").optional({ nullable: true }).isISO8601().withMessage("Invalid date format"),
    body("tags").optional().isArray(),
  ],
  validate,
  createTask
);

/**
 * Update an existing task
 */
router.put(
  "/:id",
  [
    body("title").optional().trim().notEmpty().isLength({ max: 200 }),
    body("description").optional().isLength({ max: 2000 }),
    body("status").optional().isIn(["pending", "completed"]),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("dueDate").optional({ nullable: true }).isISO8601(),
    body("tags").optional().isArray(),
  ],
  validate,
  updateTask
);

/**
 * Toggle task status
 */
router.patch("/:id/toggle", toggleTaskStatus);

/**
 * Delete a task
 */
router.delete("/:id", deleteTask);

module.exports = router;
