"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useStudent } from "@/hooks/useStudents"
import type { Student } from "@/types"
import { toast } from "react-hot-toast"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Icons
import { MoreHorizontal, Pencil, Trash2, Eye, Filter, X, Save, UserPlus } from "lucide-react"

// Define filter types
interface Filters {
  program: string
  yearLevel: string
}

// Define new student form data
interface StudentFormData {
  firstName: string
  lastName: string
  email: string
  program: string
  yearLevel: string
}

const StudentDataTable = () => {
  // React Query hooks
  const { getStudentsQuery, createStudentMutation, updateStudentMutation, deleteStudentMutation } = useStudent()

  // State for UI
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    program: "all",
    yearLevel: "all",
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [newStudent, setNewStudent] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    program: "",
    yearLevel: "",
  })

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filters.program !== "all") count++
    if (filters.yearLevel !== "all") count++
    setActiveFiltersCount(count)
  }, [filters])

  // Handle view student
  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsViewDialogOpen(true)
  }

  // Handle edit student
  const handleEditStudent = (student: Student) => {
    setEditingStudent({ ...student })
    setIsEditDialogOpen(true)
  }

  // Handle delete student
  const handleDeleteStudent = (studentId: string) => {
    setStudentToDelete(studentId)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete student
  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return

    try {
      await deleteStudentMutation.mutateAsync(studentToDelete)
      setIsViewDialogOpen(false)
      setIsDeleteDialogOpen(false)
      setStudentToDelete(null)
      toast.success("Student has been successfully deleted.")
    } catch (error) {
      console.error("Failed to delete student:", error)
      toast.error("Failed to delete student. Please try again.")
    }
  }

  // Handle save student (edit)
  const handleSaveStudent = async () => {
    if (!editingStudent) return

    try {
      await updateStudentMutation.mutateAsync({
        id: editingStudent._id,
        userData: editingStudent,
      })
      setIsEditDialogOpen(false)
      setEditingStudent(null)
    } catch (error) {
      console.error("Failed to update student:", error)
      toast.error("There was an error updating the student. Please try again.")
    }
  }

  // Handle add new student
  const handleAddStudent = async () => {
    try {
      await createStudentMutation.mutateAsync(newStudent as any)
      setIsAddDialogOpen(false)
      // Reset form
      setNewStudent({
        firstName: "",
        lastName: "",
        email: "",
        program: "",
        yearLevel: "",
      })
    } catch (error) {
      console.error("Failed to add student:", error)
      toast.error("There was an error adding the student. Please try again.")
    }
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      program: "all",
      yearLevel: "all",
    })
  }

  // Dialog state handlers
  const handleViewDialogChange = (open: boolean) => {
    setIsViewDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setSelectedStudent(null)
      }, 100)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setEditingStudent(null)
      }, 100)
    }
  }

  const handleAddDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open)
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setStudentToDelete(null)
      }, 100)
    }
  }

  // Filter and pagination logic
  const filteredData = getStudentsQuery.data
    ? getStudentsQuery.data.filter((student: Student) => {
      // Text search filter
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.program?.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      // Program filter
      if (filters.program !== "all" && student.program !== filters.program) {
        return false
      }

      // Year level filter
      if (filters.yearLevel !== "all" && student.yearLevel !== filters.yearLevel) {
        return false
      }

      return true
    })
    : []

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Loading and error states
  if (getStudentsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading students...</p>
        </div>
      </div>
    )
  }

  if (getStudentsQuery.isError) {
    return <div className="p-4 text-red-500">Error loading student data. Please try again.</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Students</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Program</label>
                  <Select value={filters.program} onValueChange={(value) => setFilters({ ...filters, program: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Business Administration">Business Administration</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year Level</label>
                  <Select
                    value={filters.yearLevel}
                    onValueChange={(value) => setFilters({ ...filters, yearLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Year Levels</SelectItem>
                      <SelectItem value="1">First Year</SelectItem>
                      <SelectItem value="2">Second Year</SelectItem>
                      <SelectItem value="3">Third Year</SelectItem>
                      <SelectItem value="4">Fourth Year</SelectItem>
                      <SelectItem value="5">Fifth Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <Card className="mb-4">
          <CardContent className="py-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active Filters:</span>

              {filters.program !== "all" && (
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm">
                  Program: {filters.program}
                  <button
                    onClick={() => setFilters({ ...filters, program: "all" })}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.yearLevel !== "all" && (
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm">
                  Year Level: {filters.yearLevel}
                  <button
                    onClick={() => setFilters({ ...filters, yearLevel: "all" })}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto text-xs h-7">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Year Level</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((student: Student) => (
                <TableRow key={student._id}>
                  <TableCell className="font-medium">{student._id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell>{student.yearLevel}</TableCell>
                  <TableCell>{student.createdAt ? format(new Date(student.createdAt), "PP") : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={openMenuId === student._id}
                      onOpenChange={(open) => {
                        setOpenMenuId(open ? student._id : null)
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            handleViewStudent(student)
                            setOpenMenuId(null)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleEditStudent(student)
                            setOpenMenuId(null)
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            handleDeleteStudent(student._id)
                            setOpenMenuId(null)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
          {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} students
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNumber: number

                // Logic to show pages around current page
                if (totalPages <= 5) {
                  pageNumber = index + 1
                } else if (currentPage <= 3) {
                  pageNumber = index + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index
                } else {
                  pageNumber = currentPage - 2 + index
                }

                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink onClick={() => paginate(pageNumber)} isActive={currentPage === pageNumber}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                return null
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={handleViewDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>View detailed information about this student</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4">
              <div className="py-4 space-y-4">
                <DetailRow label="ID" value={selectedStudent._id} />
                <DetailRow label="Name" value={`${selectedStudent.firstName} ${selectedStudent.lastName}`} />
                <DetailRow label="Email" value={selectedStudent.email} />
                <DetailRow label="Program" value={selectedStudent.program || "N/A"} />
                <DetailRow label="Year Level" value={selectedStudent.yearLevel || "N/A"} />
                <DetailRow
                  label="Created At"
                  value={selectedStudent.createdAt ? format(new Date(selectedStudent.createdAt), "PPpp") : "N/A"}
                />
              </div>

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleEditStudent(selectedStudent)
                    setIsViewDialogOpen(false)
                  }}
                >
                  Edit Student
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteStudent(selectedStudent._id)}>
                  Delete Student
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Make changes to student information</DialogDescription>
          </DialogHeader>

          {editingStudent && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-firstname" className="text-right">
                    First Name
                  </Label>
                  <Input
                    id="edit-firstname"
                    value={editingStudent.firstName}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        firstName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-lastname" className="text-right">
                    Last Name
                  </Label>
                  <Input
                    id="edit-lastname"
                    value={editingStudent.lastName}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        lastName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        email: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-program" className="text-right">
                    Program
                  </Label>
                  <Select
                    value={editingStudent.program || ""}
                    onValueChange={(value) =>
                      setEditingStudent({
                        ...editingStudent,
                        program: value,
                      })
                    }
                  >
                    <SelectTrigger id="edit-program" className="col-span-3">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Business Administration">Business Administration</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-yearlevel" className="text-right">
                    Year Level
                  </Label>
                  <Select
                    value={editingStudent.yearLevel || ""}
                    onValueChange={(value) =>
                      setEditingStudent({
                        ...editingStudent,
                        yearLevel: value,
                      })
                    }
                  >
                    <SelectTrigger id="edit-yearlevel" className="col-span-3">
                      <SelectValue placeholder="Select year level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">First Year</SelectItem>
                      <SelectItem value="2">Second Year</SelectItem>
                      <SelectItem value="3">Third Year</SelectItem>
                      <SelectItem value="4">Fourth Year</SelectItem>
                      <SelectItem value="5">Fifth Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStudent} disabled={updateStudentMutation.isPending} className="gap-2">
                  {updateStudentMutation.isPending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Enter the details for the new student</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-firstname" className="text-right">
                  First Name
                </Label>
                <Input
                  id="add-firstname"
                  value={newStudent.firstName}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      firstName: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-lastname" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="add-lastname"
                  value={newStudent.lastName}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      lastName: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="add-email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      email: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-program" className="text-right">
                  Program
                </Label>
                <Select
                  value={newStudent.program}
                  onValueChange={(value) =>
                    setNewStudent({
                      ...newStudent,
                      program: value,
                    })
                  }
                >
                  <SelectTrigger id="add-program" className="col-span-3">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Medicine">Medicine</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-yearlevel" className="text-right">
                  Year Level
                </Label>
                <Select
                  value={newStudent.yearLevel}
                  onValueChange={(value) =>
                    setNewStudent({
                      ...newStudent,
                      yearLevel: value,
                    })
                  }
                >
                  <SelectTrigger id="add-yearlevel" className="col-span-3">
                    <SelectValue placeholder="Select year level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">First Year</SelectItem>
                    <SelectItem value="2">Second Year</SelectItem>
                    <SelectItem value="3">Third Year</SelectItem>
                    <SelectItem value="4">Fourth Year</SelectItem>
                    <SelectItem value="5">Fifth Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent} disabled={createStudentMutation.isPending} className="gap-2">
                {createStudentMutation.isPending && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <UserPlus className="h-4 w-4 mr-1" />
                Add Student
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteStudent}
              disabled={deleteStudentMutation.isPending}
              className="gap-2"
            >
              {deleteStudentMutation.isPending && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper component
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <span className="text-sm font-medium text-gray-500">{label}:</span>
    <span className="col-span-3 text-sm break-all">{value}</span>
  </div>
)

export default StudentDataTable
