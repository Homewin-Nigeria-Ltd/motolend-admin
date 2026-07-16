"use client"

import type { ReactNode } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateTicketStatus } from "@/features/customer-support/hooks/use-ticket-mutations"
import type { TicketDetail } from "@/features/customer-support/types"
import { cn } from "@/lib/utils"

type TicketDetailHeaderProps = {
  ticket: TicketDetail
}

const statusTriggerStyles = {
  open: "bg-emerald-50 text-emerald-700",
  closed: "bg-muted text-muted-foreground",
  overdue: "bg-red-50 text-red-600",
} as const

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

function HeaderField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

export function TicketDetailHeader({ ticket }: TicketDetailHeaderProps) {
  const { updateStatus, isPending } = useUpdateTicketStatus()

  const statusValue =
    ticket.status === "new"
      ? "open"
      : (ticket.status as keyof typeof statusTriggerStyles)

  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-4 md:px-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <HeaderField label="Ticket ID">
          <p className="text-sm font-semibold text-foreground">
            {displayValue(ticket.ticketNumber)}
          </p>
        </HeaderField>

        <HeaderField label="Status">
          <Select
            value={statusValue}
            disabled={isPending}
            onValueChange={(value) => {
              void updateStatus({
                ticketId: ticket.id,
                status: value as "open" | "closed" | "overdue",
              })
            }}
          >
            <SelectTrigger
              className={cn(
                "h-auto w-fit gap-1 rounded-full border-0 px-3 py-1 text-xs font-semibold capitalize shadow-none focus-visible:ring-0",
                statusTriggerStyles[statusValue],
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </HeaderField>

        <HeaderField label="SLA Due in">
          <p className="text-sm font-semibold text-foreground">
            {displayValue(ticket.slaDueIn)}
          </p>
        </HeaderField>

        <HeaderField label="Date Created">
          <p className="text-sm font-semibold text-foreground">
            {displayValue(ticket.dateCreated)}
          </p>
        </HeaderField>

        <HeaderField label="Time Created">
          <p className="text-sm font-semibold text-foreground">
            {displayValue(ticket.timeCreated)}
          </p>
        </HeaderField>

        <HeaderField label="Created By">
          <p className="text-sm font-semibold text-foreground">
            {displayValue(ticket.createdBy)}
          </p>
        </HeaderField>
      </div>
    </div>
  )
}
