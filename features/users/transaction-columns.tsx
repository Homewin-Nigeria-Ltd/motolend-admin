"use client"

import type { ColumnDef } from "@tanstack/react-table"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { UserTransaction } from "@/features/users/types"
import { getUserInitials } from "@/utils/get-initials"

export const userTransactionColumns: ColumnDef<UserTransaction>[] = [
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
    accessorKey: "name",
    header: "Customer Name",
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={transaction.avatarUrl ?? undefined}
              alt={transaction.name}
            />
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {getUserInitials(transaction.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {transaction.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {transaction.email}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "accountNumber",
    header: "Account Number",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.accountNumber}
      </span>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.phoneNumber}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="h-auto rounded-full border-0 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
      >
        {row.original.status}
      </Badge>
    ),
  },
]
