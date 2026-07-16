"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { AddTicketSheet } from "@/features/customer-support/components/add-ticket-sheet"
import { TicketSummaryCards } from "@/features/customer-support/components/ticket-summary-cards"
import { TicketToolbar } from "@/features/customer-support/components/ticket-toolbar"
import { ticketColumns } from "@/features/customer-support/columns"
import {
  useTicketList,
  useTicketMetrics,
} from "@/features/customer-support/hooks/use-ticket-queries"
import type { SupportTicket, TicketTab } from "@/features/customer-support/types"

const PAGE_SIZE = 15

export function TicketsOverviewSection() {
  const router = useRouter()
  const [tab, setTab] = useState<TicketTab>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [addTicketOpen, setAddTicketOpen] = useState(false)

  const {
    data: metrics,
    isPending: isMetricsPending,
    isError: isMetricsError,
    error: metricsError,
  } = useTicketMetrics()

  const {
    data: ticketList,
    isPending,
    isFetching,
    isError,
    error,
  } = useTicketList({
    page,
    per_page: PAGE_SIZE,
    search,
    status: tab === "all" ? undefined : tab,
  })

  const tickets = ticketList?.items ?? []
  const totalPages = ticketList?.meta.last_page ?? 1
  const currentPage = ticketList?.meta.current_page ?? page

  const handleTabChange = (value: TicketTab) => {
    setTab(value)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRowClick = (ticket: SupportTicket) => {
    router.push(`/support/${ticket.id}`)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      {isMetricsError ? (
        <div className="rounded-2xl border border-border bg-background p-4 text-sm text-destructive">
          {metricsError instanceof Error
            ? metricsError.message
            : "Failed to load ticket metrics."}
        </div>
      ) : (
        <TicketSummaryCards
          kpis={metrics ?? []}
          isLoading={isMetricsPending}
        />
      )}

      {isError ? (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load tickets."}
        </div>
      ) : (
        <DataTable
          columns={ticketColumns}
          data={tickets}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && tickets.length === 0)}
          emptyMessage="No tickets found."
          toolbar={
            <TicketToolbar
              tab={tab}
              onTabChange={handleTabChange}
              search={search}
              onSearchChange={handleSearchChange}
              onAddTicket={() => setAddTicketOpen(true)}
              showViewAllTickets
            />
          }
        />
      )}

      <AddTicketSheet open={addTicketOpen} onOpenChange={setAddTicketOpen} />
    </div>
  )
}
