import {
  RECOVERY_TAB_META,
  RECOVERY_TAB_ORDER,
} from "@/features/recovery/constants"
import type {
  ApiRecoveryLoan,
  ApiRecoveryLoanListResponse,
  ApiRecoveryMetricItem,
  ApiRecoveryMetricsResponse,
  ApiRecoveryStageCount,
  ApiRecoveryStageCountsResponse,
  RecoveryListResponse,
  RecoveryLoan,
  RecoveryMetric,
  RecoveryPaymentStatus,
  RecoveryStageCount,
  RecoveryTab,
  RecoveryTabMeta,
} from "@/features/recovery/types"
import { formatMoney } from "@/features/users/utils/format-money"
import { formatUserCreatedAt } from "@/features/users/utils/user"

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

function isRecoveryTab(value: string): value is RecoveryTab {
  return RECOVERY_TAB_ORDER.includes(value as RecoveryTab)
}

function resolveCustomerName(loan: ApiRecoveryLoan) {
  if (toStringValue(loan.customer?.name)) {
    return toStringValue(loan.customer?.name)
  }

  const user = loan.user
  if (!user) return "—"

  if (toStringValue(user.name)) return toStringValue(user.name)

  const fullName = [user.first_name, user.last_name]
    .map((part) => toStringValue(part))
    .filter(Boolean)
    .join(" ")

  return fullName || "—"
}

function resolvePhone(loan: ApiRecoveryLoan) {
  return (
    toStringValue(loan.phone) ||
    toStringValue(loan.phone_number) ||
    toStringValue(loan.customer?.phone) ||
    toStringValue(loan.user?.phone) ||
    "—"
  )
}

function resolveLoanProduct(loan: ApiRecoveryLoan) {
  if (toStringValue(loan.loan_product_name)) {
    return toStringValue(loan.loan_product_name)
  }

  if (typeof loan.loan_product === "string") {
    return toStringValue(loan.loan_product) || "—"
  }

  if (loan.loan_product && typeof loan.loan_product === "object") {
    return toStringValue(loan.loan_product.name) || "—"
  }

  return "—"
}

function resolvePaymentStatus(
  value: string | null | undefined,
): RecoveryPaymentStatus {
  const normalized = toStringValue(value).toLowerCase()
  if (
    normalized.includes("paid") &&
    !normalized.includes("unpaid") &&
    !normalized.includes("partial")
  ) {
    return "paid"
  }
  return "unpaid"
}

function resolveStage(
  loan: ApiRecoveryLoan,
  fallback: RecoveryTab,
): RecoveryTab {
  const stage = toStringValue(loan.stage ?? loan.collection_stage)
  if (stage && isRecoveryTab(stage)) {
    return stage
  }
  return fallback
}

function formatDueDate(value: string | null | undefined) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return toStringValue(value) || "—"
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date)
}

function resolveAmountDisplay(
  formatted: string | null | undefined,
  value: number | string | null | undefined,
) {
  if (toStringValue(formatted)) return toStringValue(formatted)
  if (value == null || value === "") return "—"
  return formatMoney(value)
}

export function mapApiRecoveryLoan(
  loan: ApiRecoveryLoan,
  fallbackStage: RecoveryTab,
): RecoveryLoan {
  const applicationId = toStringValue(
    loan.application_id ?? loan.id,
  )
  const outstandingRaw = toNumber(
    loan.outstanding ?? loan.outstanding_amount ?? loan.total_payable ?? loan.total_repayment,
  )

  return {
    id: String(loan.id ?? applicationId),
    applicationId: applicationId.startsWith("#")
      ? applicationId
      : `#${applicationId}`,
    createdAt:
      toStringValue(loan.date_created) ||
      (loan.created_at ? formatUserCreatedAt(loan.created_at) : "—"),
    userId: toStringValue(
      loan.customer?.id ?? loan.user_id ?? loan.user?.id,
    ),
    customerName: resolveCustomerName(loan),
    phone: resolvePhone(loan),
    loanProduct: resolveLoanProduct(loan),
    principal: resolveAmountDisplay(
      loan.principal_formatted,
      loan.principal ?? loan.amount,
    ),
    interest: resolveAmountDisplay(
      loan.interest_formatted,
      loan.interest ?? loan.interest_amount ?? loan.interest_rate,
    ),
    totalPayable: resolveAmountDisplay(
      loan.total_payable_formatted,
      loan.total_payable ?? loan.total_repayment,
    ),
    dueDate: formatDueDate(loan.due_date),
    outstanding: resolveAmountDisplay(
      loan.outstanding_formatted,
      loan.outstanding ?? loan.outstanding_amount ?? outstandingRaw,
    ),
    outstandingRaw,
    status: resolvePaymentStatus(loan.payment_status ?? loan.status),
    tab: resolveStage(loan, fallbackStage),
  }
}

export function mapApiRecoveryLoanListResponse(
  response: ApiRecoveryLoanListResponse,
  params: { page: number; per_page: number; stage: RecoveryTab },
): RecoveryListResponse {
  const perPage = response.per_page ?? params.per_page
  const total = response.total ?? response.data?.length ?? 0
  const lastPage =
    response.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1)))

  return {
    items: (response.data ?? []).map((loan) =>
      mapApiRecoveryLoan(loan, params.stage),
    ),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  }
}

export function mapApiRecoveryStageCounts(
  response: ApiRecoveryStageCountsResponse,
): RecoveryStageCount[] {
  const rows = Array.isArray(response) ? response : (response.data ?? [])

  return rows
    .map((row: ApiRecoveryStageCount) => {
      const key = toStringValue(row.key)
      if (!isRecoveryTab(key)) return null

      return {
        key,
        label: toStringValue(row.label) || RECOVERY_TAB_META[key].label,
        count: toNumber(row.count),
        totalOutstanding: toNumber(row.total_outstanding),
        totalOutstandingFormatted: formatMoney(row.total_outstanding),
        suggestedAction: toStringValue(row.suggested_action),
        dpdRange:
          row.dpd_range == null
            ? null
            : {
                min: toNumber(row.dpd_range.min),
                max:
                  row.dpd_range.max == null
                    ? null
                    : toNumber(row.dpd_range.max),
              },
      } satisfies RecoveryStageCount
    })
    .filter((row): row is RecoveryStageCount => row != null)
}

export function buildRecoveryTabMeta(
  stageCounts: RecoveryStageCount[],
): Record<RecoveryTab, RecoveryTabMeta> {
  const byKey = new Map(stageCounts.map((stage) => [stage.key, stage]))

  return RECOVERY_TAB_ORDER.reduce(
    (acc, key) => {
      const stage = byKey.get(key)
      acc[key] = {
        label: stage?.label || RECOVERY_TAB_META[key].label,
        count: stage?.count ?? 0,
        description:
          stage?.suggestedAction || RECOVERY_TAB_META[key].description,
      }
      return acc
    },
    {} as Record<RecoveryTab, RecoveryTabMeta>,
  )
}

function mapRecoveryMetricItem(
  key: string,
  label: string,
  metric: ApiRecoveryMetricItem | null | undefined,
  asMoney = false,
): RecoveryMetric {
  if (metric == null) {
    return {
      key,
      label,
      value: asMoney ? formatMoney(0) : "0",
      changePercent: 0,
      trend: "up",
    }
  }

  const direction = toStringValue(metric.trend?.direction).toLowerCase()
  const percentage = Math.abs(
    toNumber(metric.trend?.percentage ?? metric.trend?.mom_change),
  )
  const value =
    toStringValue(metric.formatted) ||
    (asMoney
      ? resolveAmountDisplay(null, metric.value)
      : String(toNumber(metric.value)))

  return {
    key,
    label,
    value,
    changePercent: percentage,
    trend: direction === "down" ? "down" : "up",
  }
}

export function mapApiRecoveryMetrics(
  metrics: ApiRecoveryMetricsResponse,
): RecoveryMetric[] {
  return [
    mapRecoveryMetricItem(
      "outstanding",
      "Outstanding in recovery",
      metrics.outstanding_in_recovery,
      true,
    ),
    mapRecoveryMetricItem("due_today", "Due today", metrics.due_today, false),
    mapRecoveryMetricItem(
      "delinquency",
      "In delinquency",
      metrics.in_delinquency,
      false,
    ),
    mapRecoveryMetricItem(
      "recovered",
      "Recovered this month",
      metrics.recovered_this_month,
      true,
    ),
  ]
}
