const ApiResponse = require("../utils/apiResponse");

/**
 * Middleware for handling 404 routes.
 */
function notFound(req, res) {
  return ApiResponse.error(res, `Route ${req.originalUrl} not found`, 404);
}

module.exports = { notFound };
