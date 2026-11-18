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
  onDelete: (tenure: TenureRecord) => void
}

export function getTenureColumns({
  onEdit,
  onDelete,
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
      id: "linkedProducts",
      header: "Linked Products",
      cell: ({ row }) => {
        const products = row.original.linkedProducts

        if (products.length === 0) {
          return <span className="text-muted-foreground">—</span>
        }

        return (
          <div className="flex flex-wrap gap-2">
            {products.map((product) => (
              <span
                key={product}
                className="inline-flex whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {product}
              </span>
            ))}
          </div>
        )
      },
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
            <DropdownMenuItem
              variant="destructive"
              onClick={(event) => {
                event.stopPropagation()
                onDelete(row.original)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
