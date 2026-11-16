"use client"

import { RECOVERY_TAB_META } from "@/features/recovery/data/mock-recovery"
import type { RecoveryTab } from "@/features/recovery/types"
import { cn } from "@/lib/utils"

const tabs = Object.entries(RECOVERY_TAB_META).map(([value, meta]) => ({
  value: value as RecoveryTab,
  label: meta.label,
  count: meta.count,
}))

type RecoveryFilterTabsProps = {
  value: RecoveryTab
  onChange: (value: RecoveryTab) => void
}

export function RecoveryFilterTabs({
  value,
  onChange,
}: RecoveryFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-2"
      role="tablist"
      aria-label="Recovery filters"
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
              "relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {tab.count.toLocaleString()}
            </span>
            {isActive ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
