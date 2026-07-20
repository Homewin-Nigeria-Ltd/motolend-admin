"use client"

import type { ApplicationTab } from "@/features/loan-applications/types"
import { cn } from "@/lib/utils"

const tabs: { value: ApplicationTab; label: string }[] = [
  { value: "approved", label: "Approved Appl." },
  { value: "pending", label: "Pending Appl." },
  { value: "rejected", label: "Rejected Appl." },
  { value: "disbursed", label: "Disbursed Appl." },
]

type ApplicationFilterTabsProps = {
  value: ApplicationTab
  onChange: (value: ApplicationTab) => void
}

export function ApplicationFilterTabs({
  value,
  onChange,
}: ApplicationFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-6"
      role="tablist"
      aria-label="Application filters"
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
