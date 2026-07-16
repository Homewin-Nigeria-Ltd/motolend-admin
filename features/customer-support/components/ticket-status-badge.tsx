import { Badge } from "@/components/ui/badge"
import type { TicketStatus } from "@/features/customer-support/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-primary/10 text-primary",
  },
  new: {
    label: "New",
    className: "bg-primary/10 text-primary",
  },
  closed: {
    label: "Closed",
    className: "bg-muted text-muted-foreground",
  },
  overdue: {
    label: "Overdue",
    className: "bg-destructive/10 text-destructive",
  },
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status]

  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto rounded-full border-0 px-3 py-1 text-xs font-medium capitalize",
        config.className,
      )}
    >
      {config.label}
    </Badge>
  )
}
