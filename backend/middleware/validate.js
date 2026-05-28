const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");

/**
 * Middleware to handle validation results from express-validator.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));

    return ApiResponse.error(res, "Validation failed", 422, formatted);
  }

  next();
}

module.exports = validate;
