"use client"

import type { ColumnDef } from "@tanstack/react-table"

import type { TenureRecord } from "@/features/tenures/types"
import { cn } from "@/lib/utils"

export const tenureColumns: ColumnDef<TenureRecord>[] = [
  {
    accessorKey: "name",
    header: "Tenure Name",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "tenure",
    header: "Tenure",
  },
  {
    accessorKey: "tenureType",
    header: "Tenure Type",
  },
  {
    accessorKey: "interestType",
    header: "Interest Type",
  },
  {
    accessorKey: "interestRate",
    header: "Interest Rate",
  },
  {
    accessorKey: "processingFee",
    header: "Processing Fee",
  },
  {
    accessorKey: "insuranceFee",
    header: "Insurance Fee",
  },
  {
    accessorKey: "linkedProducts",
    header: "Linked Products",
    cell: ({ row }) => (
      <span className="max-w-[220px] truncate text-foreground">
        {row.original.linkedProducts}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === "active"

      return (
        <span
          className={cn(
            "text-sm font-medium",
            isActive ? "text-emerald-700" : "text-muted-foreground",
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      )
    },
  },
]
