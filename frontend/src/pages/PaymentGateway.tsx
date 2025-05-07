import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertCircle, CreditCard, Wallet, Building, ArrowRight, RefreshCw } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

// Define TypeScript interfaces
interface PaymentMethod {
  id: string
  name: string
  type: "credit_card" | "paypal" | "bank_transfer"
  icon: React.ReactNode
}

interface Transaction {
  id: string
  amount: number
  status: "success" | "pending" | "failed"
  method: string
  date: string
  customer: string
}

// Mock payment methods
const paymentMethods: PaymentMethod[] = [
  {
    id: "credit_card",
    name: "Credit Card",
    type: "credit_card",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "paypal",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    type: "bank_transfer",
    icon: <Building className="h-5 w-5" />,
  },
]

// Mock transactions
const recentTransactions: Transaction[] = [
  {
    id: "TX12345",
    amount: 250.0,
    status: "success",
    method: "Credit Card",
    date: "2023-05-15 14:30",
    customer: "John Doe",
  },
  {
    id: "TX12346",
    amount: 150.0,
    status: "pending",
    method: "PayPal",
    date: "2023-05-16 10:15",
    customer: "Jane Smith",
  },
  {
    id: "TX12347",
    amount: 350.0,
    status: "failed",
    method: "Bank Transfer",
    date: "2023-05-17 09:45",
    customer: "Robert Johnson",
  },
  {
    id: "TX12348",
    amount: 450.0,
    status: "success",
    method: "Credit Card",
    date: "2023-05-18 16:20",
    customer: "Emily Davis",
  },
]

export default function PaymentGateway(): React.ReactElement {
  const [selectedMethod, setSelectedMethod] = useState<string>("credit_card")
  const [cardNumber, setCardNumber] = useState<string>("")
  const [cardName, setCardName] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [cvv, setCvv] = useState<string>("")
  const [amount, setAmount] = useState<string>("0.00")
  const [saveCard, setSaveCard] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "success" | "error">("idle")

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setCardNumber(formatCardNumber(value))
  }

  // Process payment
  const handleProcessPayment = (): void => {
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // 80% chance of success for demo purposes
      const success = Math.random() < 0.8

      setTransactionStatus(success ? "success" : "error")
      setProcessing(false)

      // Reset form after 3 seconds on success
      if (success) {
        setTimeout(() => {
          setTransactionStatus("idle")
          setCardNumber("")
          setCardName("")
          setExpiryDate("")
          setCvv("")
          setAmount("0.00")
        }, 3000)
      }
    }, 2000)
  }

  // Render transaction status alert
  const renderTransactionAlert = (): React.ReactNode => {
    if (transactionStatus === "success") {
      return (
        <Alert className="bg-green-50 border-green-200 mb-6">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Payment Successful</AlertTitle>
          <AlertDescription className="text-green-700">
            Your payment has been processed successfully. A receipt has been sent to your email.
          </AlertDescription>
        </Alert>
      )
    } else if (transactionStatus === "error") {
      return (
        <Alert className="bg-red-50 border-red-200 mb-6">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Payment Failed</AlertTitle>
          <AlertDescription className="text-red-700">
            There was an error processing your payment. Please check your details and try again.
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  // Render status badge with appropriate color
  const renderStatusBadge = (status: Transaction["status"]): React.ReactNode => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>
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
      <h1 className="text-3xl font-bold mb-6">Payment Gateway</h1>

      <Tabs defaultValue="process" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="process">Process Payment</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="settings">Gateway Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="process">
          {renderTransactionAlert()}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Enter payment details to process a transaction.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={selectedMethod}
                      onValueChange={setSelectedMethod}
                      className="grid grid-cols-3 gap-4"
                    >
                      {paymentMethods.map((method) => (
                        <div key={method.id}>
                          <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                          <Label
                            htmlFor={method.id}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            {method.icon}
                            <span className="mt-2">{method.name}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {selectedMethod === "credit_card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="save-card" checked={saveCard} onCheckedChange={setSaveCard} />
                        <Label htmlFor="save-card">Save card for future payments</Label>
                      </div>
                    </div>
                  )}

                  {selectedMethod === "paypal" && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                  )}

                  {selectedMethod === "bank_transfer" && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Please use the following details to make a bank transfer:</p>
                      <div className="bg-muted p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-muted-foreground">Bank Name:</div>
                          <div>Example Bank</div>
                          <div className="text-muted-foreground">Account Name:</div>
                          <div>Payment System Inc.</div>
                          <div className="text-muted-foreground">Account Number:</div>
                          <div>1234567890</div>
                          <div className="text-muted-foreground">Routing Number:</div>
                          <div>987654321</div>
                          <div className="text-muted-foreground">Reference:</div>
                          <div>INV-{Math.floor(Math.random() * 10000)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                  <CardDescription>Review your payment details.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-7"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>${Number.parseFloat(amount || "0").toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Processing Fee:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between py-1 border-t font-medium">
                      <span>Total:</span>
                      <span>${Number.parseFloat(amount || "0").toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleProcessPayment}
                    disabled={
                      processing ||
                      (selectedMethod === "credit_card" && (!cardNumber || !cardName || !expiryDate || !cvv)) ||
                      !amount ||
                      Number.parseFloat(amount) <= 0
                    }
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Process Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View recent payment transactions processed through the gateway.</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.method}</TableCell>
                        <TableCell>{renderStatusBadge(transaction.status)}</TableCell>
                        <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Gateway Settings</CardTitle>
              <CardDescription>Configure payment gateway settings and integrations.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" value="••••••••••••••••" readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" value="https://example.com/api/payment-webhook" readOnly />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="test-mode">Test Mode</Label>
                  <Switch id="test-mode" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, payments will be processed in test mode and no real charges will be made.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-capture">Auto-Capture Payments</Label>
                  <Switch id="auto-capture" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, payments will be automatically captured. Otherwise, they will be authorized only.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="3ds">3D Secure Authentication</Label>
                  <Switch id="3ds" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, 3D Secure authentication will be required for eligible cards.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Reset</Button>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
