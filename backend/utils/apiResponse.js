/**
 * Utility class for sending consistent API responses.
 */
class ApiResponse {
  /**
   * Send a success response.
   */
  static success(res, data = {}, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send a created response (201).
   */
  static created(res, data = {}, message = "Created successfully") {
    return ApiResponse.success(res, data, message, 201);
  }

  /**
   * Send an error response.
   */
  static error(res, message = "Internal server error", statusCode = 500, errors = null) {
    const response = { success: false, message };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  /**
   * Send a paginated response.
   */
  static paginated(res, data, pagination, message = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }
}

module.exports = ApiResponse;
