import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";

const getUsers = asyncHandler(async (req, res) => {
  try {
    const data = await userModel.find({});

    if (!data) {
      return res.status(404).json({ message: "Users not found!" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});
const getUserId = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    const data = await userModel.findById(user);

    if (!data) {
      return res.status(404).json({ message: "Users not found!" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});

const createUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, userName, role } = req.body;
    const newUser = new userModel({
      name,
      email,
      password,
      userName,
      role,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
  }
});

const testCreate = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    let imageUrl = "";
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "boilerplate",
      });

      // Clean up the uploaded file from server
      if (file.path) {
        fs.unlinkSync(file.path);
      }

      imageUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: error.message,
      });
    }

    const newUser = new userModel({
      name,
      email,
      password,
      image: imageUrl,
      role: "admin",
    });

    const savedUser = await newUser.save();

    // Return response without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});
const updateUser = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;

    const updateUser = await userModel.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!updateUser) res.status(404).json({ message: "User not found!" });

    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await userModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Users not found!" });
    }

    res.status(200).json({ message: "Deleted Successfully!" });
  } catch (error) {
    console.log(error);
  }
});

export { createUser, updateUser, getUsers, getUserId, deleteUser, testCreate };
