import expressAsyncHandler from "express-async-handler";
import studentService from "../services/studentService.js";

export const getStudents = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 10, program, yearLevel } = req.query;

  // Build filters
  const filters = {};
  if (program) filters.program = program;
  if (yearLevel) filters.yearLevel = yearLevel;

  const result = await studentService.getStudents(
    filters,
    Number.parseInt(page),
    Number.parseInt(limit)
  );
  res.status(200).json(result);
});

export const getStudentById = expressAsyncHandler(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);
  if (!student) {
    res.status(404).json({ message: "Student not found" });
    return;
  }
  res.status(200).json(student);
});

export const createStudent = expressAsyncHandler(async (req, res) => {
  const newStudent = await studentService.createStudent(req.body);
  res.status(201).json(newStudent);
});

export const updateStudent = expressAsyncHandler(async (req, res) => {
  const updatedStudent = await studentService.updateStudent(
    req.params.id,
    req.body
  );
  res.status(200).json(updatedStudent);
});

export const deleteStudent = expressAsyncHandler(async (req, res) => {
  const result = await studentService.deleteStudent(req.params.id);
  res.status(200).json(result);
});

export const searchStudents = expressAsyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    res.status(400).json({ message: "Search query is required" });
    return;
  }

  const students = await studentService.searchStudents(query);
  res.status(200).json(students);
});

export const getStudentsByProgram = expressAsyncHandler(async (req, res) => {
  const distribution = await studentService.getStudentsByProgram();
  res.status(200).json(distribution);
});

export const getStudentsByYearLevel = expressAsyncHandler(async (req, res) => {
  const distribution = await studentService.getStudentsByYearLevel();
  res.status(200).json(distribution);
});

export const getNewStudentsTrend = expressAsyncHandler(async (req, res) => {
  const { months } = req.query;
  const trend = await studentService.getNewStudentsTrend(
    months ? Number.parseInt(months) : 6
  );
  res.status(200).json(trend);
});
