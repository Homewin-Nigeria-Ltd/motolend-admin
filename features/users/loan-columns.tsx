"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import type { LoanStatus, UserLoan } from "@/features/users/types"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  disbursed: "bg-sky-50 text-sky-700",
  repaid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-orange-50 text-orange-700",
  defaulted: "bg-destructive/10 text-destructive",
}

function LoanStatusBadge({ status }: { status: LoanStatus | string }) {
  const normalized = status.toLowerCase()

  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto rounded-full border-0 px-3 py-1 text-xs font-medium capitalize",
        statusStyles[normalized] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </Badge>
  )
}

export const userLoanColumns: ColumnDef<UserLoan>[] = [
  {
    accessorKey: "createdAt",
    header: "Date created",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.createdAt}
      </span>
    ),
  },
  {
    accessorKey: "productName",
    header: "Loan Product",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.productName}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.amount}
      </span>
    ),
  },
  {
    accessorKey: "interestRate",
    header: "Interest",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.interestRate}
      </span>
    ),
  },
  {
    accessorKey: "totalRepayment",
    header: "Total Repayment",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.totalRepayment}
      </span>
    ),
  },
  {
    accessorKey: "tenure",
    header: "Tenure",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.tenure}
      </span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.dueDate}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <LoanStatusBadge status={row.original.status} />,
  },
]
