"use client"

import type { LoanProductTab } from "@/features/loan-products/types"
import { cn } from "@/lib/utils"

const tabs: { value: LoanProductTab; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "active", label: "Active Products" },
  { value: "inactive", label: "Inactive Products" },
]

type LoanProductFilterTabsProps = {
  value: LoanProductTab
  onChange: (value: LoanProductTab) => void
}

export function LoanProductFilterTabs({
  value,
  onChange,
}: LoanProductFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-6"
      role="tablist"
      aria-label="Loan product filters"
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
