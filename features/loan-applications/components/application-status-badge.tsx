"use client"

import type { ApplicationStatus } from "@/features/loan-applications/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  disbursed: "bg-sky-50 text-sky-700",
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  disbursed: "Disbursed",
}

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus | string
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const normalized = status.toLowerCase()

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
