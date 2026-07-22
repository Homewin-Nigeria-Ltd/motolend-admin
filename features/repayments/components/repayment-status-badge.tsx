import type { RepaymentStatus } from "@/features/repayments/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  paid: "bg-emerald-50 text-emerald-700",
  closed: "bg-emerald-50 text-emerald-700",
  defaulted: "bg-destructive/10 text-destructive",
  overdue: "bg-amber-50 text-amber-700",
}

const statusLabels: Record<string, string> = {
  active: "Active",
  paid: "Paid",
  closed: "Closed",
  defaulted: "Defaulted",
  overdue: "Overdue",
}

type RepaymentStatusBadgeProps = {
  status: RepaymentStatus | string
}

export function RepaymentStatusBadge({ status }: RepaymentStatusBadgeProps) {
  const normalized = status.trim().toLowerCase()

  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto rounded-full border-0 px-3 py-1 text-xs font-medium",
        statusStyles[normalized] ?? "bg-muted text-muted-foreground",
      )}
    >
      {statusLabels[normalized] ?? status}
    </Badge>
  )
}
