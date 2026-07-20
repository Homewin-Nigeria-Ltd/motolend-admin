"use client"

import type { ColumnDef } from "@tanstack/react-table"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { ApplicationStatusBadge } from "@/features/loan-applications/components/application-status-badge"
import type { LoanApplication } from "@/features/loan-applications/types"
import { getUserInitials } from "@/utils/get-initials"

export const applicationColumns: ColumnDef<LoanApplication>[] = [
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
      const application = row.original

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={application.avatarUrl ?? undefined}
              alt={application.customerName}
            />
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {getUserInitials(application.customerName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {application.customerName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {application.customerEmail}
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
    accessorKey: "principal",
    header: "Principal",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.principal}
      </span>
    ),
  },
  {
    accessorKey: "totalPayable",
    header: "Total Payable",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.totalPayable}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ApplicationStatusBadge status={row.original.status} />,
  },
]
