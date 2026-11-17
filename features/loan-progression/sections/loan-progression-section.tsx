"use client"

import { useState } from "react"

import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Switch } from "@/components/ui/switch"
import { ProgressionCustomersTable } from "@/features/loan-progression/components/progression-customers-table"
import { TierCard } from "@/features/loan-progression/components/tier-card"
import { useUpdateLoanTierProgression } from "@/features/loan-progression/hooks/use-loan-tier-progression-mutations"
import { useLoanTierProgression } from "@/features/loan-progression/hooks/use-loan-tier-progression-queries"
import type {
  ProgressionCustomersResponse,
  ProgressionRule,
  ProgressionSettingsState,
  ProgressionTier,
} from "@/features/loan-progression/types"
import {
  buildUpdateLoanTierProgressionPayload,
  parseLimitInput,
} from "@/features/loan-progression/utils/map-progression"
import { toast } from "@/lib/toast"

const PAGE_SIZE = 15

export function LoanProgressionSection() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
  } = useLoanTierProgression({
    page,
    per_page: PAGE_SIZE,
    search,
  })

  if (isPending && !data) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-white p-4 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/loan-products/overview" label="Loan Products" />
          <h2 className="text-base font-semibold text-foreground">
            Loan Progression
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load loan tier progression."}
        </div>
      </div>
    )
  }

  return (
    <LoanProgressionContent
      initialSettings={data.settings}
      customers={data.customers}
      search={search}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      page={page}
      onPageChange={setPage}
      isCustomersLoading={isFetching && data.customers.items.length === 0}
    />
  )
}

function LoanProgressionContent({
  initialSettings,
  customers,
  search,
  onSearchChange,
  page,
  onPageChange,
  isCustomersLoading,
}: {
  initialSettings: ProgressionSettingsState
  customers: ProgressionCustomersResponse
  search: string
  onSearchChange: (value: string) => void
  page: number
  onPageChange: (page: number) => void
  isCustomersLoading: boolean
}) {
  const [categoryName, setCategoryName] = useState(initialSettings.categoryName)
  const [automaticUpgrades, setAutomaticUpgrades] = useState(
    initialSettings.automaticUpgrades,
  )
  const [tiers, setTiers] = useState<ProgressionTier[]>(initialSettings.tiers)
  const [rules, setRules] = useState<ProgressionRule[]>(initialSettings.rules)

  const { updateProgression, isPending: isSaving } =
    useUpdateLoanTierProgression()

  function updateTier(
    tierId: string,
    field: "limit" | "repaymentsToUnlock",
    value: string,
  ) {
    setTiers((current) =>
      current.map((tier) =>
        tier.id === tierId
          ? {
              ...tier,
              [field]:
                field === "limit"
                  ? parseLimitInput(value)
                  : value.replace(/\D/g, ""),
            }
          : tier,
      ),
    )
  }

  function toggleRule(ruleId: ProgressionRule["id"], enabled: boolean) {
    setRules((current) =>
      current.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled } : rule,
      ),
    )
  }

  const handleSave = async () => {
    if (tiers.length === 0) {
      toast.error("No tiers available to save")
      return
    }

    const invalidTier = tiers.some((tier) => {
      const limit = Number(tier.limit.replace(/,/g, ""))
      const repayments = Number(tier.repaymentsToUnlock)
      return (
        !Number.isFinite(limit) ||
        limit < 0 ||
        !Number.isFinite(repayments) ||
        repayments < 0
      )
    })

    if (invalidTier) {
      toast.error("Enter valid tier limits and repayment counts")
      return
    }

    const result = await updateProgression(
      buildUpdateLoanTierProgressionPayload({
        categoryName,
        automaticUpgrades,
        tiers,
        rules,
      }),
    )

    if (result.success && result.data) {
      setCategoryName(result.data.categoryName)
      setAutomaticUpgrades(result.data.automaticUpgrades)
      setTiers(result.data.tiers)
      setRules(result.data.rules)
    }
  }

  const totalPages = customers.meta.last_page ?? 1
  const currentPage = customers.meta.current_page ?? page

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-white p-4 md:gap-8 md:p-6">
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
              {categoryName}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Limits go up automatically after consecutive successful repayments.
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
                disabled={isSaving}
                aria-label="Automatic upgrades"
              />
            </div>
            <Button
              type="button"
              className="h-11 px-5"
              disabled={isSaving}
              onClick={() => {
                void handleSave()
              }}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-stretch">
          {tiers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tiers configured yet.
            </p>
          ) : (
            tiers.map((tier, index) => (
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
            ))
          )}
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
                disabled={isSaving}
                aria-label={rule.label}
              />
            </div>
          ))}
        </div>
      </section>

      <ProgressionCustomersTable
        customers={customers.items}
        search={search}
        onSearchChange={onSearchChange}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isCustomersLoading}
      />
    </div>
  )
}
