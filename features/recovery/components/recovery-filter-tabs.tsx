"use client"

import { RECOVERY_TAB_ORDER } from "@/features/recovery/constants"
import type { RecoveryTab, RecoveryTabMeta } from "@/features/recovery/types"
import { cn } from "@/lib/utils"

type RecoveryFilterTabsProps = {
  value: RecoveryTab
  onChange: (value: RecoveryTab) => void
  tabs: Record<RecoveryTab, RecoveryTabMeta>
}

export function RecoveryFilterTabs({
  value,
  onChange,
  tabs,
}: RecoveryFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-2"
      role="tablist"
      aria-label="Recovery filters"
    >
      {RECOVERY_TAB_ORDER.map((tabValue) => {
        const tab = tabs[tabValue]
        const isActive = value === tabValue

        return (
          <button
            key={tabValue}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tabValue)}
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
