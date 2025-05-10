import express from "express";
import {
  createUser,
  deleteUser,
  getUserId,
  getUsers,
  testCreate,
  updateUser,
} from "./userController.js";
import { authMiddleware } from "../middleware/Auth.js";
import multer from "multer";

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

userRouter.post("/get", getUsers);
userRouter.post("/getId", authMiddleware, getUserId);
userRouter.post("/create", createUser);
userRouter.post("/testCreate", upload.single("image"), testCreate);
userRouter.post("/update/", updateUser);
//
userRouter.post("/delete", deleteUser);

export default userRouter;
