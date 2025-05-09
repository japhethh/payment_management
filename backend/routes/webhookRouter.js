import express from "express";
import Invoice from "../models/invoiceModel.js";
import Payment from "../models/paymentModel.js";

const webhookRouter = express.Router();

// PayMongo webhook handler
webhookRouter.post("/paymongo-webhook", async (req, res) => {
  try {
    // Get the signature from headers
    const signature = req.headers["paymongo-signature"];
    
    if (!signature) {
      return res.status(400).json({ error: "Missing PayMongo signature" });
    }
    
    // Verify the webhook signature (you should implement this)
    // const isValid = verifyWebhookSignature(req.body, signature, process.env.PAYMONGO_WEBHOOK_SECRET);
    // if (!isValid) {
    //   return res.status(401).json({ error: "Invalid signature" });
    // }
    
    const event = req.body;
    
    // Handle different event types
    switch (event.type) {
      case "payment.paid":
        // Payment was successful
        await handleSuccessfulPayment(event.data);
        break;
      
      case "payment.failed":
        // Payment failed
        await handleFailedPayment(event.data);
        break;
        
      case "link.payment.checkout_url_visited":
        // User visited the checkout URL
        await updateInvoiceStatus(event.data, "processing");
        break;
        
      case "link.payment.expired":
        // Payment link expired
        await updateInvoiceStatus(event.data, "expired");
        break;
    }
    
    // Always return a 200 response quickly to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Still return 200 to acknowledge receipt even if processing failed
    res.status(200).json({ received: true, error: error.message });
  }
});

// Helper function to handle successful payments
async function handleSuccessfulPayment(data) {
  const paymongoId = data.attributes.link_id || data.id;
  
  // Find the invoice with this PayMongo ID
  const invoice = await Invoice.findOne({ "payment.paymongoId": paymongoId });
  
  if (!invoice) {
    console.error(`No invoice found with PayMongo ID: ${paymongoId}`);
    return;
  }
  
  // Update invoice status
  invoice.status = "paid";
  await invoice.save();
  
  // Update payment record if you have one
  if (invoice.payment) {
    const payment = await Payment.findById(invoice.payment);
    if (payment) {
      payment.status = "completed";
      payment.paymentMethod = "gcash"; // or get from the event data
      payment.paymentDate = new Date();
      await payment.save();
    }
  }
}

// Helper function to handle failed payments
async function handleFailedPayment(data) {
  const paymongoId = data.attributes.link_id || data.id;
  
  // Find the invoice with this PayMongo ID
  const invoice = await Invoice.findOne({ "payment.paymongoId": paymongoId });
  
  if (!invoice) {
    console.error(`No invoice found with PayMongo ID: ${paymongoId}`);
    return;
  }
  
  // Update invoice status
  invoice.status = "payment_failed";
  await invoice.save();
  
  // Update payment record if you have one
  if (invoice.payment) {
    const payment = await Payment.findById(invoice.payment);
    if (payment) {
      payment.status = "failed";
      await payment.save();
    }
  }
}

// Helper function to update invoice status
async function updateInvoiceStatus(data, status) {
  const paymongoId = data.attributes.link_id || data.id;
  
  // Find the invoice with this PayMongo ID
  const invoice = await Invoice.findOne({ "payment.paymongoId": paymongoId });
  
  if (!invoice) {
    console.error(`No invoice found with PayMongo ID: ${paymongoId}`);
    return;
  }
  
  // Update invoice status
  invoice.status = status;
  await invoice.save();
}

export default webhookRouter;