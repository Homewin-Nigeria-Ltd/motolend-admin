"use client"

import type { ColumnDef } from "@tanstack/react-table"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { RepaymentStatusBadge } from "@/features/repayments/components/repayment-status-badge"
import type { Repayment, RepaymentScheduleItem } from "@/features/repayments/types"
import { getUserInitials } from "@/utils/get-initials"

export const repaymentColumns: ColumnDef<Repayment>[] = [
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
    accessorKey: "loanId",
    header: "Loan ID",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.loanId}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => {
      const repayment = row.original

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={repayment.avatarUrl ?? undefined}
              alt={repayment.customerName}
            />
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {getUserInitials(repayment.customerName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {repayment.customerName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {repayment.customerEmail}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "loanType",
    header: "Loan Type",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.loanType}
      </span>
    ),
  },
  {
    accessorKey: "outstanding",
    header: "Outstanding",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.outstanding}
      </span>
    ),
  },
  {
    accessorKey: "amountPaid",
    header: "Amt. Paid",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.amountPaid}
      </span>
    ),
  },
  {
    accessorKey: "penalties",
    header: "Penalties",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.penalties}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <RepaymentStatusBadge status={row.original.status} />,
  },
]

export const repaymentScheduleColumns: ColumnDef<RepaymentScheduleItem>[] = [
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
    accessorKey: "installmentNo",
    header: "Installment",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.installmentNo}
      </span>
    ),
  },
  {
    accessorKey: "principal",
    header: "Principal",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.principal}
      </span>
    ),
  },
  {
    accessorKey: "interest",
    header: "Interest",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.interest}
      </span>
    ),
  },
  {
    accessorKey: "totalDue",
    header: "Total Due",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.totalDue}
      </span>
    ),
  },
  {
    accessorKey: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.amountPaid}
      </span>
    ),
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.balance}
      </span>
    ),
  },
  {
    accessorKey: "penalty",
    header: "Penalty",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.penalty}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <RepaymentStatusBadge status={row.original.status} />,
  },
]
