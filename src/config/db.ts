// src/config/db.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    console.log("Attempting to connect to MongoDB...");
    console.log(
      "MongoDB URI (masked):",
      mongoURI.replace(/\/\/.*@/, "//***:***@")
    );

    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options
      // useNewUrlParser and useUnifiedTopology are default in newer versions
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    // Don't exit process in serverless environment
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};
