import type {
  ApiTicket,
  ApiTicketComment,
  ApiTicketDetailResponse,
  ApiTicketMetricsResponse,
  ApiTicketPerson,
  ApiTicketTimeline,
  SupportTicket,
  TicketComment,
  TicketDetail,
  TicketKpi,
  TicketStatus,
  TicketTimelineEntry,
} from "@/features/customer-support/types"
import {
  buildSparkline,
  formatTicketCount,
  formatTicketDateTime,
  getInitials,
  splitTicketDateTime,
} from "@/features/customer-support/utils/format"

function valueOrDash(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "-"
  }

  const text = String(value).trim()
  return text || "-"
}

function personName(person: ApiTicketPerson | string | null | undefined) {
  if (!person) {
    return "-"
  }

  if (typeof person === "string") {
    const text = person.trim()
    return text || "-"
  }

  const full =
    person.full_name ||
    person.name ||
    [person.first_name, person.middle_name, person.last_name]
      .filter(Boolean)
      .join(" ")

  const text = full?.trim() || person.email?.trim() || ""
  return text || "-"
}

export function normalizeTicketStatus(
  status: string | null | undefined,
): TicketStatus {
  const normalized = status?.trim().toLowerCase()

  if (normalized === "closed") return "closed"
  if (normalized === "overdue") return "overdue"
  if (normalized === "new") return "new"
  return "open"
}

export function extractApiTicket(
  response: ApiTicketDetailResponse,
): ApiTicket | null {
  if (!response || typeof response !== "object") {
    return null
  }

  if ("id" in response && (response as ApiTicket).id !== undefined) {
    return response as ApiTicket
  }

  const wrapped = response as {
    data?: ApiTicket
    ticket?: ApiTicket
    sla_due_in?: string | null
  }
  const ticket = wrapped.data ?? wrapped.ticket ?? null

  if (!ticket) {
    return null
  }

  if (wrapped.sla_due_in?.trim() && !ticket.sla_due_in?.trim()) {
    return {
      ...ticket,
      sla_due_in: wrapped.sla_due_in,
    }
  }

  return ticket
}

function resolveTimeline(ticket: ApiTicket) {
  return ticket.timelines ?? ticket.timeline ?? []
}

function mapComment(comment: ApiTicketComment, index: number): TicketComment {
  const author =
    comment.user ??
    comment.author ??
    (typeof comment.created_by === "object" ? comment.created_by : null)
  const authorName =
    personName(author) !== "-"
      ? personName(author)
      : typeof comment.created_by === "string"
        ? comment.created_by
        : "Support Agent"

  return {
    id: String(comment.id ?? index),
    authorName,
    authorInitials: getInitials(authorName),
    createdAt: formatTicketDateTime(comment.created_at).replace(" | ", " "),
    message: valueOrDash(comment.comment ?? comment.message ?? comment.body),
  }
}

function mapTimeline(
  entry: ApiTicketTimeline,
  index: number,
): TicketTimelineEntry {
  return {
    id: String(entry.id ?? index),
    dateTime: formatTicketDateTime(entry.created_at ?? entry.date_time),
    action: valueOrDash(entry.action ?? entry.description ?? entry.message),
  }
}

function resolveAssignee(ticket: ApiTicket) {
  const person = ticket.assignee ?? ticket.assigned_user
  const name = personName(person)
  const id =
    ticket.assigned_to ??
    (person?.id !== undefined ? String(person.id) : null)
  const hasAssignee = name !== "-" && Boolean(person || ticket.assigned_to)

  return {
    id,
    name: hasAssignee ? name : "-",
    initials: hasAssignee ? getInitials(name) : "-",
    role:
      hasAssignee && person?.role ? String(person.role) : "-",
  }
}

function resolveCustomer(ticket: ApiTicket) {
  const person = ticket.user ?? ticket.customer
  return {
    name: personName(person),
    accountNumber: valueOrDash(person?.profile?.account_number),
    userId:
      ticket.user_id ??
      (person?.id !== undefined ? String(person.id) : null),
  }
}

function resolveCreatedBy(ticket: ApiTicket) {
  if (typeof ticket.created_by === "string" && ticket.created_by.trim()) {
    return ticket.created_by
  }

  const fromCreatedBy = personName(
    typeof ticket.created_by === "object" ? ticket.created_by : null,
  )
  if (fromCreatedBy !== "-") {
    return fromCreatedBy
  }

  // List/detail payloads often only nest the ticket customer on `user`.
  return resolveCustomer(ticket).name
}

function resolveTicketNumber(ticket: ApiTicket) {
  const raw = ticket.ticket_number ?? ticket.ticket_id ?? ticket.id
  const value = String(raw)
  return value.startsWith("#") ? value : `#${value}`
}

function resolveAttachment(ticket: ApiTicket) {
  if (ticket.attachment_name) {
    return {
      id: "1",
      name: ticket.attachment_name,
      size:
        ticket.attachment_size === null || ticket.attachment_size === undefined
          ? "-"
          : String(ticket.attachment_size),
      url: ticket.attachment_path ?? null,
    }
  }

  const attachment =
    ticket.attachment ??
    (Array.isArray(ticket.attachments) ? ticket.attachments[0] : null)

  if (!attachment) {
    return null
  }

  return {
    id: String(attachment.id ?? "1"),
    name: valueOrDash(attachment.name ?? attachment.file_name),
    size:
      attachment.size === undefined || attachment.size === null
        ? "-"
        : String(attachment.size),
    url: attachment.url ?? null,
  }
}

function resolveSlaDueIn(ticket: ApiTicket) {
  if (ticket.sla_due_in?.trim()) {
    return ticket.sla_due_in
  }

  if (!ticket.sla_due_at) {
    return ticket.sla_hours ? `${ticket.sla_hours}h` : "-"
  }

  const due = new Date(ticket.sla_due_at).getTime()
  const now = Date.now()

  if (Number.isNaN(due)) {
    return "-"
  }

  const diffMs = due - now
  const abs = Math.abs(diffMs)
  const hours = Math.floor(abs / (1000 * 60 * 60))
  const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60))
  const label = `${hours}h ${minutes}m`

  return diffMs < 0 ? `Overdue ${label}` : label
}

export function mapApiTicketToSupportTicket(ticket: ApiTicket): SupportTicket {
  const assignee = resolveAssignee(ticket)

  return {
    id: String(ticket.id),
    ticketNumber: resolveTicketNumber(ticket),
    createdAt: formatTicketDateTime(ticket.created_at),
    createdBy: resolveCreatedBy(ticket),
    status: normalizeTicketStatus(ticket.status),
    category: valueOrDash(ticket.category),
    subcategory: valueOrDash(ticket.subcategory),
    assignedTo: assignee.name,
  }
}

export function mapApiTicketToTicketDetail(ticket: ApiTicket): TicketDetail {
  const { dateCreated, timeCreated } = splitTicketDateTime(ticket.created_at)
  const customer = resolveCustomer(ticket)
  const assignee = resolveAssignee(ticket)

  return {
    id: String(ticket.id),
    ticketNumber: resolveTicketNumber(ticket),
    status: normalizeTicketStatus(ticket.status),
    slaDueIn: resolveSlaDueIn(ticket),
    dateCreated,
    timeCreated,
    createdBy: resolveCreatedBy(ticket),
    customerName: customer.name,
    accountNumber: customer.accountNumber,
    userId: customer.userId,
    channel: valueOrDash(ticket.channel),
    category: valueOrDash(ticket.category),
    subcategory: valueOrDash(ticket.subcategory),
    ticketType: valueOrDash(ticket.ticket_type),
    description: valueOrDash(ticket.description),
    attachment: resolveAttachment(ticket),
    assignee,
    comments: (ticket.comments ?? []).map(mapComment),
    timeline: resolveTimeline(ticket).map(mapTimeline),
  }
}

export function mapApiMetricsToTicketKpis(
  metrics: ApiTicketMetricsResponse,
): TicketKpi[] {
  const entries = [
    {
      key: "new",
      label: "New Tickets",
      metric: metrics.new_tickets,
    },
    {
      key: "open",
      label: "Open Tickets",
      metric: metrics.open_tickets,
    },
    {
      key: "closed",
      label: "Closed Tickets",
      metric: metrics.closed_tickets,
    },
    {
      key: "overdue",
      label: "Overdue Tickets",
      metric: metrics.overdue_tickets,
    },
  ] as const

  return entries.map(({ key, label, metric }) => {
    const trend = metric.trend.direction === "down" ? "down" : "up"

    return {
      key,
      label,
      value: formatTicketCount(metric.value),
      changePercent: metric.trend.percentage,
      trend,
      sparkline: buildSparkline(metric.value, trend),
    }
  })
}
