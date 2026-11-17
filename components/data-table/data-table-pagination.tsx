"use client"

import { PaginationControls } from "@/components/pagination-controls"
import type { DataTablePaginationState } from "@/components/data-table/types"
import { cn } from "@/lib/utils"

type DataTablePaginationProps = DataTablePaginationState & {
  className?: string
}

export function DataTablePagination({
  page,
  totalPages,
  onPageChange,
  className,
}: DataTablePaginationProps) {
  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "relative flex items-center justify-center px-4 py-4",
        className,
      )}
    >
      <p className="absolute left-4 text-sm text-foreground">
        Page {page} of {Math.max(totalPages, 1)}
      </p>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
