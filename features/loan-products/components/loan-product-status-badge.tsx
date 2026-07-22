import type { LoanProductStatus } from "@/features/loan-products/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<LoanProductStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-muted text-muted-foreground",
}

const statusLabels: Record<LoanProductStatus, string> = {
  active: "Active",
  inactive: "Inactive",
}

type LoanProductStatusBadgeProps = {
  status: LoanProductStatus | string
}

export function LoanProductStatusBadge({ status }: LoanProductStatusBadgeProps) {
  const normalized =
    status.trim().toLowerCase() === "inactive" ? "inactive" : "active"

  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto rounded-full border-0 px-3 py-1 text-xs font-medium",
        statusStyles[normalized],
      )}
    >
      {statusLabels[normalized]}
    </Badge>
  )
}
