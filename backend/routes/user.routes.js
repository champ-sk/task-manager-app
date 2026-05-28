const express = require("express");
const { body } = require("express-validator");
const {
  updateProfile,
  changePassword,
  getAllUsers,
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

// All user routes require authentication
router.use(protect);

/**
 * Update user profile
 */
router.put(
  "/profile",
  [
    body("name").optional().trim().isLength({ min: 2, max: 50 }),
    body("avatar").optional().isURL().withMessage("Invalid avatar URL"),
  ],
  validate,
  updateProfile
);

/**
 * Change user password
 */
router.put(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be 6+ characters"),
  ],
  validate,
  changePassword
);

/**
 * Admin: Get all users
 */
router.get("/", authorize("admin"), getAllUsers);

module.exports = router;
