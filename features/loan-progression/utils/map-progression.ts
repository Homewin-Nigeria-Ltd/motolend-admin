import type {
  ApiLoanTier,
  ApiLoanTierCustomer,
  ApiLoanTierProgressionResponse,
  ApiLoanTierSettings,
  LoanTierProgressionResponse,
  ProgressionCustomer,
  ProgressionCustomerListMeta,
  ProgressionRule,
  ProgressionSettingsState,
  ProgressionTier,
  UpdateLoanTierProgressionInput,
} from "@/features/loan-progression/types"
import { formatMoney } from "@/features/users/utils/format-money"

function toStringValue(value: unknown) {
  if (value == null) return ""
  return String(value).trim()
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/,/g, ""))
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function toBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (["1", "true", "yes", "on"].includes(normalized)) return true
    if (["0", "false", "no", "off"].includes(normalized)) return false
  }
  return fallback
}

function formatLimitInput(value: number) {
  if (!Number.isFinite(value) || value === 0) return "0"
  return new Intl.NumberFormat("en-NG").format(value)
}

function unlockLabel(repayments: number) {
  if (repayments <= 0) return null
  if (repayments === 1) return "1 in a row"
  return `${repayments} in a row`
}

const RULE_DEFINITIONS: Array<{
  id: ProgressionRule["id"]
  label: string
}> = [
  {
    id: "reset_on_late_repayment",
    label: "A late or missed repayment resets the consecutive count to zero",
  },
  {
    id: "require_full_on_time_repayment",
    label:
      "A successful repayment means paid in full on or before the due date",
  },
  {
    id: "downgrade_on_default",
    label: "Move users down a tier after a default",
  },
]

export const defaultProgressionSettings: ProgressionSettingsState = {
  categoryName: "Loan category",
  automaticUpgrades: false,
  tiers: [],
  rules: RULE_DEFINITIONS.map((rule) => ({ ...rule, enabled: false })),
}

export function mapApiTier(
  tier: ApiLoanTier,
  index: number,
  total: number,
): ProgressionTier {
  const tierNumber = toNumber(tier.tier_number) || index + 1
  const limitValue = toNumber(tier.limit)
  const repayments = toNumber(tier.repayments_to_unlock)

  return {
    id: `tier-${tierNumber}`,
    tierNumber,
    label: toStringValue(tier.name) || `Tier ${tierNumber}`,
    limit: formatLimitInput(limitValue),
    limitValue,
    description:
      toStringValue(tier.description) ||
      (index === 0
        ? "Starting limit for every new user"
        : `Unlocked after ${repayments} consecutive successful repayment${repayments === 1 ? "" : "s"}`),
    repaymentsToUnlock: String(repayments),
    unlockLabel: index === 0 ? null : unlockLabel(repayments),
    highlighted: index === total - 1 && total > 1,
  }
}

export function mapApiSettings(
  settings: ApiLoanTierSettings | null | undefined,
): ProgressionSettingsState {
  if (!settings) {
    return defaultProgressionSettings
  }

  const tiers = (settings.tiers ?? []).map((tier, index, list) =>
    mapApiTier(tier, index, list.length),
  )

  return {
    categoryName: toStringValue(settings.category_name) || "Loan category",
    automaticUpgrades: toBoolean(settings.automatic_upgrades, false),
    tiers,
    rules: RULE_DEFINITIONS.map((rule) => ({
      ...rule,
      enabled: toBoolean(settings[rule.id], false),
    })),
  }
}

export function mapApiCustomer(
  customer: ApiLoanTierCustomer,
  index = 0,
): ProgressionCustomer {
  const id =
    toStringValue(customer.user_id) ||
    toStringValue(customer.customer?.id) ||
    `customer-${index + 1}`

  return {
    id,
    name: toStringValue(customer.customer?.name) || "—",
    initials: toStringValue(customer.customer?.initials) || undefined,
    currentLimit:
      toStringValue(customer.current_limit_formatted) ||
      formatMoney(customer.current_limit),
    consecutiveLabel:
      toStringValue(customer.consecutive_on_time_label) || "—",
    nextLimit:
      toStringValue(customer.next_limit_formatted) ||
      (customer.next_limit == null ? "—" : formatMoney(customer.next_limit)),
    progressPercent: Math.min(
      100,
      Math.max(0, Math.round(toNumber(customer.progress_percentage))),
    ),
  }
}

function mapCustomerMeta(
  progression: ApiLoanTierProgressionResponse["customer_progression"],
  fallbackPage: number,
  fallbackPerPage: number,
): ProgressionCustomerListMeta {
  const perPage = progression?.per_page ?? fallbackPerPage
  const total = progression?.total ?? progression?.data?.length ?? 0
  const lastPage =
    progression?.last_page ??
    Math.max(1, Math.ceil(total / Math.max(perPage, 1)))

  return {
    current_page: progression?.current_page ?? fallbackPage,
    last_page: lastPage,
    per_page: perPage,
    total,
  }
}

export function mapApiLoanTierProgressionResponse(
  response: ApiLoanTierProgressionResponse,
  params: { page: number; per_page: number },
): LoanTierProgressionResponse {
  const payload = response.data ?? response
  const settings = mapApiSettings(payload.settings)
  const customers = (payload.customer_progression?.data ?? []).map(
    (customer, index) => mapApiCustomer(customer, index),
  )

  return {
    settings,
    customers: {
      items: customers,
      meta: mapCustomerMeta(
        payload.customer_progression,
        params.page,
        params.per_page,
      ),
    },
  }
}

export function buildUpdateLoanTierProgressionPayload(input: {
  categoryName: string
  automaticUpgrades: boolean
  tiers: ProgressionTier[]
  rules: ProgressionRule[]
}): UpdateLoanTierProgressionInput {
  const ruleMap = Object.fromEntries(
    input.rules.map((rule) => [rule.id, rule.enabled]),
  ) as Record<ProgressionRule["id"], boolean>

  return {
    category_name: input.categoryName.trim(),
    automatic_upgrades: input.automaticUpgrades,
    reset_on_late_repayment: Boolean(ruleMap.reset_on_late_repayment),
    require_full_on_time_repayment: Boolean(
      ruleMap.require_full_on_time_repayment,
    ),
    downgrade_on_default: Boolean(ruleMap.downgrade_on_default),
    tiers: input.tiers.map((tier) => ({
      limit: toNumber(tier.limit),
      repayments_to_unlock: toNumber(tier.repaymentsToUnlock),
    })),
  }
}

export function parseLimitInput(value: string) {
  return value.replace(/[^\d,]/g, "")
}
