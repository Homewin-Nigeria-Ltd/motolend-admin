const ticketsPath = "/admin/tickets"

export const ticketServerEndpoints = {
  metrics: `${ticketsPath}/metrics`,
  tickets: ticketsPath,
  ticket: (id: string) => `${ticketsPath}/${id}`,
  comments: (id: string) => `${ticketsPath}/${id}/comments`,
  status: (id: string) => `${ticketsPath}/${id}/status`,
  assign: (id: string) => `${ticketsPath}/${id}/assign`,
} as const

export const ticketEndpoints = {
  metrics: `/api/proxy${ticketsPath}/metrics`,
  tickets: `/api/proxy${ticketsPath}`,
  ticket: (id: string) => `/api/proxy${ticketsPath}/${id}`,
  comments: (id: string) => `/api/proxy${ticketsPath}/${id}/comments`,
  status: (id: string) => `/api/proxy${ticketsPath}/${id}/status`,
  assign: (id: string) => `/api/proxy${ticketsPath}/${id}/assign`,
} as const
