const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

/**
 * Register a new user
 */
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

/**
 * Login user
 */
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

/**
 * Refresh token
 */
router.post("/refresh-token", refreshToken);

/**
 * Logout user
 */
router.post("/logout", protect, logout);

/**
 * Get current logged-in user profile
 */
router.get("/me", protect, getMe);

module.exports = router;
