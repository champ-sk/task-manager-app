const Task = require("../models/Task");
const ApiResponse = require("../utils/apiResponse");

/**
 * Get all tasks for the logged-in user with filters, search, pagination, and sorting.
 */
async function getTasks(req, res, next) {
  try {
    const {
      status,
      priority,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Base filter: only tasks belonging to the logged-in user
    const filter = { user: req.user._id };

    // Apply filters
    if (status && ["pending", "completed"].includes(status)) {
      filter.status = status;
    }
    if (priority && ["low", "medium", "high"].includes(priority)) {
      filter.priority = priority;
    }
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Pagination setup
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Sorting setup
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortDirection };

    // Fetch tasks and total count in parallel
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(filter),
    ]);

    const pagination = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    };

    return ApiResponse.paginated(res, tasks, pagination, "Tasks fetched successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single task by ID (only if it belongs to the logged-in user).
 */
async function getTaskById(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return ApiResponse.error(res, "Task not found.", 404);
    return ApiResponse.success(res, { task }, "Task fetched successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new task for the logged-in user.
 */
const createTask = async (req, res, next) => {
  try {
    const { 
      title, description, priority, dueDate, tags,
      amount, category, paymentMethod, notes, expenseDate  // ADD these
    } = req.body;

    const task = await Task.create({
      title, description, priority,
      dueDate: dueDate || null,
      tags: tags || [],
      amount: amount || 0,          // ADD
      category: category || "Work", // ADD
      paymentMethod: paymentMethod || "Cash", // ADD
      notes: notes || "",           // ADD
      expenseDate: expenseDate || Date.now(), // ADD
      user: req.user._id,
    });

    return ApiResponse.created(res, { task }, "Task created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing task.
 */
const updateTask = async (req, res, next) => {
  try {
    const { 
      title, description, status, priority, dueDate, tags,
      amount, category, paymentMethod, notes, expenseDate  // ADD these
    } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { 
        title, description, status, priority, dueDate, tags,
        amount, category, paymentMethod, notes, expenseDate  // ADD these
      },
      { new: true, runValidators: true }
    );

    if (!task) return ApiResponse.error(res, "Task not found.", 404);
    return ApiResponse.success(res, { task }, "Task updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle task status between 'pending' and 'completed'.
 */
async function toggleTaskStatus(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return ApiResponse.error(res, "Task not found.", 404);

    task.status = task.status === "pending" ? "completed" : "pending";
    await task.save();

    return ApiResponse.success(res, { task }, `Task marked as ${task.status}`);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a task.
 */
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return ApiResponse.error(res, "Task not found.", 404);
    return ApiResponse.success(res, {}, "Task deleted successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * Get task statistics for the logged-in user.
 */
const getTaskStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [taskStats, totalAmount, monthlyAmount, byCategory, byMonth] = 
      await Promise.all([

      // Existing task stats
      Task.aggregate([
        { $match: { user: req.user._id } },
        {
          $group: {
            _id: null,
            total:     { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            pending:   { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            high:      { $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] } },
            medium:    { $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] } },
            low:       { $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] } },
          },
        },
      ]),

      // NEW — total amount spent all time
      Task.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      // NEW — this month's total
      Task.aggregate([
        { $match: { 
          user: req.user._id, 
          expenseDate: { $gte: startOfMonth } 
        }},
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      // NEW — by category for pie chart
      Task.aggregate([
        { $match: { user: req.user._id, amount: { $gt: 0 } } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } }
      ]),

      // NEW — by month for line chart
      Task.aggregate([
        { $match: { 
          user: req.user._id, 
          expenseDate: { $gte: sixMonthsAgo },
          amount: { $gt: 0 }
        }},
        { $group: {
          _id: { 
            year:  { $year: "$expenseDate" }, 
            month: { $month: "$expenseDate" } 
          },
          total: { $sum: "$amount" }
        }},
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
    ]);

    const stats = taskStats[0] || { 
      total: 0, completed: 0, pending: 0, 
      high: 0, medium: 0, low: 0 
    };

    stats.completionRate = stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100) : 0;

    // Attach new expense stats
    stats.totalAmount   = totalAmount[0]?.total || 0;
    stats.monthlyAmount = monthlyAmount[0]?.total || 0;
    stats.byCategory    = byCategory;
    stats.byMonth       = byMonth;

    delete stats._id;
    return ApiResponse.success(res, { stats }, "Stats fetched");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats,
};
