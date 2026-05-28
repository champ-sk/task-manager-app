const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

/**
 * Update the logged-in user's profile (name, avatar).
 */
async function updateProfile(req, res, next) {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    return ApiResponse.success(res, { user }, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * Change the logged-in user's password.
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    // Fetch user with password field
    const user = await User.findById(req.user._id).select("+password");

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.error(res, "Current password is incorrect.", 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return ApiResponse.success(res, {}, "Password changed successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Get all users with pagination.
 */
async function getAllUsers(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fetch users and total count in parallel
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limitNum).lean(),
      User.countDocuments(),
    ]);

    const pagination = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    };

    return ApiResponse.paginated(res, users, pagination, "Users fetched successfully");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateProfile,
  changePassword,
  getAllUsers,
};
