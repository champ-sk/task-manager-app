const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // timeout if DB is unreachable
    });
    console.log(`MongoDB connected successfully: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // exit process if DB connection fails
  }
};
//console.log("connectDB function defined:", connectDB);

module.exports = connectDB;
