import type {
  ApiTransaction,
  ApiTransactionListResponse,
  ApiTransactionMetricItem,
  ApiTransactionMetricsResponse,
  TransactionListResponse,
  TransactionMetric,
  TransactionRecord,
  TransactionStatus,
} from "@/features/transactions/types"
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

function resolveCustomerName(item: ApiTransaction) {
  if (toStringValue(item.customer?.name)) {
    return toStringValue(item.customer?.name)
  }

  if (toStringValue(item.customer_name)) {
    return toStringValue(item.customer_name)
  }

  const user = item.user
  if (!user) return "—"

  if (toStringValue(user.name)) return toStringValue(user.name)

  const fullName = [user.first_name, user.last_name]
    .map((part) => toStringValue(part))
    .filter(Boolean)
    .join(" ")

  return fullName || "—"
}

function resolveLoanProduct(item: ApiTransaction) {
  if (toStringValue(item.loan_product_name)) {
    return toStringValue(item.loan_product_name)
  }

  if (typeof item.loan_product === "string") {
    return toStringValue(item.loan_product) || "—"
  }

  if (item.loan_product && typeof item.loan_product === "object") {
    return toStringValue(item.loan_product.name) || "—"
  }

  return "—"
}

function resolveStatus(value: string | null | undefined): TransactionStatus {
  const normalized = toStringValue(value).toLowerCase()
  if (
    normalized.includes("unpaid") ||
    normalized.includes("pending") ||
    normalized.includes("failed") ||
    normalized.includes("overdue")
  ) {
    return "unpaid"
  }
  return "paid"
}

function resolveAmountDisplay(
  formatted: string | null | undefined,
  value: number | string | null | undefined,
) {
  if (toStringValue(formatted)) {
    return toStringValue(formatted)
  }
  if (value == null || value === "") return "—"
  if (typeof value === "string" && value.includes("₦")) return value
  return formatMoney(value)
}

function mapMetricItem(
  key: string,
  label: string,
  metric: ApiTransactionMetricItem | null | undefined,
  asMoney = false,
): TransactionMetric {
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

export function mapApiTransaction(item: ApiTransaction): TransactionRecord {
  const applicationId = toStringValue(
    item.application_id ?? item.loan_application_id ?? item.id,
  )
  const userId = toStringValue(
    item.customer?.id ?? item.user_id ?? item.user?.id,
  )

  return {
    id: String(item.id ?? applicationId),
    applicationId: applicationId.startsWith("#")
      ? applicationId
      : `#${applicationId}`,
    createdAt:
      toStringValue(item.date_created) ||
      (item.created_at ? formatUserCreatedAt(item.created_at) : "—"),
    userId: userId || "—",
    customerName: resolveCustomerName(item),
    customerInitials: toStringValue(item.customer?.initials) || undefined,
    loanProduct: resolveLoanProduct(item),
    principal: resolveAmountDisplay(
      item.principal_formatted,
      item.principal ?? item.amount,
    ),
    interest: resolveAmountDisplay(
      item.interest_formatted,
      item.interest ?? item.interest_amount,
    ),
    totalPayable: resolveAmountDisplay(
      item.total_payable_formatted,
      item.total_payable ?? item.total_repayment,
    ),
    principalRaw: toNumber(item.principal ?? item.amount),
    interestRaw: toNumber(item.interest ?? item.interest_amount),
    totalPayableRaw: toNumber(item.total_payable ?? item.total_repayment),
    status: resolveStatus(item.status),
  }
}

export function mapApiTransactionMetrics(
  metrics: ApiTransactionMetricsResponse,
): TransactionMetric[] {
  return [
    mapMetricItem("all", "All transactions", metrics.all_transactions, false),
    mapMetricItem("paid", "Paid", metrics.paid, true),
    mapMetricItem("unpaid", "Unpaid", metrics.unpaid, true),
    mapMetricItem("interest", "Interest earned", metrics.interest_earned, true),
  ]
}

export function mapApiTransactionListResponse(
  response: ApiTransactionListResponse,
  params: { page: number; per_page: number },
): TransactionListResponse {
  const perPage = response.per_page ?? params.per_page
  const total = response.total ?? response.data?.length ?? 0
  const lastPage =
    response.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1)))

  return {
    items: (response.data ?? []).map(mapApiTransaction),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  }
}
