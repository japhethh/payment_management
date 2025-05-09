// routes/invoiceRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/Auth.js";
import Invoice from "../models/invoiceModel.js";
import Payment from "../models/paymentModel.js"; // Import the Payment model
import expressAsyncHandler from "express-async-handler";
import invoiceModel from "../models/invoiceModel.js";
import Counter from "../models/counterModel.js";

const invoiceRouter = express.Router();

// Get all invoices for a user
invoiceRouter.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.params.userId });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all invoices for a user
invoiceRouter.get("/getAll", authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get invoice by ID
invoiceRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update invoice status
invoiceRouter.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

invoiceRouter.post(
  "/",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const decoded = req.user; // Assuming your auth middleware adds the decoded user to req.user

    try {
      const counter = await Counter.findByIdAndUpdate(
        {
          _id: "invoiceNumber",
        },
        {
          $inc: { sequence_value: 1 },
        },
        {
          new: true,
          upsert: true,
        }
      );

      const invoiceNumber = counter.sequence_value.toString().padStart(3, "0");

      const reference = `INV-${invoiceNumber}`;

      // Create the invoice
      const newInvoice = new Invoice({
        ...req.body,
        user: decoded,
        invoiceNumber: reference,
      });
      await newInvoice.save();

      // Create a default payment record for this invoice
      const defaultPayment = new Payment({
        user: decoded,
        amount: newInvoice.totalAmount,
        description: `Payment for invoice ${newInvoice.invoiceNumber}`,
        status: "pending", // Default status
        paymentMethod: null, // Will be set when payment is processed
        paymentDate: null, // Will be set when payment is completed
        createdAt: new Date(),
      });

      // Save the payment record
      const savedPayment = await defaultPayment.save();

      // Update the invoice with the payment reference
      newInvoice.payment = savedPayment._id;
      await newInvoice.save();

      // Return the invoice with payment information
      res.status(201).json({
        invoice: newInvoice,
        payment: savedPayment,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

invoiceRouter.put("/:id", async (req, res) => {
  try {
    const updatedInvoice = await invoiceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

invoiceRouter.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteInvoice = await invoiceModel.findByIdAndDelete(userId);

    if (!deleteInvoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found!" });
    }

    res.status(200).json({ message: "Deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default invoiceRouter;
