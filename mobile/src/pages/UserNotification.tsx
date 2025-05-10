import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Trash2, Eye, Search, Send, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define TypeScript interfaces
interface Notification {
  id: string
  title: string
  message: string
  type: "payment" | "invoice" | "system"
  status: "read" | "unread"
  date: string
  recipient: string
}

interface Template {
  id: string
  name: string
  subject: string
  body: string
  type: "email" | "sms" | "push"
}

// Mock data for notifications
const initialNotifications: Notification[] = [
  {
    id: "not-001",
    title: "Payment Successful",
    message: "Your payment of $250.00 has been processed successfully.",
    type: "payment",
    status: "read",
    date: "2023-05-15 14:30",
    recipient: "john@example.com",
  },
  {
    id: "not-002",
    title: "Invoice Generated",
    message: "Invoice #INV-2023-001 has been generated and is ready for review.",
    type: "invoice",
    status: "unread",
    date: "2023-05-16 10:15",
    recipient: "jane@example.com",
  },
  {
    id: "not-003",
    title: "Payment Failed",
    message: "Your payment of $350.00 has failed. Please check your payment details and try again.",
    type: "payment",
    status: "unread",
    date: "2023-05-17 09:45",
    recipient: "robert@example.com",
  },
  {
    id: "not-004",
    title: "System Maintenance",
    message: "The payment system will be undergoing maintenance on May 20, 2023 from 2:00 AM to 4:00 AM UTC.",
    type: "system",
    status: "read",
    date: "2023-05-18 16:20",
    recipient: "all-users",
  },
  {
    id: "not-005",
    title: "Invoice Overdue",
    message: "Invoice #INV-2023-003 is now overdue. Please make your payment as soon as possible.",
    type: "invoice",
    status: "unread",
    date: "2023-05-19 11:30",
    recipient: "robert@example.com",
  },
]

// Mock data for templates
const initialTemplates: Template[] = [
  {
    id: "temp-001",
    name: "Payment Confirmation",
    subject: "Payment Confirmation - Receipt #{payment_id}",
    body: "Dear {customer_name},\n\nThank you for your payment of ${amount}. Your transaction has been processed successfully.\n\nTransaction ID: {payment_id}\nDate: {payment_date}\nAmount: ${amount}\nPayment Method: {payment_method}\n\nIf you have any questions, please contact our support team.\n\nBest regards,\nPayment System Team",
    type: "email",
  },
  {
    id: "temp-002",
    name: "Invoice Generated",
    subject: "New Invoice #{invoice_id}",
    body: "Dear {customer_name},\n\nA new invoice has been generated for your account.\n\nInvoice ID: {invoice_id}\nDate: {invoice_date}\nDue Date: {due_date}\nAmount: ${amount}\n\nPlease log in to your account to view and pay the invoice.\n\nBest regards,\nPayment System Team",
    type: "email",
  },
  {
    id: "temp-003",
    name: "Payment Failed",
    subject: "Payment Failed - Action Required",
    body: "Dear {customer_name},\n\nWe were unable to process your payment of ${amount}.\n\nTransaction ID: {payment_id}\nDate: {payment_date}\nAmount: ${amount}\nPayment Method: {payment_method}\n\nPlease check your payment details and try again. If you continue to experience issues, please contact our support team.\n\nBest regards,\nPayment System Team",
    type: "email",
  },
  {
    id: "temp-004",
    name: "Payment Reminder SMS",
    subject: "Payment Reminder",
    body: "Payment reminder: Your invoice #{invoice_id} for ${amount} is due on {due_date}. Please log in to make your payment.",
    type: "sms",
  },
  {
    id: "temp-005",
    name: "Payment Received Push",
    subject: "Payment Received",
    body: "Your payment of ${amount} has been received. Thank you!",
    type: "push",
  },
]

export default function UserNotifications(): React.ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState<boolean>(false)
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    title: "",
    message: "",
    type: "system",
    recipient: "",
  })
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: "",
    subject: "",
    body: "",
    type: "email",
  })

  // Filter notifications based on search term and filters
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipient.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  // Handle notification actions
  const handleView = (notification: Notification): void => {
    setSelectedNotification(notification)
    setIsViewDialogOpen(true)

    // Mark as read if unread
    if (notification.status === "unread") {
      const updatedNotifications = notifications.map((n) =>
        n.id === notification.id ? { ...n, status: "read" as const } : n,
      )
      setNotifications(updatedNotifications)
    }
  }

  const handleDelete = (notification: Notification): void => {
    setNotifications(notifications.filter((n) => n.id !== notification.id))
  }

  // Create new notification
  const handleCreateNotification = (): void => {
    const id = `not-${String(notifications.length + 1).padStart(3, "0")}`
    const newNotificationWithId = {
      ...newNotification,
      id,
      status: "unread" as const,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
    } as Notification

    setNotifications([newNotificationWithId, ...notifications])
    setIsCreateDialogOpen(false)
    setNewNotification({
      title: "",
      message: "",
      type: "system",
      recipient: "",
    })
  }

  // Create new template
  const handleCreateTemplate = (): void => {
    const id = `temp-${String(templates.length + 1).padStart(3, "0")}`
    const newTemplateWithId = {
      ...newTemplate,
      id,
    } as Template

    setTemplates([...templates, newTemplateWithId])
    setIsTemplateDialogOpen(false)
    setNewTemplate({
      name: "",
      subject: "",
      body: "",
      type: "email",
    })
  }

  // Use template for new notification
  const handleUseTemplate = (template: Template): void => {
    setSelectedTemplate(template)
    setNewNotification({
      ...newNotification,
      title: template.subject,
      message: template.body,
    })
  }

  // Render notification type badge with appropriate color
  const renderTypeBadge = (type: Notification["type"]): React.ReactNode => {
    switch (type) {
      case "payment":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Payment</Badge>
      case "invoice":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Invoice</Badge>
      case "system":
        return <Badge className="bg-gray-500 hover:bg-gray-600">System</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  // Render template type badge with appropriate color
  const renderTemplateTypeBadge = (type: Template["type"]): React.ReactNode => {
    switch (type) {
      case "email":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Email</Badge>
      case "sms":
        return <Badge className="bg-green-500 hover:bg-green-600">SMS</Badge>
      case "push":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Push</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">User Notifications</h1>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Notification Templates</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage and send notifications to users.</CardDescription>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Bell className="mr-2 h-4 w-4" />
                  Create Notification
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No notifications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <TableRow
                          key={notification.id}
                          className={notification.status === "unread" ? "bg-muted/30" : ""}
                        >
                          <TableCell className="font-medium">{notification.title}</TableCell>
                          <TableCell>{renderTypeBadge(notification.type)}</TableCell>
                          <TableCell>{notification.recipient}</TableCell>
                          <TableCell>{notification.date}</TableCell>
                          <TableCell>
                            {notification.status === "unread" ? (
                              <Badge>Unread</Badge>
                            ) : (
                              <Badge variant="outline">Read</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleView(notification)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(notification)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div>
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Notification Templates</CardTitle>
                  <CardDescription>Manage templates for automated notifications.</CardDescription>
                </div>
                <Button onClick={() => setIsTemplateDialogOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{renderTemplateTypeBadge(template.type)}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="mb-2">
                        <div className="font-medium text-sm">Subject:</div>
                        <div className="text-sm text-muted-foreground">{template.subject}</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Body:</div>
                        <div className="text-sm text-muted-foreground line-clamp-3">{template.body}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 bg-muted/50 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template)
                          setIsCreateDialogOpen(true)
                          handleUseTemplate(template)
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Use
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-payment">Payment Notifications</Label>
                    <Switch id="email-payment" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for payment confirmations, failures, and reminders.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-invoice">Invoice Notifications</Label>
                    <Switch id="email-invoice" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications when invoices are generated, due, or overdue.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-system">System Notifications</Label>
                    <Switch id="email-system" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about system updates, maintenance, and important announcements.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-payment">Payment Notifications</Label>
                    <Switch id="sms-payment" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive SMS notifications for payment confirmations, failures, and reminders.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-invoice">Invoice Notifications</Label>
                    <Switch id="sms-invoice" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive SMS notifications when invoices are generated, due, or overdue.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-payment">Payment Notifications</Label>
                    <Switch id="push-payment" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications for payment confirmations, failures, and reminders.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-invoice">Invoice Notifications</Label>
                    <Switch id="push-invoice" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications when invoices are generated, due, or overdue.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-system">System Notifications</Label>
                    <Switch id="push-system" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications about system updates, maintenance, and important announcements.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="ml-auto">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Notification Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>
              {renderTypeBadge(selectedNotification?.type as Notification["type"])}
              <span className="ml-2 text-muted-foreground">{selectedNotification?.date}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <div className="font-medium">Recipient:</div>
              <div>{selectedNotification?.recipient}</div>
            </div>
            <div>
              <div className="font-medium">Message:</div>
              <div className="mt-2 whitespace-pre-wrap">{selectedNotification?.message}</div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Notification Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Notification</DialogTitle>
            <DialogDescription>Send a notification to users.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notification-title" className="text-right">
                Title
              </Label>
              <Input
                id="notification-title"
                value={newNotification.title}
                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                className="col-span-3"
                placeholder="Notification title"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notification-type" className="text-right">
                Type
              </Label>
              <Select
                value={newNotification.type as string}
                onValueChange={(value) =>
                  setNewNotification({ ...newNotification, type: value as Notification["type"] })
                }
              >
                <SelectTrigger id="notification-type" className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notification-recipient" className="text-right">
                Recipient
              </Label>
              <Input
                id="notification-recipient"
                value={newNotification.recipient}
                onChange={(e) => setNewNotification({ ...newNotification, recipient: e.target.value })}
                className="col-span-3"
                placeholder="Email or 'all-users'"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notification-message" className="text-right pt-2">
                Message
              </Label>
              <Textarea
                id="notification-message"
                value={newNotification.message}
                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                className="col-span-3"
                rows={6}
                placeholder="Notification message"
              />
            </div>

            {selectedTemplate && (
              <div className="col-span-4 bg-muted p-3 rounded-md">
                <div className="text-sm font-medium mb-1">Using template: {selectedTemplate.name}</div>
                <div className="text-xs text-muted-foreground">
                  You can modify the content as needed. Template variables will be replaced with actual values when
                  sent.
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setSelectedTemplate(null)
                setNewNotification({
                  title: "",
                  message: "",
                  type: "system",
                  recipient: "",
                })
              }}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {templates.map((template) => (
                    <DropdownMenuItem key={template.id} onClick={() => handleUseTemplate(template)}>
                      {template.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleCreateNotification}
                disabled={!newNotification.title || !newNotification.message || !newNotification.recipient}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Notification Template</DialogTitle>
            <DialogDescription>Create a reusable template for notifications.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-name" className="text-right">
                Name
              </Label>
              <Input
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="col-span-3"
                placeholder="Template name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-type" className="text-right">
                Type
              </Label>
              <Select
                value={newTemplate.type as string}
                onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value as Template["type"] })}
              >
                <SelectTrigger id="template-type" className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-subject" className="text-right">
                Subject
              </Label>
              <Input
                id="template-subject"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                className="col-span-3"
                placeholder="Template subject"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="template-body" className="text-right pt-2">
                Body
              </Label>
              <Textarea
                id="template-body"
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                className="col-span-3"
                rows={8}
                placeholder="Template body"
              />
            </div>

            <div className="col-span-4 bg-muted p-3 rounded-md">
              <div className="text-sm font-medium mb-1">Available Variables:</div>
              <div className="text-xs text-muted-foreground">
                {"{customer_name}"}, {"{payment_id}"}, {"{payment_date}"}, {"{amount}"}, {"{payment_method}"},
                {"{invoice_id}"}, {"{invoice_date}"}, {"{due_date}"}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.body}
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
