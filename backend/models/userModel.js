import mongoose from "mongoose";

const userShema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String },
    date: { type: Date },
    role: { type: String, enum: ["admin", "super-admin"] },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userShema);

export default userModel;
