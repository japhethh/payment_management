import userModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";
export const registerService = asyncHandler(async (data) => {
  const { name, email, password, userName, role } = data;

  const newUser = new userModel({
    name,
    email,
    password,
    userName,
    role,
  });

  const user = await newUser.save();

  return user;
});
