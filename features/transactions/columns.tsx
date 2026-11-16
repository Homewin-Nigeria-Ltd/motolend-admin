"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import type { TransactionRecord } from "@/features/transactions/types"
import { cn } from "@/lib/utils"
import { getUserInitials } from "@/utils/get-initials"

export const transactionColumns: ColumnDef<TransactionRecord>[] = [
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
    accessorKey: "applicationId",
    header: "Application ID",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.applicationId}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => (
      <Link
        href={`/users/${row.original.userId}`}
        className="flex items-center gap-3 hover:opacity-80"
      >
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
            {getUserInitials(row.original.customerName)}
          </AvatarFallback>
        </Avatar>
        <span className="truncate font-medium text-foreground underline-offset-4 hover:underline">
          {row.original.customerName}
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "loanProduct",
    header: "Loan Product",
  },
  {
    accessorKey: "principal",
    header: "Principal",
  },
  {
    accessorKey: "interest",
    header: "Interest",
  },
  {
    accessorKey: "totalPayable",
    header: "Total Payable",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isPaid = row.original.status === "paid"

      return (
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-medium",
            isPaid
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600",
          )}
        >
          {isPaid ? "Paid" : "Unpaid"}
        </span>
      )
    },
  },
]
