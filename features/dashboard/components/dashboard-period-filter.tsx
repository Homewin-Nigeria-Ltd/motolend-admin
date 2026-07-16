"use client"

import type { DashboardFilter } from "@/features/dashboard/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

const FILTER_LABELS: Record<DashboardFilter, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
}

type DashboardPeriodFilterProps = {
  value: DashboardFilter
  onChange: (value: DashboardFilter) => void
}

export function DashboardPeriodFilter({
  value,
  onChange,
}: DashboardPeriodFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 border-border bg-background px-3 text-sm font-medium"
        >
          {FILTER_LABELS[value]}
          <Icons.chevronDown size={16} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(FILTER_LABELS) as DashboardFilter[]).map((filter) => (
          <DropdownMenuItem key={filter} onClick={() => onChange(filter)}>
            {FILTER_LABELS[filter]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
