"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { ApiEligibilityReviewItem } from "@/features/loan-applications/types"
import { formatMoney } from "@/features/users/utils/format-money"
import { getUserInitials } from "@/utils/get-initials"

function formatDateTime(value: string | null | undefined) {
  if (!value?.trim()) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

type CreateEligibilityReviewColumnsOptions = {
  onReview: (review: ApiEligibilityReviewItem) => void
  isSubmitting?: boolean
}

export function createEligibilityReviewColumns({
  onReview,
  isSubmitting = false,
}: CreateEligibilityReviewColumnsOptions): ColumnDef<ApiEligibilityReviewItem>[] {
  return [
    {
      id: "statement_checked_at",
      header: "Statement Checked",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDateTime(row.original.statement_checked_at)}
        </span>
      ),
    },
    {
      id: "user",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original.user

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      id: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.user.phone}
        </span>
      ),
    },
    {
      id: "eligibility_amount",
      header: "Eligibility Amount",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {formatMoney(row.original.risk_analysis.eligibility_amount)}
        </span>
      ),
    },
    {
      id: "average_monthly_regular_income",
      header: "Avg Monthly Income",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {formatMoney(row.original.risk_analysis.average_monthly_regular_income)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const { status, reasons } = row.original.risk_analysis

        return (
          <div className="min-w-[12rem] max-w-[18rem]">
            <p className="text-sm font-medium capitalize text-foreground">
              {status.replaceAll("_", " ")}
            </p>
            {reasons[0] ? (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {reasons[0]}
              </p>
            ) : null}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          type="button"
          size="sm"
          className="h-9 px-4"
          disabled={isSubmitting}
          onClick={(event) => {
            event.stopPropagation()
            onReview(row.original)
          }}
        >
          Review
        </Button>
      ),
    },
  ]
}
