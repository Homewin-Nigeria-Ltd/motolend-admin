"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { TicketStatusBadge } from "@/features/customer-support/components/ticket-status-badge"
import type { SupportTicket } from "@/features/customer-support/types"

export const ticketColumns: ColumnDef<SupportTicket>[] = [
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
    accessorKey: "ticketNumber",
    header: "Ticket ID",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.ticketNumber}
      </span>
    ),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.createdBy}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <TicketStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-foreground">
        {row.original.subcategory}
      </span>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.assignedTo}
      </span>
    ),
  },
]
