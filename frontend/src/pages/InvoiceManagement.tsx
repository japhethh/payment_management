"use client"

import { useEffect, useState } from "react"
import {
  Eye,
  Download,
  Printer,
  Search,
  MoreHorizontal,
  FileText,
  Trash2,
  Plus,
  CreditCard,
  CheckCircle2,
} from "lucide-react"
import { fetchInvoices, createInvoice, updateInvoice, deleteInvoice } from "@/api/invoiceApi"
import { gcashImage } from "@/assets"
import { pdf } from "@react-pdf/renderer"
import InvoicePDF from "./invoice-pdf"

// Import your UI components
// Note: You'll need to adjust these imports based on your actual component structure
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Textarea } from "../components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import type { Invoice, InvoiceItem } from "@/types"
import axios from "axios"
import { apiURL } from "@/contexts/AuthStore"
import toast from "react-hot-toast"

// Safe localStorage access
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error("Error accessing localStorage:", error)
    return null
  }
}

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    customer: "",
    email: "",
    totalAmount: 0,
    status: "draft",
    items: [{ description: "", quantity: 1, amount: 0 }],
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getInvoices = async () => {
      setIsLoading(true)
      try {
        const data = await fetchInvoices()
        setInvoices(data)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch invoices:", error)
        setError("Failed to load invoices. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getInvoices()
  }, [])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filter invoices based on search term and filters
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice?.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle invoice actions
  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handlePrint = (invoice: Invoice) => {
    console.log("Printing invoice:", invoice.invoiceNumber)
    window.print()
  }

  const handleDownload = async (invoice: Invoice) => {
    console.log("Downloading invoice:", invoice.invoiceNumber)
    setIsPdfGenerating(true)

    try {
      // Generate PDF blob
      const pdfDoc = <InvoicePDF invoice={invoice} formatDate={formatDate} />
      const blob = await pdf(pdfDoc).toBlob()

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Invoice-${invoice.invoiceNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setError(null)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setError("Failed to generate PDF. Please try again.")
    } finally {
      setIsPdfGenerating(false)
    }
  }

  // Handle payment
  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setPaymentSuccess(false)
    setIsPaymentDialogOpen(true)
  }

  const processPayment = async () => {
    if (!selectedInvoice) return

    try {
      // In a real app, you would call your payment API here
      console.log("Processing payment for invoice:", selectedInvoice.invoiceNumber)
      console.log("Payment method:", paymentMethod)
      if (paymentMethod === "credit-card") {
        console.log("Card details:", cardDetails)
      } else if (paymentMethod === "gcash") {
        // In a real implementation, you would redirect to PayMongo here
        try {
          const token = safeGetItem("token")
          const response = await axios.post(`${apiURL}/api/payments/payment-link`, selectedInvoice, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          })

          const generatedLink = response.data.link

          window.open(generatedLink, "_blank")
          console.log("Redirecting to PayMongo for GCash payment")
        } catch (error) {
          console.error("Error accessing localStorage or making API call:", error)
          setError("Failed to process GCash payment. Please try again.")
          return
        }
      }

      // Simulate API call
      setIsLoading(true)

      // Update the invoice status to paid
      const updatedInvoice = await updateInvoice(selectedInvoice._id, {
        ...selectedInvoice,
        status: "paid",
      })

      // Update the invoices list
      setInvoices(invoices.map((invoice) => (invoice._id === updatedInvoice._id ? updatedInvoice : invoice)))

      setSelectedInvoice(updatedInvoice)
      setPaymentSuccess(true)
      setError(null)
    } catch (error) {
      console.error("Payment processing failed:", error)
      setError("Payment processing failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Create new invoice
  const handleCreateInvoice = async () => {
    try {
      setIsLoading(true)

      // Calculate total amount from items
      const totalAmount = newInvoice.items?.reduce((sum, item) => sum + item.amount * item.quantity, 0) || 0

      const invoiceData = {
        ...newInvoice,
        totalAmount,
      } as any // Using 'any' temporarily to avoid TypeScript errors

      console.log(invoiceData)
      const createdInvoice = await createInvoice(invoiceData)

      setInvoices([...invoices, createdInvoice])
      setIsCreateDialogOpen(false)
      setNewInvoice({
        customer: "",
        email: "",
        totalAmount: 0,
        status: "draft",
        items: [{ description: "", quantity: 1, amount: 0 }],
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      setError(null)
    } catch (error) {
      console.error("Failed to create invoice:", error)
      setError("Failed to create invoice. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add new item to invoice
  const addInvoiceItem = () => {
    if (newInvoice.items) {
      setNewInvoice({
        ...newInvoice,
        items: [...newInvoice.items, { description: "", quantity: 1, amount: 0 }],
      })
    }
  }

  // Update invoice item
  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    if (newInvoice.items) {
      const updatedItems = [...newInvoice.items]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === "description" ? value : Number(value),
      }

      setNewInvoice({
        ...newInvoice,
        items: updatedItems,
        totalAmount: updatedItems.reduce((sum, item) => sum + item.amount * item.quantity, 0),
      })
    }
  }

  // Remove invoice item
  const removeInvoiceItem = (index: number) => {
    if (newInvoice.items && newInvoice.items.length > 1) {
      const updatedItems = newInvoice.items.filter((_, i) => i !== index)
      setNewInvoice({
        ...newInvoice,
        items: updatedItems,
        totalAmount: updatedItems.reduce((sum, item) => sum + item.amount * item.quantity, 0),
      })
    }
  }

  // Handle invoice deletion
  const handleDeleteInvoice = async (id: string) => {
    try {
      setIsLoading(true)
      await deleteInvoice(id)
      setInvoices(invoices.filter((invoice) => invoice._id !== id))
      setError(null)

      
      toast.error("Deleted Successfully!")
    } catch (error) {
      console.error("Failed to delete invoice:", error)
      setError("Failed to delete invoice. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
      case "draft":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Draft</Badge>
      case "sent":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Sent</Badge>
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

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="repository">Invoice Repository</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
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
                    placeholder="Search by invoice number, customer or email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
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
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Created Date</TableHead>
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
                          <TableRow key={invoice._id}>
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>
                              {invoice.customer}
                              <div className="text-sm text-muted-foreground">{invoice.email}</div>
                            </TableCell>
                            <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                            <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                            <TableCell>{renderStatusBadge(invoice.status)}</TableCell>
                            <TableCell className="text-right font-medium">₱{invoice.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <DropdownMenu
                                  open={openMenuId === invoice._id}
                                  onOpenChange={(open) => {
                                    setOpenMenuId(open ? invoice._id : null)
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
                                    {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          handlePayment(invoice)
                                          setOpenMenuId(null)
                                        }}
                                      >
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Pay Invoice
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => {
                                        handleDownload(invoice)
                                        setOpenMenuId(null)
                                      }}
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Download PDF
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this invoice?")) {
                                          handleDeleteInvoice(invoice._id)
                                        }
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
              )}
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
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {invoices.length === 0 ? (
                    <div className="col-span-3 text-center py-8">No invoices found in the repository.</div>
                  ) : (
                    invoices.map((invoice) => (
                      <Card key={invoice._id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
                          <CardDescription>{invoice.customer}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Amount:</span>
                            <span className="font-medium">₱{invoice.totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <span>{renderStatusBadge(invoice.status)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Date:</span>
                            <span>{formatDate(invoice.createdAt)}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-muted/50 flex justify-between">
                          <Button variant="ghost" size="sm" onClick={() => handleView(invoice)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {invoice.status !== "paid" && invoice.status !== "cancelled" ? (
                            <Button variant="ghost" size="sm" onClick={() => handlePayment(invoice)}>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Pay
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleDownload(invoice)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all payment transactions.</CardDescription>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices
                        .filter((invoice) => invoice.status === "paid")
                        .map((invoice) => (
                          <TableRow key={`payment-${invoice._id}`}>
                            <TableCell className="font-medium">{`TRX-${invoice._id.substring(0, 8)}`}</TableCell>
                            <TableCell>{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.customer}</TableCell>
                            <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                            <TableCell>Credit Card</TableCell>
                            <TableCell className="text-right font-medium">₱{invoice.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      {invoices.filter((invoice) => invoice.status === "paid").length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No payment transactions found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice {selectedInvoice?.invoiceNumber}</DialogTitle>
            <DialogDescription>Invoice details and line items.</DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="py-4">
              <div className="flex justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg">Invoice</h3>
                  <p className="text-muted-foreground">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Created Date: {formatDate(selectedInvoice.createdAt)}</p>
                  <p className="font-medium">Due Date: {formatDate(selectedInvoice.dueDate)}</p>
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
                        <TableCell className="text-right">₱{item.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₱{(item.quantity * item.amount).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-1/3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Subtotal:</span>
                    <span>₱{selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Tax (0%):</span>
                    <span>₱0.00</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total:</span>
                    <span>₱{selectedInvoice.totalAmount.toFixed(2)}</span>
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
            {selectedInvoice && selectedInvoice.status !== "paid" && selectedInvoice.status !== "cancelled" && (
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false)
                  handlePayment(selectedInvoice)
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            )}
            <Button onClick={() => selectedInvoice && handleDownload(selectedInvoice)} disabled={isPdfGenerating}>
              <Download className="h-4 w-4 mr-2" />
              {isPdfGenerating ? "Generating..." : "Download PDF"}
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
                  value={newInvoice.customer || ""}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-email">Customer Email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="Enter customer email"
                  value={newInvoice.email || ""}
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
                  value={newInvoice.createdAt ? new Date(newInvoice.createdAt).toISOString().split("T")[0] : ""}
                  onChange={(e) => setNewInvoice({ ...newInvoice, createdAt: new Date(e.target.value).toISOString() })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={newInvoice.dueDate ? new Date(newInvoice.dueDate).toISOString().split("T")[0] : ""}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: new Date(e.target.value).toISOString() })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newInvoice.status || "draft"}
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
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
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price (₱)</TableHead>
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
                            value={item.amount}
                            onChange={(e) => updateInvoiceItem(index, "amount", e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₱{(item.quantity * item.amount).toFixed(2)}
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
                  <span>₱{newInvoice.totalAmount?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Tax (0%):</span>
                  <span>₱0.00</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total:</span>
                  <span>₱{newInvoice.totalAmount?.toFixed(2) || "0.00"}</span>
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
            <Button onClick={handleCreateInvoice} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={isPaymentDialogOpen}
        onOpenChange={(open) => {
          if (!open) setPaymentSuccess(false)
          setIsPaymentDialogOpen(open)
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentSuccess ? "Payment Successful" : `Pay Invoice ${selectedInvoice?.invoiceNumber}`}
            </DialogTitle>
            <DialogDescription>
              {paymentSuccess
                ? "Your payment has been processed successfully."
                : "Complete your payment to settle this invoice."}
            </DialogDescription>
          </DialogHeader>

          {paymentSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
              <p className="text-center text-muted-foreground mb-4">
                Your payment of ₱{selectedInvoice?.totalAmount.toFixed(2)} for invoice {selectedInvoice?.invoiceNumber}{" "}
                has been processed successfully.
              </p>
              <p className="text-sm text-muted-foreground">A receipt has been sent to {selectedInvoice?.email}</p>
            </div>
          ) : (
            <div className="py-4">
              {selectedInvoice && (
                <div className="mb-6">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Invoice Number:</span>
                    <span>{selectedInvoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Customer:</span>
                    <span>{selectedInvoice.customer}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Due Date:</span>
                    <span>{formatDate(selectedInvoice.dueDate)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total Amount:</span>
                    <span>₱{selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="credit-card" id="credit-card" className="peer sr-only" />
                      <Label
                        htmlFor="credit-card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        Card
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem value="gcash" id="gcash" className="peer sr-only" />
                      <Label
                        htmlFor="gcash"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <img src={gcashImage || "/placeholder.svg"} alt="gcash" />
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-holder">Card Holder Name</Label>
                      <Input
                        id="card-holder"
                        placeholder="John Doe"
                        value={cardDetails.cardHolder}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input
                          id="expiry-date"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank-transfer" && (
                  <div className="space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                      <p className="text-sm text-muted-foreground mb-1">Account Name: Acme Inc</p>
                      <p className="text-sm text-muted-foreground mb-1">Account Number: 1234567890</p>
                      <p className="text-sm text-muted-foreground mb-1">Bank: Example Bank</p>
                      <p className="text-sm text-muted-foreground">Reference: {selectedInvoice?.invoiceNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transfer-reference">Transfer Reference</Label>
                      <Input id="transfer-reference" placeholder="Enter your transfer reference" />
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-medium mb-2">PayPal Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        Click the "Pay with PayPal" button below to be redirected to PayPal to complete your payment.
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === "gcash" && (
                  <div className="space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-medium mb-2">GCash Payment</h4>
                      <p className="text-sm text-muted-foreground">
                        Click the "Pay with GCash" button below to be redirected to PayMongo to complete your payment.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            {paymentSuccess ? (
              <Button onClick={() => setIsPaymentDialogOpen(false)}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={processPayment} disabled={isLoading}>
                  {isLoading
                    ? "Processing..."
                    : paymentMethod === "paypal"
                      ? "Pay with PayPal"
                      : paymentMethod === "gcash"
                        ? "Pay with GCash"
                        : "Complete Payment"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
