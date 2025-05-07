import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true, default: 0 },
  description: { type: String, required: false },
  paymentMethod: { type: String, required: false },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  transactionId: { type: String },
  paymentDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});
const paymentModel = mongoose.model("Payment", paymentSchema);

export default paymentModel;

