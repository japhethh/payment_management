// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { createInvoice, deleteInvoice, fetchInvoiceById, fetchInvoices, updateInvoice } from "../api/invoiceApi"
// import type { CreateInvoiceDto, UpdateInvoiceDto } from "../types/invoice"

// // Query keys
// export const invoiceKeys = {
//   all: ["invoices"] as const,
//   lists: () => [...invoiceKeys.all, "list"] as const,
//   list: (filters: string) => [...invoiceKeys.lists(), { filters }] as const,
//   details: () => [...invoiceKeys.all, "detail"] as const,
//   detail: (id: string) => [...invoiceKeys.details(), id] as const,
// }

// // Hook for fetching all invoices
// export const useInvoices = () => {
//   return useQuery({
//     queryKey: invoiceKeys.lists(),
//     queryFn: fetchInvoices,
//   })
// }

// // Hook for fetching a single invoice
// export const useInvoice = (id: string) => {
//   return useQuery({
//     queryKey: invoiceKeys.detail(id),
//     queryFn: () => fetchInvoiceById(id),
//     enabled: !!id, // Only run the query if we have an ID
//   })
// }

// // Hook for creating an invoice
// export const useCreateInvoice = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (newInvoice: CreateInvoiceDto) => createInvoice(newInvoice),
//     onSuccess: () => {
//       // Invalidate and refetch the invoices list
//       queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
//     },
//   })
// }

// export const useCreateInvoice = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (newInvoice: CreateInvoiceDto) => createInvoice(newInvoice),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
//     }
//   })
// }

// // Hook for updating an invoice
// export const useUpdateInvoice = (id: string) => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (invoice: UpdateInvoiceDto) => updateInvoice(id, invoice),
//     onSuccess: (updatedInvoice) => {
//       // Update the cache with the updated invoice
//       queryClient.setQueryData(invoiceKeys.detail(id), updatedInvoice)
//       // Invalidate the list to ensure it's up to date
//       queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
//     },
//   })
// }

// // Hook for deleting an invoice
// export const useDeleteInvoice = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (id: string) => deleteInvoice(id),
//     onSuccess: (_, id) => {
//       // Remove the invoice from the cache
//       queryClient.removeQueries({ queryKey: invoiceKeys.detail(id) })
//       // Invalidate the list to ensure it's up to date
//       queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
//     },
//   })
// }
