// Load environment variables from the .env file
require("dotenv").config();

// Import the Express application and database connection
const app = require("./app");
const connectDB = require("./config/db");

// Define the port number from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Function to start the server
const startServer = async () => {
  // Connect to the database before starting the server
  console.log("connectDB is:", connectDB);

  await connectDB();

  // Start the Express server
  const server = app.listen(PORT, () => {
    console.log(`TaskFlow API is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api/docs`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });

  // Handle graceful shutdown when a termination signal is received
  process.on("SIGTERM", () => {
    console.log("Termination signal received. Closing server...");
    server.close(() => {
      console.log("Server closed successfully.");
      process.exit(0);
    });
  });
};

// Start the server
startServer();
