"use client"

import type { LoanProductIntegrationStatus } from "@/features/loan-products/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<LoanProductIntegrationStatus, string> = {
  connected: "bg-emerald-50 text-emerald-700",
  disconnected: "bg-muted text-muted-foreground",
}

const statusLabels: Record<LoanProductIntegrationStatus, string> = {
  connected: "Connected",
  disconnected: "Disconnected",
}

type LoanProductIntegrationBadgeProps = {
  status: LoanProductIntegrationStatus
}

export function LoanProductIntegrationBadge({
  status,
}: LoanProductIntegrationBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto rounded-full border-0 px-3 py-1 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </Badge>
  )
}
