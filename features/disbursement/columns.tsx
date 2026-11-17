"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { DisbursementRecord } from "@/features/disbursement/types"
import { cn } from "@/lib/utils"
import { getUserInitials } from "@/utils/get-initials"

type DisbursementColumnsOptions = {
  onRequery: (record: DisbursementRecord) => void
  pendingLoanId?: string | null
}

export function getDisbursementColumns({
  onRequery,
  pendingLoanId = null,
}: DisbursementColumnsOptions): ColumnDef<DisbursementRecord>[] {
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
      cell: ({ row }) => {
        const record = row.original
        const content = (
          <>
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                {record.customerInitials || getUserInitials(record.customerName)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-medium text-foreground underline-offset-4 hover:underline">
              {record.customerName}
            </span>
          </>
        )

        if (!record.userId) {
          return <div className="flex items-center gap-3">{content}</div>
        }

        return (
          <Link
            href={`/users/${record.userId}`}
            className="flex items-center gap-3 hover:opacity-80"
            onClick={(event) => event.stopPropagation()}
          >
            {content}
          </Link>
        )
      },
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
      accessorKey: "bankAccount",
      header: "Bank Account",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-foreground">
          {row.original.bankAccount}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isDisbursed = row.original.status === "disbursed"

        return (
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-medium",
              isDisbursed
                ? "bg-emerald-50 text-emerald-700"
                : "bg-orange-50 text-orange-700",
            )}
          >
            {isDisbursed ? "Disbursed" : "Undisbursed"}
          </span>
        )
      },
    },
    {
      id: "requery",
      header: "Requery",
      cell: ({ row }) => {
        const canRequery = row.original.canRequery
        const isPending = pendingLoanId === row.original.loanId

        return (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canRequery || Boolean(pendingLoanId)}
            onClick={(event) => {
              event.stopPropagation()
              onRequery(row.original)
            }}
          >
            {isPending ? "Verifying..." : "Requery"}
          </Button>
        )
      },
    },
  ]
}
