"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

import type { RecoveryLoan } from "@/features/recovery/types"
import { cn } from "@/lib/utils"

type RecoveryColumnsOptions = {
  onMarkPaid: (loan: RecoveryLoan) => void
}

export function getRecoveryColumns({
  onMarkPaid,
}: RecoveryColumnsOptions): ColumnDef<RecoveryLoan>[] {
  return [
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
          className="whitespace-nowrap font-medium text-foreground underline-offset-4 hover:underline"
        >
          {row.original.customerName}
        </Link>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.phone}
        </span>
      ),
    },
    {
      accessorKey: "loanProduct",
      header: "Loan Product",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.loanProduct}
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
      accessorKey: "totalPayable",
      header: "Total Payable",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.totalPayable}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.dueDate}
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
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const loan = row.original
        const isPaid = loan.status === "paid"

        return (
          <div
            className="flex items-center gap-1"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                !isPaid
                  ? "bg-red-50 text-red-600"
                  : "bg-muted text-muted-foreground",
              )}
            >
              Unpaid
            </button>
            <button
              type="button"
              disabled={isPaid}
              onClick={() => {
                if (!isPaid) {
                  onMarkPaid(loan)
                }
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                isPaid
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
              )}
            >
              Paid
            </button>
          </div>
        )
      },
    },
  ]
}
