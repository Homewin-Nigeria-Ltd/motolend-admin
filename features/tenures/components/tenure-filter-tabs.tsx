"use client"

import type { TenureTab } from "@/features/tenures/types"
import { cn } from "@/lib/utils"

const tabs: { value: TenureTab; label: string }[] = [
  { value: "all", label: "All Tenures" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

type TenureFilterTabsProps = {
  value: TenureTab
  onChange: (value: TenureTab) => void
}

export function TenureFilterTabs({ value, onChange }: TenureFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-6"
      role="tablist"
      aria-label="Tenure filters"
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
