"use client"

import type { UserTab } from "@/features/users/types"
import { cn } from "@/lib/utils"

const tabs: { value: UserTab; label: string }[] = [
  { value: "active", label: "Active Users" },
  { value: "inactive", label: "Inactive Users" },
  { value: "deactivated", label: "Deactivated Users" },
  { value: "admin", label: "Admin Users" },
]

type UserFilterTabsProps = {
  value: UserTab
  onChange: (value: UserTab) => void
}

export function UserFilterTabs({ value, onChange }: UserFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-6"
      role="tablist"
      aria-label="User filters"
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
