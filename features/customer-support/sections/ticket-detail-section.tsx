"use client"

import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"
import { TicketCommentsCard } from "@/features/customer-support/components/ticket-comments-card"
import { TicketDetailHeader } from "@/features/customer-support/components/ticket-detail-header"
import { TicketOtherInfoCard } from "@/features/customer-support/components/ticket-other-info-card"
import { TicketTimelineSection } from "@/features/customer-support/components/ticket-timeline-section"
import { useTicketDetail } from "@/features/customer-support/hooks/use-ticket-queries"

type TicketDetailSectionProps = {
  ticketId: string
}

export function TicketDetailSection({ ticketId }: TicketDetailSectionProps) {
  const { data: ticket, isPending, isError, error } = useTicketDetail(ticketId)

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !ticket) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/support/overview" label="Customer Support" />
          <h2 className="text-base font-semibold text-foreground">
            Ticket Details
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load ticket."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/support/overview" label="Customer Support" />
        <h2 className="text-base font-semibold text-foreground">
          Ticket Details
        </h2>
      </div>

      <TicketDetailHeader ticket={ticket} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <TicketOtherInfoCard ticket={ticket} />
        <TicketCommentsCard ticketId={ticket.id} comments={ticket.comments} />
      </div>

      <TicketTimelineSection timeline={ticket.timeline} />
    </div>
  )
}
