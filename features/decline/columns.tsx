"use client"

import type { ColumnDef } from "@tanstack/react-table"

import type { DeclineRecord } from "@/features/decline/types"

export const declineColumns: ColumnDef<DeclineRecord>[] = [
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
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.customerName}
      </span>
    ),
  },
  {
    accessorKey: "amountRequested",
    header: "Amount requested",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.amountRequested}
      </span>
    ),
  },
  {
    accessorKey: "loanProductApproved",
    header: "Loan Product Approved",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.loanProductApproved}
      </span>
    ),
  },
  {
    accessorKey: "reasonForDecline",
    header: "Reason for Decline",
    cell: ({ row }) => (
      <span className="max-w-[280px] text-foreground">
        {row.original.reasonForDecline}
      </span>
    ),
  },
]
