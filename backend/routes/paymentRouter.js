import express from "express";
import axios from "axios";
import Invoice from "../models/invoiceModel.js";

const paymentRouter = express.Router();

paymentRouter.post("/payment-link", async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({
      message: "Invoice ID is required",
    });
  }

  try {
    // Find the invoice by ID
    const invoice = await Invoice.findById(_id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    // Generate description from invoice items
    const itemsDescription = invoice.items
      .map((item) => `${item.description} (${item.quantity}x)`)
      .join(", ");

    const encodeKey = Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString(
      "base64"
    );

    const options = {
      method: "POST",
      url: "https://api.paymongo.com/v1/links",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Basic ${encodeKey}`,
      },
      data: {
        data: {
          attributes: {
            amount: invoice.totalAmount * 100, // Convert to centavos
            description: `Payment for Invoice ${
              invoice.invoiceNumber || invoice._id
            }`,
            remarks: `Items: ${itemsDescription}`,
            reference_number: invoice.invoiceNumber || invoice._id,
          },
        },
      },
    };

    const response = await axios.request(options);
    const paymentLink = response.data.data.attributes.checkout_url;
    const paymongoId = response.data.data.id;

    console.log("Payment link created successfully:", paymentLink);

    // Update invoice status to reflect payment link was sent
    invoice.status = "sent";

    // REMOVE THIS PROBLEMATIC CODE:
    // if (!invoice.payment) {
    //   invoice.payment = { paymongoId };
    // }

    // Instead, you can store the PayMongo ID in a different way:
    // Option 1: If you have a paymongoReference field in your schema
    // invoice.paymongoReference = paymongoId;

    // Option 2: Store it temporarily in a non-schema field (won't be saved to DB)
    // invoice._paymongoId = paymongoId;

    await invoice.save();

    res.status(200).json({
      message: "Payment link created successfully",
      link: paymentLink,
      _id: invoice._id,
      paymongoId: paymongoId, // Return the PayMongo ID in the response
    });
  } catch (error) {
    console.error("Error creating payment link:", error);

    res.status(500).json({
      message: "Failed to create payment link. Please try again.",
      error: error.response?.data || error.message,
    });
  }
});

export default paymentRouter;

