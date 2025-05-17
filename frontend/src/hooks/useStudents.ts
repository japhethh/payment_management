import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { studentApi } from "@/api/student.api"
import type { Student } from "@/types"
import { toast } from "react-hot-toast"

export const useStudent = () => {
  const queryClient = useQueryClient()

  const getStudentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: () => studentApi.getStudents(),
  })

  const getStudentsByProgramQuery = useQuery({
    queryKey: ["students", "by-program"],
    queryFn: () => studentApi.getStudentsByProgram(),
  })

  const getStudentsByYearLevelQuery = useQuery({
    queryKey: ["students", "by-year"],
    queryFn: () => studentApi.getStudentsByYearLevel(),
  })

  const getNewStudentsTrendQuery = useQuery({
    queryKey: ["students", "trend"],
    queryFn: () => studentApi.getNewStudentsTrend(),
  })

  const createStudentMutation = useMutation({
    mutationFn: (userData: Student) => studentApi.createStudent(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast.success("Student created successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to create student:", error)
      toast.error("Failed to create student. Please check the form and try again.")
    },
  })

  const updateStudentMutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Student }) => studentApi.updateStudent(id, userData),
    onSuccess: (data, variables) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ["students"] })
      queryClient.invalidateQueries({ queryKey: ["students", variables.id] })
      toast.success("Student updated successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to update student:", error)
      toast.error("Failed to update student. Please check the form and try again.")
    },
  })

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => studentApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast.success("Student deleted successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to delete student:", error)
      toast.error("Failed to delete student. Please try again.")
    },
  })

  const getStudentByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ["students", id],
      queryFn: () => studentApi.getStudentById(id),
      enabled: !!id,
    })
  }

  return {
    getStudentsQuery,
    getStudentByIdQuery,
    createStudentMutation,
    updateStudentMutation,
    deleteStudentMutation,
    getStudentsByProgramQuery,
    getStudentsByYearLevelQuery,
    getNewStudentsTrendQuery,
  }
}
