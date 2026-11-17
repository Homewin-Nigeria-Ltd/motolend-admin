"use client"

import { RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

type PartnerToggleCardProps = {
  id: string
  value: string
  name: string
  selected: boolean
}

export function PartnerToggleCard({
  id,
  value,
  name,
  selected,
}: PartnerToggleCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-w-[180px] flex-1 cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors",
        selected
          ? "border-foreground/20 bg-background"
          : "border-transparent bg-muted hover:bg-muted/80",
      )}
    >
      <p className="truncate text-sm font-semibold text-foreground">{name}</p>
      <RadioGroupItem id={id} value={value} aria-label={`Select ${name}`} />
    </label>
  )
}
