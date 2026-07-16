import type { TicketListParams } from "@/features/customer-support/types"

export const ticketKeys = {
  all: ["tickets"] as const,
  metrics: () => [...ticketKeys.all, "metrics"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: (params: TicketListParams) => [...ticketKeys.lists(), params] as const,
  details: () => [...ticketKeys.all, "detail"] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
}
