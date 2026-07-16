"use client"

import { useQuery } from "@tanstack/react-query"

import { ticketQueries } from "@/features/customer-support/api/queries"
import type { TicketListParams } from "@/features/customer-support/types"

export function useTicketMetrics() {
  return useQuery(ticketQueries.metrics())
}

export function useTicketList(params: TicketListParams) {
  return useQuery(ticketQueries.list(params))
}

export function useTicketDetail(ticketId: string) {
  return useQuery(ticketQueries.detail(ticketId))
}
