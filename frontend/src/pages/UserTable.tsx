import { useState, useEffect } from "react"
import type { User } from "@/types"
import axios from "axios"
import { apiURL } from "@/contexts/AuthStore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Pencil, Trash2, Eye, Filter, X, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
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
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

// Define filter types
interface Filters {
  status: string
  role: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

const UserDataTable = () => {
  const [data, setData] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    role: "all",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const navigate = useNavigate()

  // Add a new state for the delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.post(`${apiURL}/api/user/get`, {})
        setData(response.data)
      } catch (error) {
        console.error("Failed to fetch users:", error)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filters.status !== "all") count++
    if (filters.role !== "all") count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    setActiveFiltersCount(count)
  }, [filters])

  // Replace the handleDeleteUser function with this new implementation
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  // Add a new function to handle the actual deletion
  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await axios.post(`${apiURL}/api/user/delete`, {
        data: { id: userToDelete },
      })
      setData(data.filter((user) => user._id !== userToDelete))
      setIsViewDialogOpen(false)
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)

      toast.success("User has been successfully deleted.")
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast.error("Failed to delete user. Please try again.")
    }
  }

  // Handle user deletion
  // const handleDeleteUser = async (userId: string) => {
  //   if (!window.confirm(`Are you sure you want to delete this user?`)) return

  //   try {
  //     await axios.delete(`${apiURL}/api/user/delete`, {
  //       data: { id: userId },
  //     })
  //     setData(data.filter((user) => user._id !== userId))
  //     setIsViewDialogOpen(false)
  //   } catch (error) {
  //     console.error("Failed to delete user:", error)
  //   }
  // }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user })
    setIsEditDialogOpen(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    try {
      setIsSaving(true)
      // Make API call to update user
      await axios.put(`${apiURL}/api/user/update`, editingUser)

      // Update local data
      setData(data.map((user) => (user._id === editingUser._id ? editingUser : user)))

      // Close dialog
      setIsEditDialogOpen(false)
      setEditingUser(null)

      // Show success message
      toast.success("User information has been successfully updated.")
    } catch (error) {
      console.error("Failed to update user:", error)
      toast.error("There was an error updating the user. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewDialogChange = (open: boolean) => {
    setIsViewDialogOpen(open)
    if (!open) {
      // Small delay to prevent immediate re-opening of dropdown
      setTimeout(() => {
        setSelectedUser(null)
      }, 100)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      // Small delay to prevent immediate re-opening of dropdown
      setTimeout(() => {
        setEditingUser(null)
      }, 100)
    }
  }

  // Add a function to handle the delete dialog state changes
  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open)
    if (!open) {
      // Small delay to prevent immediate re-opening of dropdown
      setTimeout(() => {
        setUserToDelete(null)
      }, 100)
    }
  }

  const resetFilters = () => {
    setFilters({
      status: "all",
      role: "all",
      dateRange: {
        from: undefined,
        to: undefined,
      },
    })
  }

  // Filter and pagination logic
  const filteredData = data.filter((user) => {
    // Text search filter
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    // Status filter
    if (filters.status !== "all" && user.status !== filters.status) {
      return false
    }

    // Role filter
    if (filters.role !== "all" && user.role !== filters.role) {
      return false
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const createdAt = new Date(user.createdAt || "")

      if (filters.dateRange.from && createdAt < filters.dateRange.from) {
        return false
      }

      if (filters.dateRange.to) {
        const endDate = new Date(filters.dateRange.to)
        endDate.setHours(23, 59, 59, 999) // End of the day
        if (createdAt > endDate) {
          return false
        }
      }
    }

    return true
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Search users..."
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
                  <Badge className="ml-2 bg-primary text-primary-foreground">{activeFiltersCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Users</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Created Date</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">From</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                            {filters.dateRange.from ? (
                              format(filters.dateRange.from, "PP")
                            ) : (
                              <span className="text-muted-foreground">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.from}
                            onSelect={(date) =>
                              setFilters({
                                ...filters,
                                dateRange: { ...filters.dateRange, from: date },
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">To</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                            {filters.dateRange.to ? (
                              format(filters.dateRange.to, "PP")
                            ) : (
                              <span className="text-muted-foreground">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.to}
                            onSelect={(date) =>
                              setFilters({
                                ...filters,
                                dateRange: { ...filters.dateRange, to: date },
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
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

        <Button onClick={() => navigate("/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <Card className="mb-4">
          <CardContent className="py-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active Filters:</span>

              {filters.status !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: "all" })}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {filters.role !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Role: {filters.role}
                  <button onClick={() => setFilters({ ...filters, role: "all" })} className="ml-1 hover:text-gray-700">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {(filters.dateRange.from || filters.dateRange.to) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date: {filters.dateRange.from ? format(filters.dateRange.from, "PP") : "Any"}
                  {" - "}
                  {filters.dateRange.to ? format(filters.dateRange.to, "PP") : "Any"}
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        dateRange: { from: undefined, to: undefined },
                      })
                    }
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto text-xs h-7">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Loading users...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user._id.substring(0, 8)}...</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active"
                              ? "success"
                              : user.status === "inactive"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {user.status || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.role || "N/A"}</TableCell>
                      <TableCell>{user.createdAt ? format(new Date(user.createdAt), "PP") : "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu
                          open={openMenuId === user._id}
                          onOpenChange={(open) => {
                            setOpenMenuId(open ? user._id : null)
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
                                handleViewUser(user)
                                setOpenMenuId(null)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                handleEditUser(user)
                                setOpenMenuId(null)
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                handleDeleteUser(user._id)
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

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
              {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} users
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
        </>
      )}

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={handleViewDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View detailed information about this user</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="py-4 space-y-4">
                <DetailRow label="ID" value={selectedUser._id} />
                <DetailRow label="Name" value={selectedUser.name} />
                <DetailRow label="Email" value={selectedUser.email} />
                <DetailRow label="Status" value={selectedUser.status || "N/A"} />
                <DetailRow label="Role" value={selectedUser.role || "N/A"} />
                <DetailRow
                  label="Created At"
                  value={selectedUser.createdAt ? format(new Date(selectedUser.createdAt), "PPpp") : "N/A"}
                />
              </div>

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleEditUser(selectedUser)
                    setIsViewDialogOpen(false)
                  }}
                >
                  Edit User
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteUser(selectedUser._id)}>
                  Delete User
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Make changes to user information</DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
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
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={editingUser.status || ""}
                    onValueChange={(value) => setEditingUser({ ...editingUser, status: value })}
                  >
                    <SelectTrigger id="edit-status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={editingUser.role || ""}
                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                  >
                    <SelectTrigger id="edit-role" className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser} disabled={isSaving} className="gap-2">
                  {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add the Delete Confirmation Dialog at the end of the component, right after the Edit User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser} className="gap-2">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete User
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

export default UserDataTable
