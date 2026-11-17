"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { UserStatusBadge } from "@/features/users/components/user-status-badge"
import type { UserRecord } from "@/features/users/types"
import { getUserInitials } from "@/utils/get-initials"

export const userColumns: ColumnDef<UserRecord>[] = [
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
      const user = row.original

      return (
        <Link
          href={`/users/${user.id}`}
          onClick={(event) => event.stopPropagation()}
          className="flex items-center gap-3 hover:opacity-80"
        >
          <Avatar className="size-10">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground underline-offset-4 hover:underline">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </Link>
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
    accessorKey: "repaymentAccount",
    header: "Repayment Account",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.repaymentAccount}
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.role}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
  },
]

export const adminUserColumns: ColumnDef<UserRecord>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => (
      <Link
        href={`/users/${row.original.id}`}
        onClick={(event) => event.stopPropagation()}
        className="whitespace-nowrap font-medium text-foreground underline-offset-4 hover:underline"
      >
        {row.original.firstName}
      </Link>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.lastName}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.role}
      </span>
    ),
  },
]
