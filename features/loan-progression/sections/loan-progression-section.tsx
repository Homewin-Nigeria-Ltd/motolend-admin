"use client"

import { useState } from "react"

import { BackLink } from "@/components/back-link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Switch } from "@/components/ui/switch"
import { ProgressionCustomersTable } from "@/features/loan-progression/components/progression-customers-table"
import { TierCard } from "@/features/loan-progression/components/tier-card"
import {
  defaultRules,
  defaultTiers,
  progressionCategory,
  progressionCustomers,
} from "@/features/loan-progression/data/mock-progression"
import type {
  ProgressionRule,
  ProgressionTier,
} from "@/features/loan-progression/types"
import { toast } from "@/lib/toast"

export function LoanProgressionSection() {
  const [automaticUpgrades, setAutomaticUpgrades] = useState(true)
  const [tiers, setTiers] = useState<ProgressionTier[]>(defaultTiers)
  const [rules, setRules] = useState<ProgressionRule[]>(defaultRules)

  function updateTier(
    tierId: string,
    field: "limit" | "repaymentsToUnlock",
    value: string,
  ) {
    setTiers((current) =>
      current.map((tier) =>
        tier.id === tierId ? { ...tier, [field]: value } : tier,
      ),
    )
  }

  function toggleRule(ruleId: string, enabled: boolean) {
    setRules((current) =>
      current.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled } : rule,
      ),
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/loan-products/overview" label="Loan Products" />
        <h2 className="text-base font-semibold text-foreground">
          Loan Progression
        </h2>
      </div>

      <section className="rounded-2xl border border-border bg-background p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-foreground">
              {progressionCategory.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {progressionCategory.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-2.5">
              <span className="text-sm font-medium text-foreground">
                Automatic upgrades
              </span>
              <Switch
                checked={automaticUpgrades}
                onCheckedChange={setAutomaticUpgrades}
                aria-label="Automatic upgrades"
              />
            </div>
            <Button
              type="button"
              className="h-11 px-5"
              onClick={() => toast.success("Progression settings saved")}
            >
              Save changes
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-stretch">
          {tiers.map((tier, index) => (
            <div
              key={tier.id}
              className="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row xl:items-center"
            >
              {index > 0 ? (
                <div className="flex shrink-0 items-center justify-center gap-2 xl:w-28 xl:flex-col">
                  <Icons.chevronRight
                    size={18}
                    className="hidden text-muted-foreground xl:block"
                  />
                  <Icons.chevronDown
                    size={18}
                    className="text-muted-foreground xl:hidden"
                  />
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {tier.unlockLabel}
                  </span>
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <TierCard
                  tier={tier}
                  onLimitChange={(value) =>
                    updateTier(tier.id, "limit", value)
                  }
                  onRepaymentsChange={(value) =>
                    updateTier(tier.id, "repaymentsToUnlock", value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 rounded-2xl bg-muted p-4 md:p-5">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-background px-4 py-3"
            >
              <p className="text-sm text-foreground">{rule.label}</p>
              <Switch
                checked={rule.enabled}
                onCheckedChange={(enabled) => toggleRule(rule.id, enabled)}
                aria-label={rule.label}
              />
            </div>
          ))}
        </div>
      </section>

      <ProgressionCustomersTable customers={progressionCustomers} />
    </div>
  )
}
