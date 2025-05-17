import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  program: { type: String, required: true },
  yearLevel: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Student", studentSchema);
