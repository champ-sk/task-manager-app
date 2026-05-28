const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");
const { notFound } = require("./middleware/notFound");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Apply security-related middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

// Configure rate limiting for API routes
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Parse incoming request bodies
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Enable request logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Serve API documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "TaskFlow API Documentation",
}));

// Register application routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Handle 404 and other errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
