"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TicketFilterTabs } from "@/features/customer-support/components/ticket-filter-tabs"
import type { TicketTab } from "@/features/customer-support/types"

type TicketToolbarProps = {
  tab: TicketTab
  onTabChange: (value: TicketTab) => void
  search: string
  onSearchChange: (value: string) => void
  onAddTicket: () => void
  showViewAllTickets?: boolean
}

export function TicketToolbar({
  tab,
  onTabChange,
  search,
  onSearchChange,
  onAddTicket,
  showViewAllTickets = false,
}: TicketToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <TicketFilterTabs value={tab} onChange={onTabChange} />

        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[200px] flex-1 sm:max-w-xs">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-10"
            />
          </div>

          {showViewAllTickets ? (
            <Button type="button" variant="outline" className="h-10 px-4" asChild>
              <Link href="/support">View All Tickets</Link>
            </Button>
          ) : null}

          <Button
            type="button"
            className="h-10 px-4"
            icon={{ name: "add", position: "left" }}
            onClick={onAddTicket}
          >
            Add Ticket
          </Button>
        </div>
      </div>
    </div>
  )
}
