
export interface Invoice {
  _id: string
  customer: string
  email:string
  amount: number
  status: "paid" | "pending" | "overdue" | "cancelled" | "draft"
  date: string
  dueDate: string
  notes?: string
}

export interface CreateInvoiceDto {
  customer: string
  amount: number
  status: "pending" | "paid" | "overdue"
  date: string
  dueDate: string
  notes?: string
}

export interface UpdateInvoiceDto {
  customer?: string
  amount?: number
  status?: "pending" | "paid" | "overdue"
  date?: string
  dueDate?: string
  notes?: string
}

