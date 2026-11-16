"use client"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type PartnerToggleCardProps = {
  name: string
  enabled: boolean
  lastCallLabel: string | null
  onToggle: (enabled: boolean) => void
}

export function PartnerToggleCard({
  name,
  enabled,
  lastCallLabel,
  onToggle,
}: PartnerToggleCardProps) {
  return (
    <div
      className={cn(
        "flex min-w-[180px] flex-1 items-center justify-between gap-3 rounded-xl border px-4 py-3",
        enabled
          ? "border-foreground/20 bg-background"
          : "border-transparent bg-muted",
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {enabled ? lastCallLabel ?? "On" : "Off"}
        </p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        aria-label={`Toggle ${name}`}
      />
    </div>
  )
}
