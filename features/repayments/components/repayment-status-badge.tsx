import type { RepaymentStatus } from "@/features/repayments/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  disbursed: "bg-primary/10 text-primary",
  repaid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-amber-50 text-amber-700",
  defaulted: "bg-destructive/10 text-destructive",
}

const statusLabels: Record<string, string> = {
  disbursed: "Disbursed",
  repaid: "Repaid",
  overdue: "Overdue",
  defaulted: "Defaulted",
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
