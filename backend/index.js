import express from "express";
import cors from "cors";
import { ConnectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import "dotenv/config";
import { authMiddleware } from "./middleware/Auth.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000 ;
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
