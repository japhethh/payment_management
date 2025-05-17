import api from "@/lib/axios"
import type { Student } from "@/types"

export const studentApi = {
  // Get all students
  getStudents: async (): Promise<any> => {
    const response = await api.get("/students")
    return response.data
  },

  // Get student by ID
  getStudentById: async (id: string): Promise<Student> => {
    const response = await api.get<Student>(`/students/${id}`)
    return response.data
  },



  // Create new student
  createStudent: async (userData: Student): Promise<Student> => {
    const response = await api.post<Student>("/students", userData)
    return response.data
  },

  // Update student
  updateStudent: async (id: string, userData: Student): Promise<Student> => {
    const response = await api.put<Student>(`/students/${id}`, userData)
    return response.data
  },

  // Delete student
  deleteStudent: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`)
  },

  // Get student statistics by program
  getStudentsByProgram: async (): Promise<any> => {
    const response = await api.get("/students/by-program")
    return response.data
  },

  // Get student statistics by year level
  getStudentsByYearLevel: async (): Promise<any> => {
    const response = await api.get("/students/by-year")
    return response.data
  },

  // Get new students trend
  getNewStudentsTrend: async (): Promise<any> => {
    const response = await api.get("/students/trend")
    return response.data
  },
}
