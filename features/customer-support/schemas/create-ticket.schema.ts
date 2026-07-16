import { z } from "zod/v3"

export const createTicketSchema = z.object({
  user_id: z.string().min(1, "Customer is required"),
  assigned_to: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  channel: z.string().min(1, "Channel is required"),
  ticket_type: z.string().min(1, "Ticket type is required"),
  description: z.string().min(1, "Description is required"),
  sla_hours: z.coerce.number().min(1, "SLA hours is required"),
})

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>

export const createTicketFormDefaults: CreateTicketFormValues = {
  user_id: "",
  assigned_to: "",
  category: "",
  subcategory: "",
  channel: "Email",
  ticket_type: "Complaint",
  description: "",
  sla_hours: 24,
}

export const ticketCategoryOptions = [
  "Personal Loan",
  "Education Loan",
  "Business Loan",
] as const

export const ticketSubcategoryOptions = [
  "Payment Dispute",
  "Overcharging Interest",
  "Late Payment Fee",
  "Account Access",
  "Statement Request",
  "Loan Restructuring",
] as const

export const ticketChannelOptions = [
  "Email",
  "Phone",
  "Live Chat",
  "In-App",
] as const

export const ticketTypeOptions = [
  "Complaint",
  "Request",
  "Enquiry",
  "Suggestion",
] as const
