"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import axios from "axios"
import { apiURL } from "@/contexts/AuthStore"
import toast from "react-hot-toast"

// Assuming you have a store or context for user data
// If not, you can modify this to use local state or props
const Header = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  // Replace with your actual data fetching logic
  const [userData, setUserData] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)

    // Get user data from localStorage or fetch from API
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUserData(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (userData && isDialogOpen) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      })
    }
  }, [userData, isDialogOpen])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const handleProfileClick = () => {
    setIsDialogOpen(true)
    setIsDropdownOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async () => {
    console.log(userData)
    setIsSubmitting(true)


    try {
      if (!token) {
        alert("No authentication token found")
        return
      }

      // Replace with your actual API endpoint
      await axios.post(`${apiURL}/api/user/update`, { formData, _id: userData?.id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success("Profile updated successfully")

      // Update local storage with new user data
      if (userData) {
        const updatedUser = { ...userData, ...formData }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUserData(updatedUser)
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full">
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left side - Empty or can contain page title */}
          <div className="flex items-center md:hidden">
            {/* Space for mobile menu button which is now in Sidebar component */}
          </div>

          {/* Right side - User controls */}
          <div className="ml-auto flex items-center gap-2">
            {/* Notification button */}
            {/* <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button> */}

            {/* Profile dropdown with dialog integration */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.image || "/avatars/default.png"} alt="User" />
                      <AvatarFallback>{userData?.name?.charAt(0) || <User className="h-4 w-4" />}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userData?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dialog */}
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" value={formData.email} onChange={handleInputChange} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmit} type="button" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
