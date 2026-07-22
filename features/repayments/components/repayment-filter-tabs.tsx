"use client"

import type { RepaymentTab } from "@/features/repayments/types"
import { cn } from "@/lib/utils"

const tabs: { value: RepaymentTab; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "paid", label: "Paid" },
  { value: "defaulted", label: "Defaulted" },
  { value: "overdue", label: "Overdue" },
]

type RepaymentFilterTabsProps = {
  value: RepaymentTab
  onChange: (value: RepaymentTab) => void
}

export function RepaymentFilterTabs({
  value,
  onChange,
}: RepaymentFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-6"
      role="tablist"
      aria-label="Repayment filters"
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
