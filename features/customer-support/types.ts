export const ticketStatuses = ["open", "closed", "overdue", "new"] as const

export type TicketStatus = (typeof ticketStatuses)[number]

export type TicketTab = "all" | "open" | "closed" | "overdue"

export type TicketKpi = {
  key: string
  label: string
  value: string
  changePercent: number
  trend: "up" | "down"
}

export type TicketListParams = {
  page: number
  per_page?: number
  search?: string
  status?: Exclude<TicketTab, "all">
}

export type TicketListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type TicketListResponse = {
  items: SupportTicket[]
  meta: TicketListMeta
}

export type SupportTicket = {
  id: string
  ticketNumber: string
  createdAt: string
  createdBy: string
  status: TicketStatus
  category: string
  subcategory: string
  assignedTo: string
}

export type TicketAssignee = {
  id: string | null
  name: string
  initials: string
  role: string
}

export type TicketAttachment = {
  id: string
  name: string
  size: string
  url?: string | null
}

export type TicketComment = {
  id: string
  authorName: string
  authorInitials: string
  createdAt: string
  message: string
}

export type TicketTimelineEntry = {
  id: string
  dateTime: string
  action: string
}

export type TicketDetail = {
  id: string
  ticketNumber: string
  status: TicketStatus
  slaDueIn: string
  dateCreated: string
  timeCreated: string
  createdBy: string
  customerName: string
  accountNumber: string
  userId: string | null
  channel: string
  category: string
  subcategory: string
  ticketType: string
  description: string
  attachment: TicketAttachment | null
  assignee: TicketAssignee
  comments: TicketComment[]
  timeline: TicketTimelineEntry[]
}

export type CreateTicketInput = {
  user_id: string
  assigned_to?: string | null
  category: string
  subcategory: string
  channel: string
  ticket_type: string
  description: string
  sla_hours: number
}

export type UpdateTicketStatusInput = {
  ticketId: string
  status: "open" | "closed" | "overdue"
}

export type AssignTicketInput = {
  ticketId: string
  assigned_to: string | null
}

export type AddTicketCommentInput = {
  ticketId: string
  comment: string
}

export type TicketActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type ApiTicketTrend = {
  percentage: number
  direction: "up" | "down" | string
}

export type ApiTicketMetricItem = {
  value: number
  trend: ApiTicketTrend
}

export type ApiTicketMetricsResponse = {
  new_tickets: ApiTicketMetricItem
  open_tickets: ApiTicketMetricItem
  closed_tickets: ApiTicketMetricItem
  overdue_tickets: ApiTicketMetricItem
}

export type ApiTicketPerson = {
  id?: string | number
  first_name?: string
  last_name?: string
  middle_name?: string | null
  name?: string
  full_name?: string
  email?: string
  role?: string
  profile?: {
    account_number?: string | null
  } | null
}

export type ApiTicketComment = {
  id?: string | number
  comment?: string
  message?: string
  body?: string
  created_at?: string
  user?: ApiTicketPerson | null
  author?: ApiTicketPerson | null
  created_by?: ApiTicketPerson | string | null
}

export type ApiTicketTimeline = {
  id?: string | number
  action?: string
  description?: string
  message?: string
  created_at?: string
  date_time?: string
}

export type ApiTicketAttachment = {
  id?: string | number
  name?: string
  file_name?: string
  size?: string | number
  url?: string | null
}

export type ApiTicket = {
  id: string | number
  ticket_number?: string | number
  ticket_id?: string | number
  status?: string
  category?: string
  subcategory?: string
  channel?: string
  ticket_type?: string
  description?: string
  sla_hours?: number | null
  sla_due_at?: string | null
  sla_due_in?: string | null
  created_at?: string
  updated_at?: string
  user_id?: string | null
  assigned_to?: string | null
  attachment_name?: string | null
  attachment_path?: string | null
  attachment_size?: string | number | null
  user?: ApiTicketPerson | null
  customer?: ApiTicketPerson | null
  assignee?: ApiTicketPerson | null
  assigned_user?: ApiTicketPerson | null
  created_by?: ApiTicketPerson | string | null
  comments?: ApiTicketComment[]
  timeline?: ApiTicketTimeline[]
  timelines?: ApiTicketTimeline[]
  attachment?: ApiTicketAttachment | null
  attachments?: ApiTicketAttachment[]
}

export type ApiTicketListResponse = {
  current_page: number
  data: ApiTicket[]
  last_page: number
  per_page: number
  total: number
}

export type ApiTicketDetailResponse =
  | ApiTicket
  | {
      data?: ApiTicket
      ticket?: ApiTicket
      sla_due_in?: string | null
    }
