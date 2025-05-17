import express from "express";
import {
  getStudents,
  getStudentsByProgram,
  searchStudents,
  getStudentsByYearLevel,
  getNewStudentsTrend,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controller/studentController.js";

const studentRouter = express.Router();

// Basic CRUD routes
studentRouter.get("/", getStudents);
studentRouter.get("/search", searchStudents);
studentRouter.get("/by-program", getStudentsByProgram);
studentRouter.get("/by-year", getStudentsByYearLevel);
studentRouter.get("/trend", getNewStudentsTrend);
studentRouter.get("/:id", getStudentById);
studentRouter.post("/", createStudent);
studentRouter.put("/:id", updateStudent);
studentRouter.delete("/:id", deleteStudent);

export default studentRouter;
