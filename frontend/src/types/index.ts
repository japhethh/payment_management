export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  image?: string;
  role: string;
  createdAt: string;
  status?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  amount: number;
}

export interface Invoice {
  _id: string;
  user: string;
  payment?: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  dueDate: string;
  createdAt: string;
  // Additional fields for UI that aren't in the Mongoose schema
  customer?: string;
  email?: string;
}

export interface CreateInvoiceDto {
  user: string;
  invoiceNumber?: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: Invoice["status"];
  dueDate: string;
  customer?: string;
  email?: string;
}

export interface UpdateInvoiceDto {
  items?: InvoiceItem[];
  totalAmount?: number;
  status?: Invoice["status"];
  dueDate?: string;
  customer?: string;
  email?: string;
}



// Student type based on the provided model
export interface Student {
  _id: string
  firstName: string
  lastName: string
  email: string
  program: string
  yearLevel: string
  createdAt: string
}
