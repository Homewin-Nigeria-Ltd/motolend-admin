"use client"

import { Input } from "@/components/ui/input"
import type { ProgressionTier } from "@/features/loan-progression/types"
import { cn } from "@/lib/utils"

type TierCardProps = {
  tier: ProgressionTier
  onLimitChange: (value: string) => void
  onRepaymentsChange: (value: string) => void
}

export function TierCard({
  tier,
  onLimitChange,
  onRepaymentsChange,
}: TierCardProps) {
  const isHighlighted = Boolean(tier.highlighted)

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border p-5",
        isHighlighted
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-muted/60 text-foreground",
      )}
    >
      <p
        className={cn(
          "text-sm font-medium",
          isHighlighted ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        {tier.label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">
        ₦{tier.limit}
      </p>
      <p
        className={cn(
          "mt-2 text-sm leading-5",
          isHighlighted ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        {tier.description}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${tier.id}-limit`}
            className={cn(
              "text-xs font-medium",
              isHighlighted
                ? "text-primary-foreground/80"
                : "text-muted-foreground",
            )}
          >
            Limit (₦)
          </label>
          <Input
            id={`${tier.id}-limit`}
            value={tier.limit}
            onChange={(event) => onLimitChange(event.target.value)}
            className={cn(
              "mt-1.5 h-10",
              isHighlighted &&
                "border-primary-foreground/20 bg-primary-foreground text-foreground",
            )}
          />
        </div>
        <div>
          <label
            htmlFor={`${tier.id}-repayments`}
            className={cn(
              "text-xs font-medium",
              isHighlighted
                ? "text-primary-foreground/80"
                : "text-muted-foreground",
            )}
          >
            Repayments to unlock
          </label>
          <Input
            id={`${tier.id}-repayments`}
            value={tier.repaymentsToUnlock}
            onChange={(event) => onRepaymentsChange(event.target.value)}
            className={cn(
              "mt-1.5 h-10",
              isHighlighted &&
                "border-primary-foreground/20 bg-primary-foreground text-foreground",
            )}
          />
        </div>
      </div>
    </div>
  )
}
