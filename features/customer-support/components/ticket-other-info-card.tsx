"use client"

import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { ReassignTicketDialog } from "@/features/customer-support/components/reassign-ticket-dialog"
import type { TicketDetail } from "@/features/customer-support/types"

type TicketOtherInfoCardProps = {
  ticket: TicketDetail
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-start sm:gap-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{displayValue(value)}</p>
    </div>
  )
}

export function TicketOtherInfoCard({ ticket }: TicketOtherInfoCardProps) {
  const [reassignOpen, setReassignOpen] = useState(false)
  const hasAssignee = ticket.assignee.name !== "-" && ticket.assignee.name.trim()
  const hasAttachment =
    ticket.attachment && displayValue(ticket.attachment.name) !== "-"

  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">
        Other Information
      </h3>

      <div className="mt-6 flex flex-col gap-4">
        <InfoRow label="Customer Name" value={ticket.customerName} />
        <InfoRow label="Account Number" value={ticket.accountNumber} />
        <InfoRow label="Channel" value={ticket.channel} />
        <InfoRow label="Category" value={ticket.category} />
        <InfoRow label="Subcategory" value={ticket.subcategory} />
        <InfoRow label="Ticket Type" value={ticket.ticketType} />
        <InfoRow label="Description" value={ticket.description} />

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-start sm:gap-6">
          <p className="text-sm text-muted-foreground">Attachment</p>
          {hasAttachment && ticket.attachment ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                  <Icons.fileText size={18} className="text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {ticket.attachment.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {displayValue(ticket.attachment.size)}
                  </p>
                </div>
              </div>
              {ticket.attachment.url ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Download ${ticket.attachment.name}`}
                  asChild
                >
                  <a href={ticket.attachment.url} target="_blank" rel="noreferrer">
                    <Icons.download size={18} />
                  </a>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Download ${ticket.attachment.name}`}
                  disabled
                >
                  <Icons.download size={18} />
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm font-medium text-foreground">-</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-start sm:gap-6">
          <p className="text-sm text-muted-foreground">Assigned To</p>
          <div className="flex items-center justify-between gap-3">
            {hasAssignee ? (
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                    {ticket.assignee.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {ticket.assignee.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {displayValue(ticket.assignee.role)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm font-medium text-foreground">-</p>
            )}
            <button
              type="button"
              className="shrink-0 text-sm font-medium text-primary hover:underline"
              onClick={() => setReassignOpen(true)}
            >
              Reassign Ticket
            </button>
          </div>
        </div>
      </div>

      <ReassignTicketDialog
        ticketId={ticket.id}
        currentAssigneeId={ticket.assignee.id}
        open={reassignOpen}
        onOpenChange={setReassignOpen}
      />
    </div>
  )
}
