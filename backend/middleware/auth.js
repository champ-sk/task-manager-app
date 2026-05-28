const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

/**
 * Middleware to protect routes.
 * Ensures the request has a valid JWT and attaches the user to req.user.
 */
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.error(res, "Access denied. No token provided.", 401);
    }

    // Extract token and verify
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // Find user and exclude sensitive fields
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!user || !user.isActive) {
      return ApiResponse.error(res, "User not found or deactivated.", 401);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return ApiResponse.error(res, "Token expired. Please login again.", 401);
    }
    return ApiResponse.error(res, "Invalid token.", 401);
  }
}

/**
 * Middleware to authorize specific roles.
 * Example: authorize("admin", "manager")
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Role '${req.user.role}' is not authorized to access this resource.`,
        403
      );
    }
    next();
  };
}

module.exports = { protect, authorize };
