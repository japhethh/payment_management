import type React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { Invoice } from "@/types"

// Create styles without custom fonts
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#6B7280",
  },
  dateText: {
    fontSize: 10,
    marginBottom: 4,
    fontWeight: "medium",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    flexDirection: "column",
    width: "48%",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: 4,
  },
  table: {
    flexDirection: "column",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 8,
  },
  tableRowLast: {
    flexDirection: "row",
    padding: 8,
  },
  tableCell: {
    fontSize: 9,
  },
  tableCellDescription: {
    flex: 3,
  },
  tableCellQuantity: {
    flex: 1,
    textAlign: "right",
  },
  tableCellPrice: {
    flex: 1,
    textAlign: "right",
  },
  tableCellTotal: {
    flex: 1,
    textAlign: "right",
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalsBox: {
    width: "33%",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  totalsRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    fontSize: 8,
    color: "#6B7280",
    textAlign: "center",
  },
  paid: {
    color: "#10B981",
  },
  draft: {
    color: "#3B82F6",
  },
  sent: {
    color: "#EAB308",
  },
  pending: {
    color: "#EAB308",
  },
  overdue: {
    color: "#EF4444",
  },
  cancelled: {
    color: "#6B7280",
  },
})

// Get status style
const getStatusStyle = (status: string) => {
  switch (status) {
    case "paid":
      return styles.paid
    case "draft":
      return styles.draft
    case "sent":
      return styles.sent
    case "pending":
      return styles.pending
    case "overdue":
      return styles.overdue
    case "cancelled":
      return styles.cancelled
    default:
      return {}
  }
}

// Format currency
const formatCurrency = (amount: number) => {
  return `₱${amount.toFixed(2)}`
}

interface InvoicePDFProps {
  invoice: Invoice
  formatDate: (date: string) => string
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, formatDate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.dateText}>Created Date: {formatDate(invoice.createdAt)}</Text>
          <Text style={styles.dateText}>Due Date: {formatDate(invoice.dueDate)}</Text>
        </View>
      </View>

      {/* Bill To & Status */}
      <View style={styles.section}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.text}>{invoice.customer}</Text>
          <Text style={styles.text}>{invoice.email}</Text>
        </View>
        <View style={[styles.column, styles.statusContainer]}>
          <Text style={styles.sectionTitle}>Status:</Text>
          <Text style={[styles.statusText, getStatusStyle(invoice.status)]}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Invoice Items */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.tableCellDescription]}>Description</Text>
          <Text style={[styles.tableCell, styles.tableCellQuantity]}>Quantity</Text>
          <Text style={[styles.tableCell, styles.tableCellPrice]}>Unit Price</Text>
          <Text style={[styles.tableCell, styles.tableCellTotal]}>Total</Text>
        </View>

        {invoice.items.map((item, index) => {
          const isLastItem = index === invoice.items.length - 1
          return (
            <View key={index} style={isLastItem ? styles.tableRowLast : styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellDescription]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.tableCellQuantity]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.tableCellPrice]}>{formatCurrency(item.amount)}</Text>
              <Text style={[styles.tableCell, styles.tableCellTotal]}>
                {formatCurrency(item.quantity * item.amount)}
              </Text>
            </View>
          )
        })}
      </View>

      {/* Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.text}>Subtotal:</Text>
            <Text style={styles.text}>{formatCurrency(invoice.totalAmount)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.text}>Tax (0%):</Text>
            <Text style={styles.text}>{formatCurrency(0)}</Text>
          </View>
          <View style={styles.totalsRowLast}>
            <Text style={styles.text}>Total:</Text>
            <Text style={styles.text}>{formatCurrency(invoice.totalAmount)}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
)

export default InvoicePDF
