import express from "express";
import { login, register, registerTest } from "../controller/authController.js";
import { registerValidation } from "../middleware/validator.middleware.js";

const authRouter = express.Router();

authRouter.post("/registerTest", registerValidation, registerTest);
authRouter.post("/login", login);
authRouter.post("/register", register);

export default authRouter;
