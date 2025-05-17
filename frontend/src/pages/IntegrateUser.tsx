"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { toast } from "react-hot-toast"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

// Icons
import { MoreHorizontal, Eye, Pencil, Trash2, Search, X } from "lucide-react"
import { apiURL } from "@/contexts/AuthStore"

interface User {
  image: {
    imageUrl: string
    publicId: string
  }
  id: string
  name: string
  email: string
  password: string
  role: string
  department: string
  createdAt: string
  updatedAt: string
}


const IntegrateUser = () => {
  // State for users data
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")

  // State for action dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${apiURL}/api/integrationapi`)

        console.log("API Response:", response.data.user.user)

        if (response.data && response.data.user && response.data.user.user && Array.isArray(response.data.user.user)) {
          setUsers(response.data.user.user)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        console.error("Failed to fetch users:", err)
        setError("Failed to load user data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Handle view user
  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser({ ...user })
    setIsEditDialogOpen(true)
  }

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  // Handle save edited user
  const handleSaveUser = async () => {
    if (!editingUser) return

    try {
      setIsSaving(true)

      // Create a copy without password and other sensitive fields
      const userToUpdate = {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        department: editingUser.department,
      }

      await axios.put(`https://sms-backend.imraffydev.com/api/account/users/${editingUser.id}`, userToUpdate)

      // Update local state
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)))

      setIsEditDialogOpen(false)
      toast.success("User updated successfully")
    } catch (err) {
      console.error("Failed to update user:", err)
      toast.error("Failed to update user. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    try {
      setIsSaving(true)
      await axios.delete(`https://sms-backend.imraffydev.com/api/account/users/${selectedUser.id}`)

      // Update local state
      setUsers(users.filter((user) => user.id !== selectedUser.id))

      setIsDeleteDialogOpen(false)
      toast.success("User deleted successfully")
    } catch (err) {
      console.error("Failed to delete user:", err)
      toast.error("Failed to delete user. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Dialog state handlers
  const handleViewDialogChange = (open: boolean) => {
    setIsViewDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setSelectedUser(null)
      }, 100)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setEditingUser(null)
      }, 100)
    }
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setSelectedUser(null)
      }, 100)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Search bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8"
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
      </div>

      {/* Users table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        {user.image?.imageUrl ? (
                          <img
                            src={user.image.imageUrl || "/placeholder.svg"}
                            alt={user.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role || "N/A"}</TableCell>
                    <TableCell>{user.department || "N/A"}</TableCell>
                    <TableCell>{user.createdAt ? format(new Date(user.createdAt), "PP") : "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu
                        open={openMenuId === user.id}
                        onOpenChange={(open) => {
                          setOpenMenuId(open ? user.id : null)
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
                              handleDeleteUser(user)
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
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={handleViewDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View detailed information about this user</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                  {selectedUser.image?.imageUrl ? (
                    <img
                      src={selectedUser.image.imageUrl || "/placeholder.svg"}
                      alt={selectedUser.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=random`
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-medium">
                      {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </div>

              <div className="py-4 space-y-4">
                <DetailRow label="ID" value={selectedUser.id} />
                <DetailRow label="Name" value={selectedUser.name} />
                <DetailRow label="Email" value={selectedUser.email} />
                <DetailRow label="Role" value={selectedUser.role || "N/A"} />
                <DetailRow label="Department" value={selectedUser.department || "N/A"} />
                <DetailRow
                  label="Created At"
                  value={selectedUser.createdAt ? format(new Date(selectedUser.createdAt), "PPpp") : "N/A"}
                />
                <DetailRow
                  label="Updated At"
                  value={selectedUser.updatedAt ? format(new Date(selectedUser.updatedAt), "PPpp") : "N/A"}
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
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteUser(selectedUser)
                    setIsViewDialogOpen(false)
                  }}
                >
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
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-department" className="text-right">
                    Department
                  </Label>
                  <Select
                    value={editingUser.department || ""}
                    onValueChange={(value) => setEditingUser({ ...editingUser, department: value })}
                  >
                    <SelectTrigger id="edit-department" className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FCMS">FCMS</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="FINANCE">Finance</SelectItem>
                      <SelectItem value="MARKETING">Marketing</SelectItem>
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
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <p className="mb-4">
                You are about to delete the user: <span className="font-semibold">{selectedUser.name}</span>
              </p>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isSaving} className="gap-2">
              {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper component for displaying details in the view dialog
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <span className="text-sm font-medium text-gray-500">{label}:</span>
    <span className="col-span-3 text-sm break-all">{value}</span>
  </div>
)

export default IntegrateUser
