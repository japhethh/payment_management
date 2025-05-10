import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Pencil, Trash2, Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define TypeScript interfaces
interface Payment {
  id: string
  customer: string
  email: string
  amount: number
  status: "completed" | "pending" | "failed"
  method: "Credit Card" | "PayPal" | "Bank Transfer"
  date: string
}

// Mock data for payments
const initialPayments: Payment[] = [
  {
    id: "INV001",
    customer: "John Doe",
    email: "john@example.com",
    amount: 250.0,
    status: "completed",
    method: "Credit Card",
    date: "2023-05-15",
  },
  {
    id: "INV002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 150.0,
    status: "pending",
    method: "PayPal",
    date: "2023-05-16",
  },
  {
    id: "INV003",
    customer: "Robert Johnson",
    email: "robert@example.com",
    amount: 350.0,
    status: "failed",
    method: "Bank Transfer",
    date: "2023-05-17",
  },
  {
    id: "INV004",
    customer: "Emily Davis",
    email: "emily@example.com",
    amount: 450.0,
    status: "completed",
    method: "Credit Card",
    date: "2023-05-18",
  },
  {
    id: "INV005",
    customer: "Michael Wilson",
    email: "michael@example.com",
    amount: 550.0,
    status: "completed",
    method: "PayPal",
    date: "2023-05-19",
  },
]

export default function PaymentProcess(): React.ReactElement {
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Filter payments based on search term and filters
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  // Handle payment actions
  const handleView = (payment: Payment): void => {
    setSelectedPayment(payment)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (payment: Payment): void => {
    setSelectedPayment({ ...payment })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (payment: Payment): void => {
    setSelectedPayment(payment)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = (): void => {
    if (selectedPayment) {
      setPayments(payments.filter((p) => p.id !== selectedPayment.id))
      setIsDeleteDialogOpen(false)
    }
  }

  const saveEdit = (): void => {
    if (selectedPayment) {
      setPayments(payments.map((p) => (p.id === selectedPayment.id ? selectedPayment : p)))
      setIsEditDialogOpen(false)
    }
  }

  // Handle dialog open/close
  const handleViewDialogChange = (open: boolean): void => {
    setIsViewDialogOpen(open)
    if (!open) {
      // Small delay to prevent immediate re-opening of dropdown
      setTimeout(() => {
        setSelectedPayment(null)
      }, 100)
    }
  }

  const handleEditDialogChange = (open: boolean): void => {
    setIsEditDialogOpen(open)
    if (!open) {
      // Small delay to prevent immediate re-opening of dropdown
      setTimeout(() => {
        setSelectedPayment(null)
      }, 100)
    }
  }

  const handleDeleteDialogChange = (open: boolean): void => {
    setIsDeleteDialogOpen(open)
    if (!open) {
      // Small delay to prevent immediate re-opening of dropdown
      setTimeout(() => {
        setSelectedPayment(null)
      }, 100)
    }
  }

  // Render status badge with appropriate color
  const renderStatusBadge = (status: Payment["status"]): React.ReactNode => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Payment Management</h1>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="new-payment">New Payment</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>View and manage all payment transactions.</CardDescription>

              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, customer or email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
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
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No payments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>
                            {payment.customer}
                            <div className="text-sm text-muted-foreground">{payment.email}</div>
                          </TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>{renderStatusBadge(payment.status)}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell className="text-right font-medium">${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <DropdownMenu
                                open={openMenuId === payment.id}
                                onOpenChange={(open) => {
                                  setOpenMenuId(open ? payment.id : null)
                                }}
                              >
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      handleView(payment)
                                      setOpenMenuId(null)
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      handleEdit(payment)
                                      setOpenMenuId(null)
                                    }}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      handleDelete(payment)
                                      setOpenMenuId(null)
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
                Showing {filteredPayments.length} of {payments.length} payments
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

        <TabsContent value="new-payment">
          <Card>
            <CardHeader>
              <CardTitle>Create New Payment</CardTitle>
              <CardDescription>Enter the details to process a new payment.</CardDescription>
            </CardHeader>

            <CardContent>
              <form className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input id="customer-name" placeholder="Enter customer name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Customer Email</Label>
                    <Input id="customer-email" type="email" placeholder="Enter customer email" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input id="amount" type="number" min="0" step="0.01" className="pl-7" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select>
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="XXX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Payment description (optional)" />
                </div>
              </form>
            </CardContent>

            <CardFooter>
              <Button className="w-full">Process Payment</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reports</CardTitle>
              <CardDescription>View and generate payment reports.</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <h3 className="text-lg font-medium">Reports Feature</h3>
                <p className="text-muted-foreground mt-2">This section would contain payment reports and analytics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Payment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={handleViewDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Detailed information about payment {selectedPayment?.id}.</DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">ID:</div>
                <div>{selectedPayment.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Customer:</div>
                <div>{selectedPayment.customer}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Email:</div>
                <div>{selectedPayment.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Date:</div>
                <div>{selectedPayment.date}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Amount:</div>
                <div>${selectedPayment.amount.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Status:</div>
                <div>{renderStatusBadge(selectedPayment.status)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Method:</div>
                <div>{selectedPayment.method}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Make changes to payment {selectedPayment?.id}.</DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-customer" className="text-right">
                  Customer
                </Label>
                <Input
                  id="edit-customer"
                  value={selectedPayment.customer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedPayment({ ...selectedPayment, customer: e.target.value })
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
                  value={selectedPayment.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedPayment({ ...selectedPayment, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={selectedPayment.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedPayment({ ...selectedPayment, amount: Number.parseFloat(e.target.value) })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedPayment.status}
                  onValueChange={(value: Payment["status"]) =>
                    setSelectedPayment({ ...selectedPayment, status: value })
                  }
                >
                  <SelectTrigger id="edit-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-method" className="text-right">
                  Method
                </Label>
                <Select
                  value={selectedPayment.method}
                  onValueChange={(value: Payment["method"]) =>
                    setSelectedPayment({ ...selectedPayment, method: value })
                  }
                >
                  <SelectTrigger id="edit-method" className="col-span-3">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete payment {selectedPayment?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
