import { queryOptions } from "@tanstack/react-query"

import { ticketEndpoints } from "@/features/customer-support/api/endpoints"
import { ticketKeys } from "@/features/customer-support/api/keys"
import type {
  ApiTicketDetailResponse,
  ApiTicketListResponse,
  ApiTicketMetricsResponse,
  TicketDetail,
  TicketKpi,
  TicketListParams,
  TicketListResponse,
} from "@/features/customer-support/types"
import {
  extractApiTicket,
  mapApiMetricsToTicketKpis,
  mapApiTicketToSupportTicket,
  mapApiTicketToTicketDetail,
} from "@/features/customer-support/utils/ticket"
import { api } from "@/lib/api/client"

async function fetchTicketMetrics(): Promise<TicketKpi[]> {
  const response = await api.get<ApiTicketMetricsResponse>(
    ticketEndpoints.metrics,
  )

  return mapApiMetricsToTicketKpis(response)
}

async function fetchTicketList(
  params: TicketListParams,
): Promise<TicketListResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: params.per_page ?? 15,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.status) {
    query.status = params.status
  }

  const response = await api.get<ApiTicketListResponse>(
    ticketEndpoints.tickets,
    query,
  )

  return {
    items: (response.data ?? []).map(mapApiTicketToSupportTicket),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: response.last_page ?? 1,
      per_page: response.per_page ?? params.per_page ?? 15,
      total: response.total ?? response.data?.length ?? 0,
    },
  }
}

async function fetchTicketDetail(id: string): Promise<TicketDetail> {
  const response = await api.get<ApiTicketDetailResponse>(
    ticketEndpoints.ticket(id),
  )
  const ticket = extractApiTicket(response)

  if (!ticket) {
    throw new Error("Ticket not found")
  }

  return mapApiTicketToTicketDetail(ticket)
}

export const ticketQueries = {
  metrics: () =>
    queryOptions({
      queryKey: ticketKeys.metrics(),
      queryFn: fetchTicketMetrics,
      staleTime: 60 * 1000,
    }),

  list: (params: TicketListParams) =>
    queryOptions({
      queryKey: ticketKeys.list(params),
      queryFn: () => fetchTicketList(params),
      placeholderData: (previous) => previous,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ticketKeys.detail(id),
      queryFn: () => fetchTicketDetail(id),
      enabled: Boolean(id.trim()),
    }),
}
