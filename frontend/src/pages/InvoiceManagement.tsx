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
import { Eye, Download, Printer, Search, MoreHorizontal, FileText, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

// Define TypeScript interfaces
interface Invoice {
  id: string
  paymentId: string
  customer: string
  email: string
  amount: number
  status: "paid" | "pending" | "overdue" | "cancelled"
  items: InvoiceItem[]
  issueDate: string
  dueDate: string
}

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

// Mock data for invoices
const initialInvoices: Invoice[] = [
  {
    id: "INV-2023-001",
    paymentId: "PAY001",
    customer: "John Doe",
    email: "john@example.com",
    amount: 250.0,
    status: "paid",
    items: [{ description: "Web Development Service", quantity: 1, unitPrice: 250.0 }],
    issueDate: "2023-05-15",
    dueDate: "2023-06-15",
  },
  {
    id: "INV-2023-002",
    paymentId: "PAY002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 150.0,
    status: "pending",
    items: [{ description: "Logo Design", quantity: 1, unitPrice: 150.0 }],
    issueDate: "2023-05-16",
    dueDate: "2023-06-16",
  },
  {
    id: "INV-2023-003",
    paymentId: "PAY003",
    customer: "Robert Johnson",
    email: "robert@example.com",
    amount: 350.0,
    status: "overdue",
    items: [{ description: "SEO Consultation", quantity: 2, unitPrice: 175.0 }],
    issueDate: "2023-05-17",
    dueDate: "2023-06-01",
  },
  {
    id: "INV-2023-004",
    paymentId: "PAY004",
    customer: "Emily Davis",
    email: "emily@example.com",
    amount: 450.0,
    status: "paid",
    items: [{ description: "Content Writing", quantity: 3, unitPrice: 150.0 }],
    issueDate: "2023-05-18",
    dueDate: "2023-06-18",
  },
  {
    id: "INV-2023-005",
    paymentId: "PAY005",
    customer: "Michael Wilson",
    email: "michael@example.com",
    amount: 550.0,
    status: "cancelled",
    items: [{ description: "Mobile App Development", quantity: 1, unitPrice: 550.0 }],
    issueDate: "2023-05-19",
    dueDate: "2023-06-19",
  },
]

export default function InvoiceManagement(): React.ReactElement {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    customer: "",
    email: "",
    amount: 0,
    status: "pending",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Filter invoices based on search term and filters
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle invoice actions
  const handleView = (invoice: Invoice): void => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handlePrint = (invoice: Invoice): void => {
    console.log("Printing invoice:", invoice.id)
    // In a real application, this would trigger a print function
    window.alert(`Printing invoice ${invoice.id}`)
  }

  const handleDownload = (invoice: Invoice): void => {
    console.log("Downloading invoice:", invoice.id)
    // In a real application, this would trigger a download
    window.alert(`Downloading invoice ${invoice.id} as PDF`)
  }

  // Create new invoice
  const handleCreateInvoice = (): void => {
    const id = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`
    const newInvoiceWithId = {
      ...newInvoice,
      id,
      paymentId: `PAY${String(invoices.length + 1).padStart(3, "0")}`,
      amount: newInvoice.items?.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) || 0,
    } as Invoice

    setInvoices([...invoices, newInvoiceWithId])
    setIsCreateDialogOpen(false)
    setNewInvoice({
      customer: "",
      email: "",
      amount: 0,
      status: "pending",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  // Add new item to invoice
  const addInvoiceItem = (): void => {
    if (newInvoice.items) {
      setNewInvoice({
        ...newInvoice,
        items: [...newInvoice.items, { description: "", quantity: 1, unitPrice: 0 }],
      })
    }
  }

  // Update invoice item
  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number): void => {
    if (newInvoice.items) {
      const updatedItems = [...newInvoice.items]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === "description" ? value : Number(value),
      }

      setNewInvoice({
        ...newInvoice,
        items: updatedItems,
        amount: updatedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      })
    }
  }

  // Remove invoice item
  const removeInvoiceItem = (index: number): void => {
    if (newInvoice.items && newInvoice.items.length > 1) {
      const updatedItems = newInvoice.items.filter((_, i) => i !== index)
      setNewInvoice({
        ...newInvoice,
        items: updatedItems,
        amount: updatedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      })
    }
  }

  // Render status badge with appropriate color
  const renderStatusBadge = (status: Invoice["status"]): React.ReactNode => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>
      case "cancelled":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Invoice Management</h1>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="repository">Invoice Repository</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>View and manage all invoices.</CardDescription>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </div>

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
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
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
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No invoices found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>
                            {invoice.customer}
                            <div className="text-sm text-muted-foreground">{invoice.email}</div>
                          </TableCell>
                          <TableCell>{invoice.issueDate}</TableCell>
                          <TableCell>{invoice.dueDate}</TableCell>
                          <TableCell>{renderStatusBadge(invoice.status)}</TableCell>
                          <TableCell className="text-right font-medium">${invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <DropdownMenu
                                open={openMenuId === invoice.id}
                                onOpenChange={(open) => {
                                  setOpenMenuId(open ? invoice.id : null)
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
                                      handleView(invoice)
                                      setOpenMenuId(null)
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      handlePrint(invoice)
                                      setOpenMenuId(null)
                                    }}
                                  >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      handleDownload(invoice)
                                      setOpenMenuId(null)
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
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
                Showing {filteredInvoices.length} of {invoices.length} invoices
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

        <TabsContent value="repository">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Repository</CardTitle>
              <CardDescription>Archive and storage of all invoices.</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{invoice.id}</CardTitle>
                      <CardDescription>{invoice.customer}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span>{renderStatusBadge(invoice.status)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span>{invoice.issueDate}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 bg-muted/50 flex justify-between">
                      <Button variant="ghost" size="sm" onClick={() => handleView(invoice)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(invoice)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice {selectedInvoice?.id}</DialogTitle>
            <DialogDescription>Invoice details and line items.</DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="py-4">
              <div className="flex justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg">Invoice</h3>
                  <p className="text-muted-foreground">{selectedInvoice.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Issue Date: {selectedInvoice.issueDate}</p>
                  <p className="font-medium">Due Date: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-1">Bill To:</h4>
                  <p>{selectedInvoice.customer}</p>
                  <p>{selectedInvoice.email}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-semibold mb-1">Status:</h4>
                  <div>{renderStatusBadge(selectedInvoice.status)}</div>
                </div>
              </div>

              <div className="border rounded-md mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-1/3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Subtotal:</span>
                    <span>${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Tax (0%):</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total:</span>
                    <span>${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => selectedInvoice && handlePrint(selectedInvoice)}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={() => selectedInvoice && handleDownload(selectedInvoice)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>Fill in the details to create a new invoice.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input
                  id="customer-name"
                  placeholder="Enter customer name"
                  value={newInvoice.customer}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-email">Customer Email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="Enter customer email"
                  value={newInvoice.email}
                  onChange={(e) => setNewInvoice({ ...newInvoice, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue-date">Issue Date</Label>
                <Input
                  id="issue-date"
                  type="date"
                  value={newInvoice.issueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, issueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newInvoice.status as string}
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value as Invoice["status"] })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Invoice Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                  Add Item
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price ($)</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newInvoice.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="1"
                            className="w-20 ml-auto"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(index, "quantity", e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-24 ml-auto"
                            value={item.unitPrice}
                            onChange={(e) => updateInvoiceItem(index, "unitPrice", e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInvoiceItem(index)}
                            disabled={newInvoice.items?.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-1/3">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Subtotal:</span>
                  <span>${newInvoice.amount?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total:</span>
                  <span>${newInvoice.amount?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional notes or payment instructions" rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
