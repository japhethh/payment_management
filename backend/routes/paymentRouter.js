// routes/paymentRoutes.js
import express from "express";
import Invoice from "../models/invoiceModel.js";
import Payment from "../models/paymentModel.js";
import { authMiddleware } from "../middleware/Auth.js";
import { processPayment, sendNotification } from "../services/paymentGateway.js";

const paymentRouter = express.Router();

// View payment summary
paymentRouter.get("/summary/:userId", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.params.userId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit payment
paymentRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId, amount, description, paymentMethod } = req.body;

    // Create payment record
    const payment = new Payment({
      user: userId,
      amount,
      description,
      paymentMethod,
    });

    // Save initial payment record
    await payment.save();

    // Validate payment information
    if (amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    // Process payment via gateway
    const paymentResult = await processPayment({
      amount,
      paymentMethod,
      description,
    });

    // Update payment with transaction details
    payment.transactionId = paymentResult.transactionId;
    payment.status = paymentResult.success ? "completed" : "failed";
    payment.paymentDate = new Date();
    await payment.save();

    // Generate invoice if payment successful
    if (paymentResult.success) {
      // Generate invoice number (simple implementation)
      const invoiceNumber = `INV-${Date.now()}-${userId.substring(0, 5)}`;

      const invoice = new Invoice({
        user: userId,
        payment: payment._id,
        invoiceNumber,
        items: [
          {
            description,
            amount,
          },
        ],
        totalAmount: amount,
        status: "paid",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });

      await invoice.save();

      // Notify user of payment status
      await sendNotification(userId, {
        type: "payment_success",
        message: `Your payment of $${amount} was successful. Invoice #${invoiceNumber} has been generated.`,
      });
    } else {
      // Notify user of payment failure
      await sendNotification(userId, {
        type: "payment_failed",
        message: `Your payment of $${amount} failed. Please try again.`,
      });
    }

    res.status(201).json({
      payment,
      success: paymentResult.success,
      message: paymentResult.success ? "Payment successful" : "Payment failed",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default paymentRouter;
