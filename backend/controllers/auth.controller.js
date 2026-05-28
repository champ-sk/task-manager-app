const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const ApiResponse = require("../utils/apiResponse");

/**
 * Register a new user
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if email is already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return ApiResponse.error(res, "Email already registered.", 409);
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token and last login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return ApiResponse.created(
      res,
      { user, accessToken, refreshToken },
      "Registration successful"
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user and check password
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return ApiResponse.error(res, "Invalid email or password.", 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, "Your account has been deactivated.", 403);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token and last login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Convert user to plain object (exclude sensitive fields)
    const userObj = user.toJSON();

    return ApiResponse.success(
      res,
      { user: userObj, accessToken, refreshToken },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshTokenController(req, res, next) {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return ApiResponse.error(res, "Refresh token required.", 400);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      return ApiResponse.error(res, "Invalid refresh token.", 401);
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return ApiResponse.success(
      res,
      { accessToken, refreshToken: newRefreshToken },
      "Token refreshed"
    );
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return ApiResponse.error(res, "Invalid or expired refresh token.", 401);
    }
    next(error);
  }
}

/**
 * Logout user
 */
async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    return ApiResponse.success(res, {}, "Logged out successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * Get current logged-in user profile
 */
async function getMe(req, res) {
  return ApiResponse.success(res, { user: req.user }, "Profile fetched");
}

module.exports = {
  register,
  login,
  refreshToken: refreshTokenController,
  logout,
  getMe,
};
