import mongoose from "mongoose";
import { user } from "../types/userTypes";

const userSchema = new mongoose.Schema<user>(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      unique: true,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
