"use client"

import type { TransactionTab } from "@/features/transactions/types"
import { cn } from "@/lib/utils"

const tabs: { value: TransactionTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
]

type TransactionFilterTabsProps = {
  value: TransactionTab
  onChange: (value: TransactionTab) => void
}

export function TransactionFilterTabs({
  value,
  onChange,
}: TransactionFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-6"
      role="tablist"
      aria-label="Transaction filters"
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
