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
    id: "tenures",
    header: "Linked Tenures",
    cell: ({ row }) => {
      const tenures = row.original.tenures

      if (tenures.length === 0) {
        return <span className="text-muted-foreground">—</span>
      }

      return (
        <div className="flex flex-wrap gap-2">
          {tenures.map((tenure) => (
            <span
              key={tenure}
              className="inline-flex whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {tenure}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <LoanProductStatusBadge status={row.original.status} />
    ),
  },
]
