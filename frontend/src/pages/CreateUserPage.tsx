"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { apiURL } from "@/contexts/AuthStore"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

type FormValues = z.infer<typeof formSchema>

// 1. Define form schema
const formSchema = z
  .object({
    image: z.instanceof(FileList).refine((files) => files?.length > 0, "Image is required"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "superadmin"], {
      errorMap: () => ({ message: "Please select a valid role" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// 2. Create form component
export default function RegistrationForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
      confirmPassword: "",
    },
  })

  const route = useNavigate()

  // Clean up the object URL when component unmounts or when a new image is selected
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageChange = (files: FileList | null) => {
    // Clean up previous preview if it exists
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    if (files && files.length > 0) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(files[0])
      setImagePreview(previewUrl)
    } else {
      setImagePreview(null)
    }

    // Update form value
    form.setValue("image", files as FileList, { shouldValidate: true })
  }

  const clearImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
      form.setValue("image", undefined as any, { shouldValidate: true })

      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    }
  }

  const handleSubmit = async (data: FormValues) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("role", data.role)

    if (data.image?.[0]) {
      formData.append("image", data.image[0])
    }

    try {
      const response = await axios.post(`${apiURL}/api/user/testCreate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      form.reset()
      setImagePreview(null)

      route("/users")
      toast.success("Registration successful")

      console.log("Registration successful:", response.data)
    } catch (error) {
      console.error("Registration failed:", error)
      toast.error("Registration failed")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex justify-between items-center"></div>

      <h2 className="text-2xl font-bold text-center mb-6">Create an account</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* File upload field with preview */}
          <FormField
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <div className="space-y-2">
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files)} />
                  </FormControl>

                  {/* Image preview */}
                  {imagePreview && (
                    <div className="relative w-20 h-20 mt-2">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={clearImagePreview}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Text input fields */}
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role field */}
          <FormField
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
    </div>
  )
}
