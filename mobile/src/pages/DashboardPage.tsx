"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, Filter } from "lucide-react"

// Mock data for reports
const paymentData = {
  monthly: [
    { month: "Jan", amount: 12500 },
    { month: "Feb", amount: 15000 },
    { month: "Mar", amount: 18000 },
    { month: "Apr", amount: 16500 },
    { month: "May", amount: 21000 },
    { month: "Jun", amount: 19500 },
    { month: "Jul", amount: 22000 },
    { month: "Aug", amount: 25000 },
    { month: "Sep", amount: 23500 },
    { month: "Oct", amount: 26000 },
    { month: "Nov", amount: 24500 },
    { month: "Dec", amount: 28000 },
  ],
  paymentMethods: [
    { method: "Credit Card", count: 156, amount: 125000 },
    { method: "PayPal", count: 89, amount: 75000 },
    { method: "Bank Transfer", count: 45, amount: 95000 },
  ],
  statuses: [
    { status: "Completed", count: 245, amount: 215000 },
    { status: "Pending", count: 32, amount: 65000 },
    { status: "Failed", count: 13, amount: 15000 },
  ],
}

// Top customers
const topCustomers = [
  { name: "John Doe", email: "john@example.com", transactions: 12, totalSpent: 4500 },
  { name: "Jane Smith", email: "jane@example.com", transactions: 8, totalSpent: 3200 },
  { name: "Robert Johnson", email: "robert@example.com", transactions: 6, totalSpent: 2800 },
  { name: "Emily Davis", email: "emily@example.com", transactions: 5, totalSpent: 2500 },
  { name: "Michael Wilson", email: "michael@example.com", transactions: 4, totalSpent: 2000 },
]

export default function ReportingAnalytics(): React.ReactElement {
  const [dateRange, setDateRange] = useState<string>("last30days")
  const [exportFormat, setExportFormat] = useState<string>("pdf")

  // Handle export report
  const handleExportReport = (): void => {
    window.alert(`Exporting report in ${exportFormat.toUpperCase()} format`)
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Reporting & Analytics</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="thisMonth">This month</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="thisYear">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                className="w-[150px]"
                defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              />
              <span>to</span>
              <Input type="date" className="w-[150px]" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="payments">Payment Reports</TabsTrigger>
          <TabsTrigger value="invoices">Invoice Reports</TabsTrigger>
          <TabsTrigger value="customers">Customer Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Revenue</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$295,000</div>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Transactions</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">290</div>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.2% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Transaction</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1,017</div>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +3.7% from last period
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end justify-between">
                  {paymentData.monthly.map((item) => (
                    <div key={item.month} className="flex flex-col items-center">
                      <div
                        className="bg-primary rounded-t w-12"
                        style={{
                          height: `${(item.amount / 30000) * 250}px`,
                        }}
                      ></div>
                      <div className="text-xs mt-2">{item.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {paymentData.paymentMethods.map((item) => (
                    <div key={item.method}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.method}</span>
                        <span className="text-sm text-muted-foreground">{item.count} transactions</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.method === "Credit Card"
                            ? "bg-blue-500"
                            : item.method === "PayPal"
                              ? "bg-purple-500"
                              : "bg-green-500"
                            }`}
                          style={{ width: `${(item.amount / 295000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">${item.amount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((item.amount / 295000) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Customers with highest transaction volume</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead className="text-right">Total Spent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCustomers.map((customer) => (
                      <TableRow key={customer.email}>
                        <TableCell>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </TableCell>
                        <TableCell>{customer.transactions}</TableCell>
                        <TableCell className="text-right">${customer.totalSpent.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Transaction status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {paymentData?.statuses.map((item) => (
                    <div key={item.status}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">
                          {
                            item.status === "Completed" ? (
                              <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                            ) : item.status === "Pending" ? (
                              <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
                            ) : (
                              <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>
                            )
                          }
                        </span>
                        <span className="text-sm text-muted-foreground">{item.count} transactions</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.status === "Completed"
                            ? "bg-green-500"
                            : item.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            }`}
                          style={{ width: `${(item.amount / 295000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">${item.amount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((item.amount / 295000) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reports</CardTitle>
              <CardDescription>Detailed analysis of payment transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Label>Filter by:</Label>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="amount_desc">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Date (Newest)</SelectItem>
                    <SelectItem value="date_asc">Date (Oldest)</SelectItem>
                    <SelectItem value="amount_desc">Amount (Highest)</SelectItem>
                    <SelectItem value="amount_asc">Amount (Lowest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">TX{100000 + i}</TableCell>
                        <TableCell>{new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                        <TableCell>Customer {i + 1}</TableCell>
                        <TableCell>{i % 3 === 0 ? "Credit Card" : i % 3 === 1 ? "PayPal" : "Bank Transfer"}</TableCell>
                        <TableCell>
                          {i % 5 === 0 ? (
                            <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>
                          ) : i % 4 === 0 ? (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
                          ) : (
                            <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">${(Math.random() * 1000 + 100).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>Showing 10 of 290 transactions</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Reports</CardTitle>
              <CardDescription>Detailed analysis of invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Label>Filter by:</Label>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="date_desc">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Date (Newest)</SelectItem>
                    <SelectItem value="date_asc">Date (Oldest)</SelectItem>
                    <SelectItem value="amount_desc">Amount (Highest)</SelectItem>
                    <SelectItem value="amount_asc">Amount (Lowest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          INV-{2023}-{1000 + i}
                        </TableCell>
                        <TableCell>{new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {new Date(Date.now() + (30 - i * 3) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </TableCell>
                        <TableCell>Customer {i + 1}</TableCell>
                        <TableCell>
                          {i % 5 === 0 ? (
                            <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>
                          ) : i % 4 === 0 ? (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
                          ) : i % 7 === 0 ? (
                            <Badge className="bg-gray-500 hover:bg-gray-600">Cancelled</Badge>
                          ) : (
                            <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">${(Math.random() * 1000 + 100).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>Showing 10 of 156 invoices</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reports</CardTitle>
              <CardDescription>Analysis of customer payment behavior.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Retention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 flex items-end justify-between">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className="bg-primary rounded-t w-12"
                            style={{
                              height: `${Math.round(Math.random() * 100 + 50)}px`,
                            }}
                          ></div>
                          <div className="text-xs mt-2">Month {i + 1}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Acquisition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 flex items-end justify-between">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className="bg-blue-500 rounded-t w-12"
                            style={{
                              height: `${Math.round(Math.random() * 100 + 30)}px`,
                            }}
                          ></div>
                          <div className="text-xs mt-2">Month {i + 1}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>First Purchase</TableHead>
                      <TableHead>Last Purchase</TableHead>
                      <TableHead className="text-center">Total Transactions</TableHead>
                      <TableHead className="text-right">Lifetime Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCustomers.map((customer, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </TableCell>
                        <TableCell>
                          {new Date(Date.now() - (i + 5) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{new Date(Date.now() - i * 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">{customer.transactions}</TableCell>
                        <TableCell className="text-right">${customer.totalSpent.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                <FileText className="mr-2 h-4 w-4" />
                Generate Customer Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
