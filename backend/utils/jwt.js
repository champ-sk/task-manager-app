const jwt = require("jsonwebtoken");

/**
 * Generate an access token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} Signed JWT access token.
 */
function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

/**
 * Generate a refresh token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} Signed JWT refresh token.
 */
function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });
}

/**
 * Verify an access token.
 * @param {string} token - JWT access token.
 * @returns {object} Decoded payload if valid.
 */
function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Verify a refresh token.
 * @param {string} token - JWT refresh token.
 * @returns {object} Decoded payload if valid.
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
