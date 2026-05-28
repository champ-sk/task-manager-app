const ApiResponse = require("../utils/apiResponse");

/**
 * Global error handler middleware.
 * Catches errors and sends a standardized response.
 */
function errorHandler(err, req, res, next) {
  let message = err.message || "Internal Server Error";
  let statusCode = err.statusCode || 500;

  // Handle invalid ObjectId errors
  if (err.name === "CastError") {
    message = `Resource not found with id: ${err.value}`;
    statusCode = 404;
  }

  // Handle duplicate key errors (e.g., unique fields)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    statusCode = 409;
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((e) => e.message).join(", ");
    statusCode = 400;
  }

  // Log stack trace in development
  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${err.stack}`);
  }

  return ApiResponse.error(res, message, statusCode);
}

module.exports = errorHandler;
