import Student from "../models/Student.js";

class StudentService {
  async createStudent(studentData) {
    // Check if student with email already exists
    const existingStudent = await Student.findOne({ email: studentData.email });
    if (existingStudent) {
      throw new Error("Student with this email already exists");
    }

    const student = new Student(studentData);
    return await student.save();
  }

  async getStudents(filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const students = await Student.find(filters)
      .sort({ lastName: 1, firstName: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments(filters);

    return {
      students,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getStudentById(id) {
    const student = await Student.findById(id);
    if (!student) throw new Error("Student not found");
    return student;
  }

  async updateStudent(id, updateData) {
    // Handle nested structure if present
    if (updateData?.userData && updateData?.id) {
      id = updateData.id;
      updateData = updateData.userData;
    }

    // Remove fields that shouldn't be updated
    const cleanUpdateData = { ...updateData };
    delete cleanUpdateData._id;
    delete cleanUpdateData.__v;

    try {
      // Check if student exists
      const student = await Student.findById(id);
      if (!student) {
        throw new Error("Student not found");
      }

      // If email is being updated, check if it's already in use
      if (cleanUpdateData.email && cleanUpdateData.email !== student.email) {
        const existingStudent = await Student.findOne({
          email: cleanUpdateData.email,
        });
        if (existingStudent) {
          throw new Error("Email is already in use");
        }
      }

      // Update student
      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { $set: cleanUpdateData },
        { new: true, runValidators: true }
      );

      return updatedStudent;
    } catch (error) {
      // Provide specific error messages based on error type
      if (error.name === "CastError")
        throw new Error("Invalid student ID format");
      if (error.name === "ValidationError")
        throw new Error(`Validation error: ${error.message}`);
      throw error;
    }
  }

  async deleteStudent(id) {
    const student = await Student.findByIdAndDelete(id);
    if (!student) throw new Error("Student not found");
    return { message: "Student deleted successfully" };
  }

  async searchStudents(query) {
    const searchRegex = new RegExp(query, "i");

    const students = await Student.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { program: searchRegex },
      ],
    }).limit(10);

    return students;
  }

  async getStudentsByProgram() {
    const programDistribution = await Student.aggregate([
      {
        $group: {
          _id: "$program",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return programDistribution;
  }

  async getStudentsByYearLevel() {
    const yearLevelDistribution = await Student.aggregate([
      {
        $group: {
          _id: "$yearLevel",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return yearLevelDistribution;
  }

  async getNewStudentsTrend(months = 6) {
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - months);

    const trend = await Student.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Transform to a more usable format with month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return trend.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      count: item.count,
    }));
  }
}

export default new StudentService(); // Export an instance
