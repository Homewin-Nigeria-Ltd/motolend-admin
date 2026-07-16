"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { AddTicketSheet } from "@/features/customer-support/components/add-ticket-sheet"
import { TicketToolbar } from "@/features/customer-support/components/ticket-toolbar"
import { TicketsListToolbar } from "@/features/customer-support/components/tickets-list-toolbar"
import { ticketColumns } from "@/features/customer-support/columns"
import { useTicketList } from "@/features/customer-support/hooks/use-ticket-queries"
import type { SupportTicket, TicketTab } from "@/features/customer-support/types"

const PAGE_SIZE = 15

export function TicketsListSection() {
  const router = useRouter()
  const [tab, setTab] = useState<TicketTab>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [addTicketOpen, setAddTicketOpen] = useState(false)

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

  if (isPending && tickets.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load tickets."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <section className="min-w-0">
        <DataTable
          columns={ticketColumns}
          data={tickets}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && tickets.length === 0)}
          emptyMessage="No tickets found."
          className="min-w-0"
          toolbar={
            <>
              <TicketsListToolbar />
              <TicketToolbar
                tab={tab}
                onTabChange={handleTabChange}
                search={search}
                onSearchChange={handleSearchChange}
                onAddTicket={() => setAddTicketOpen(true)}
              />
            </>
          }
        />
      </section>

      <AddTicketSheet open={addTicketOpen} onOpenChange={setAddTicketOpen} />
    </div>
  )
}
