"use client"

import type { TicketTab } from "@/features/customer-support/types"
import { cn } from "@/lib/utils"

const tabs: { value: TicketTab; label: string }[] = [
  { value: "all", label: "All Tickets" },
  { value: "open", label: "Open Tickets" },
  { value: "closed", label: "Closed Tickets" },
  { value: "overdue", label: "Overdue Tickets" },
]

type TicketFilterTabsProps = {
  value: TicketTab
  onChange: (value: TicketTab) => void
}

export function TicketFilterTabs({ value, onChange }: TicketFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-6"
      role="tablist"
      aria-label="Ticket filters"
    >
      {tabs.map((tab) => {
        const isActive = value === tab.value

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {isActive ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
