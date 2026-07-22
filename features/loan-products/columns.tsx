"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { LoanProductStatusBadge } from "@/features/loan-products/components/loan-product-status-badge"
import type { LoanProduct } from "@/features/loan-products/types"

export const loanProductColumns: ColumnDef<LoanProduct>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "amountRange",
    header: "Amount Range",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.amountRange}
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
    accessorKey: "tenure",
    header: "Tenure",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.tenure}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <LoanProductStatusBadge status={row.original.status} />
    ),
  },
]
