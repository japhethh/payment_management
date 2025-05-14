import express from "express";
import cors from "cors";
import { ConnectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import "dotenv/config";
import { authMiddleware } from "./middleware/Auth.js";
import cookieParser from "cookie-parser";
import invoiceRouter from "./routes/invoiceRouter.js";
import paymentRouter from "./routes/paymentRouter.js";
import reportRouter from "./routes/reportRouter.js";
import webhookRouter from "./routes/webhookRouter.js";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser());

app.use(express.json());
ConnectDB();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Helloworld");
});

app.get("/api/auth/check", authMiddleware, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/reports", reportRouter);
app.use("/api/webhooks", webhookRouter);
// Fixed API integration endpoint
app.use("/api/integrationapi", async (req, res) => {
  try {
    const response = await axios.get(
      "https://sms-backend.imraffydev.com/api/account/users"
    );

    // Make sure we're accessing the data correctly
    console.log("External API response:", response.data);

    if (!response.data) {
      return res
        .status(404)
        .json({ success: false, message: "Accounts not found" });
    }

    // Return the data in the expected format
    return res.status(200).json({
      status: "success",
      user: response.data,
    });
  } catch (error) {
    console.error("Integration API error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch accounts",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
