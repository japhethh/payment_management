import axios from "axios";
import { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from "@/types";

const API_URL = "http://localhost:3000/api/invoices";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// Format date for API requests
const formatDateForApi = (dateString: string) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Format date from API responses
const formatDateFromApi = (dateString: string) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
};

// Fetch all invoices
const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await axios.get(`${API_URL}/getAll`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      }
    });

    // Format dates and ensure all fields match our interface
    const invoices = response.data.map((invoice: any) => ({
      ...invoice,
      dueDate: formatDateFromApi(invoice.dueDate),
      createdAt: formatDateFromApi(invoice.createdAt),
    }));

    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

// Fetch invoice by ID
const fetchInvoiceById = async (id: string): Promise<Invoice> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      }
    });

    // Format dates
    const invoice = {
      ...response.data,
      dueDate: formatDateFromApi(response.data.dueDate),
      createdAt: formatDateFromApi(response.data.createdAt),
    };

    return invoice;
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    throw error;
  }
};

// Create a new invoice
const createInvoice = async (invoice: CreateInvoiceDto): Promise<Invoice> => {

  try {
    // Format dates for backend
    const formattedInvoice = {
      ...invoice,
    };
    console.log(formattedInvoice)

    const response = await axios.post(API_URL, formattedInvoice, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      }
    });

    // The response includes both invoice and payment
    const createdInvoice = {
      ...response.data.invoice,
      dueDate: formatDateFromApi(response.data.invoice.dueDate),
      createdAt: formatDateFromApi(response.data.invoice.createdAt),
    };

    return createdInvoice;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Update an existing invoice
const updateInvoice = async (id: string, invoice: UpdateInvoiceDto): Promise<Invoice> => {
  try {
    // Format dates for backend
    const formattedInvoice = {
      ...invoice,
      dueDate: invoice.dueDate ? formatDateForApi(invoice.dueDate) : undefined,
    };

    const response = await axios.put(`${API_URL}/${id}`, formattedInvoice, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      }
    });

    // Format dates for frontend
    const updatedInvoice = {
      ...response.data,
      dueDate: formatDateFromApi(response.data.dueDate),
      createdAt: formatDateFromApi(response.data.createdAt),
    };

    return updatedInvoice;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

// Update invoice status
const updateInvoiceStatus = async (id: string, status: Invoice["status"]): Promise<Invoice> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      }
    });

    // Format dates for frontend
    const updatedInvoice = {
      ...response.data,
      dueDate: formatDateFromApi(response.data.dueDate),
      createdAt: formatDateFromApi(response.data.createdAt),
    };

    return updatedInvoice;
  } catch (error) {
    console.error("Error updating invoice status:", error);
    throw error;
  }
};

// Delete an invoice
const deleteInvoice = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      }
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};

export {
  fetchInvoices,
  fetchInvoiceById,
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice
};