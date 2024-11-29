import mongoose from "mongoose";
import { _confiq } from "../config/Config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected to Database Sucessful");
    });
    mongoose.connection.on("error", (err) => {
      console.log("Database connection Fail", err);
    });
    await mongoose.connect(_confiq.database as string);
  } catch (error) {
    console.error("Failed to connect to database");
    process.exit(1);
  }
};

export default connectDB;
