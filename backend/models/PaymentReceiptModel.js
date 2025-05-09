import mongoose from "mongoose"

const paymentReceiptSchema = new mongoose.Schema({
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
  receiptNumber: { type: String, required: true, unique: true },
  generatedDate: { type: Date, default: Date.now },
  format: { type: String, enum: ["pdf", "email", "sms"], default: "pdf" },
  content: { type: Object },
  sentTo: { type: String },
  status: { type: String, enum: ["generated", "sent", "viewed"], default: "generated" },
})

// Method to send receipt to user
paymentReceiptSchema.methods.sendToUser = async function (user, method = "email") {
  // Logic to send receipt to user via email, SMS, etc.
  this.sentTo = user.email || user.phone
  this.status = "sent"
  await this.save()

  return true
}

export default mongoose.model("PaymentReceipt", paymentReceiptSchema)
