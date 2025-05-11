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
import {
  Download,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Filter,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Reporting & Analytics</h1>

      {/* Date range and export controls - stacked on mobile, side by side on larger screens */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <Input
                type="date"
                className="w-full sm:w-[150px]"
                defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              />
              <span className="hidden sm:inline">to</span>
              <Input
                type="date"
                className="w-full sm:w-[150px]"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
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
          <Button onClick={handleExportReport} className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Responsive tabs - scrollable on mobile */}
      <div className="mb-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="grid min-w-[400px] w-full grid-cols-3 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="dashboard">
            {/* KPI Cards - 1 column on mobile, 3 columns on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Revenue</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">$295,000</div>
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
                  <div className="text-2xl sm:text-3xl font-bold">290</div>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8.2% from last period
                  </p>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Transaction</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">$1,017</div>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +3.7% from last period
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts - 1 column on mobile, 2 columns on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <div className="h-60 sm:h-80 flex items-end justify-between min-w-[600px]">
                    {paymentData.monthly.map((item) => (
                      <div key={item.month} className="flex flex-col items-center">
                        <div
                          className="bg-primary rounded-t w-8 sm:w-12"
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
                  <CardTitle className="flex items-center text-lg">
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

            {/* Bottom section - 1 column on mobile, 3 columns (2+1) on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Top Customers</CardTitle>
                  <CardDescription>Customers with highest transaction volume</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
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
                  <CardTitle className="text-lg">Payment Status</CardTitle>
                  <CardDescription>Transaction status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {paymentData?.statuses.map((item) => (
                      <div key={item.status}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">
                            {item.status === "Completed" ? (
                              <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                            ) : item.status === "Pending" ? (
                              <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
                            ) : (
                              <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>
                            )}
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
                <CardTitle className="text-lg sm:text-xl">Payment Reports</CardTitle>
                <CardDescription>Detailed analysis of payment transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Responsive filter controls - stack on mobile */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Label>Filter by:</Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
                </div>

                {/* Responsive table with horizontal scroll on small screens */}
                <div className="overflow-x-auto">
                  <div className="rounded-md border min-w-[600px]">
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
                            <TableCell>
                              {i % 3 === 0 ? "Credit Card" : i % 3 === 1 ? "PayPal" : "Bank Transfer"}
                            </TableCell>
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
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm">Showing 10 of 290 transactions</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1 sm:mr-0" />
                    <span className="sm:hidden">Previous</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="h-4 w-4 ml-1 sm:ml-0" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>



          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Customer Reports</CardTitle>
                <CardDescription>Analysis of customer payment behavior.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Charts - 1 column on mobile, 2 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">Customer Retention</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <div className="h-60 flex items-end justify-between min-w-[300px]">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div
                              className="bg-primary rounded-t w-8 sm:w-12"
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
                      <CardTitle className="text-base sm:text-lg">Customer Acquisition</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <div className="h-60 flex items-end justify-between min-w-[300px]">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div
                              className="bg-blue-500 rounded-t w-8 sm:w-12"
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

                {/* Responsive table with horizontal scroll on small screens */}
                <div className="overflow-x-auto">
                  <div className="rounded-md border min-w-[600px]">
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
                            <TableCell>
                              {new Date(Date.now() - i * 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-center">{customer.transactions}</TableCell>
                            <TableCell className="text-right">${customer.totalSpent.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Generate Customer Report</span>
                  <span className="sm:hidden">Generate Report</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
