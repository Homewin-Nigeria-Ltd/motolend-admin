"use client"

import type { ColumnDef } from "@tanstack/react-table"

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
}

export function getDisbursementColumns({
  onRequery,
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
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {getUserInitials(row.original.customerName)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate font-medium text-foreground">
            {row.original.customerName}
          </span>
        </div>
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
        const canRequery = row.original.status === "undisbursed"

        return (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canRequery}
            onClick={(event) => {
              event.stopPropagation()
              onRequery(row.original)
            }}
          >
            Requery
          </Button>
        )
      },
    },
  ]
}
