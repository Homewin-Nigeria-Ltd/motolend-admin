"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"
import type { TenureRecord } from "@/features/tenures/types"
import { cn } from "@/lib/utils"

type TenureColumnsOptions = {
  onEdit: (tenure: TenureRecord) => void
}

export function getTenureColumns({
  onEdit,
}: TenureColumnsOptions): ColumnDef<TenureRecord>[] {
  return [
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
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`More actions for ${row.original.name}`}
              onClick={(event) => event.stopPropagation()}
            >
              <Icons.moreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation()
                onEdit(row.original)
              }}
            >
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
