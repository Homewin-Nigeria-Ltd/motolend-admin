import type {
  AllocationDuration,
  AllocationSettings,
  AllocationSummary,
  ApiDisbursement,
  ApiDisbursementAllocationConfig,
  ApiDisbursementAllocationResponse,
  ApiDisbursementAllocationUsage,
  ApiDisbursementPartnerOption,
  DisbursementAllocationState,
  DisbursementPartnerOption,
  DisbursementRecord,
  DisbursementStatus,
} from "@/features/disbursement/types"
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

function resolveCustomerName(item: ApiDisbursement) {
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

function resolveLoanProduct(item: ApiDisbursement) {
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

function resolveBankAccount(item: ApiDisbursement) {
  if (toStringValue(item.bank_account)) {
    return toStringValue(item.bank_account)
  }

  const account = toStringValue(item.account_number)
  const bank = toStringValue(item.bank_name)

  if (account && bank) return `${account} - ${bank}`
  return account || bank || "—"
}

function resolveStatus(value: string | null | undefined): DisbursementStatus {
  const normalized = toStringValue(value).toLowerCase()
  if (
    normalized.includes("undisbursed") ||
    normalized.includes("pending") ||
    normalized.includes("failed")
  ) {
    return "undisbursed"
  }
  return "disbursed"
}

function resolveDuration(value: string | null | undefined): AllocationDuration {
  const normalized = toStringValue(value).toLowerCase()
  if (normalized === "weekly") return "weekly"
  if (normalized === "monthly") return "monthly"
  return "daily"
}

function resolvePeriodTitle(duration: AllocationDuration, label?: string) {
  if (toStringValue(label)) return toStringValue(label)
  if (duration === "weekly") return "This week"
  if (duration === "monthly") return "This month"
  return "Today"
}

function resolveResetNote(duration: AllocationDuration, note?: string) {
  if (toStringValue(note)) return toStringValue(note)
  if (duration === "weekly") return "Resets weekly."
  if (duration === "monthly") return "Resets monthly."
  return "Resets daily at 12:00 AM."
}

const DEFAULT_PARTNERS: DisbursementPartnerOption[] = [
  { value: "palmpay", label: "Palmpay" },
  { value: "monnify", label: "Monnify" },
  { value: "paylode", label: "Paylode" },
]

export const defaultAllocationSettings: AllocationSettings = {
  amountAllocated: 0,
  amountAllocatedFormatted: formatMoney(0),
  duration: "daily",
  partner: "monnify",
  disburseAutomatically: false,
}

export const defaultAllocationSummary: AllocationSummary = {
  title: "Today",
  resetNote: "Resets daily at 12:00 AM.",
  disbursed: formatMoney(0),
  remaining: formatMoney(0),
  usedPercent: 0,
  totalAllocated: formatMoney(0),
  loansDisbursed: 0,
  isExhausted: false,
  alert:
    "When allocation runs out, new disbursements pause until the next reset or you increase the amount.",
}

export function mapApiDisbursement(item: ApiDisbursement): DisbursementRecord {
  const applicationId = toStringValue(
    item.application_id ?? item.loan_application_id ?? item.id,
  )
  const loanId = toStringValue(
    item.loan_id ?? item.loan?.id ?? item.id ?? applicationId,
  )
  const status = resolveStatus(item.status)
  const canRequery =
    item.can_requery == null
      ? status === "undisbursed"
      : toBoolean(item.can_requery, false)

  return {
    id: String(item.id ?? loanId ?? applicationId),
    loanId,
    applicationId: applicationId.startsWith("#")
      ? applicationId
      : `#${applicationId}`,
    createdAt:
      toStringValue(item.date_created) ||
      (item.created_at ? formatUserCreatedAt(item.created_at) : "—"),
    customerName: resolveCustomerName(item),
    customerInitials: toStringValue(item.customer?.initials) || undefined,
    userId:
      item.customer?.id != null
        ? String(item.customer.id)
        : item.user_id != null
          ? String(item.user_id)
          : item.user?.id != null
            ? String(item.user.id)
            : undefined,
    loanProduct: resolveLoanProduct(item),
    principal:
      toStringValue(item.principal_formatted) ||
      formatMoney(item.principal ?? item.amount),
    bankAccount: resolveBankAccount(item),
    status,
    canRequery,
    transactionReference: item.transaction_reference ?? null,
    transactionStatus: item.transaction_status ?? null,
  }
}

function mapAvailablePartners(
  partners: ApiDisbursementPartnerOption[] | null | undefined,
): DisbursementPartnerOption[] {
  const mapped = (partners ?? [])
    .map((partner) => ({
      value: toStringValue(partner.value),
      label: toStringValue(partner.label) || toStringValue(partner.value),
    }))
    .filter((partner) => partner.value)

  return mapped.length > 0 ? mapped : DEFAULT_PARTNERS
}

function mapAllocationSettings(
  allocation: ApiDisbursementAllocationConfig | null | undefined,
): AllocationSettings {
  const amountAllocated = toNumber(allocation?.amount_allocated)

  return {
    amountAllocated,
    amountAllocatedFormatted:
      toStringValue(allocation?.amount_allocated_formatted) ||
      formatMoney(amountAllocated),
    duration: resolveDuration(allocation?.duration),
    partner: toStringValue(allocation?.disbursement_partner) || "monnify",
    disburseAutomatically: toBoolean(
      allocation?.disburse_automatically,
      false,
    ),
  }
}

function mapAllocationSummary(
  usage: ApiDisbursementAllocationUsage | null | undefined,
  settings: AllocationSettings,
): AllocationSummary {
  const disbursed = toNumber(usage?.disbursed_amount)
  const remainingRaw = usage?.remaining_amount
  const remaining =
    remainingRaw == null || remainingRaw === ""
      ? Math.max(settings.amountAllocated - disbursed, 0)
      : toNumber(remainingRaw)
  const usedPercentRaw = usage?.percentage_used
  const usedPercent =
    usedPercentRaw == null || usedPercentRaw === ""
      ? settings.amountAllocated > 0
        ? Math.min(
            100,
            Math.round((disbursed / settings.amountAllocated) * 100),
          )
        : 0
      : Math.min(100, Math.round(toNumber(usedPercentRaw)))
  const isExhausted = toBoolean(usage?.is_exhausted, usedPercent >= 100)
  const alertFromApi =
    toStringValue(usage?.alert_message) || toStringValue(usage?.message)
  const customerMessage = toStringValue(usage?.customer_message)
  const resumesAt =
    toStringValue(usage?.resumes_at) || toStringValue(usage?.declines_until)

  let alert = isExhausted
    ? "Allocation is exhausted. New disbursements pause until the next reset or you increase the amount."
    : "When allocation runs out, new disbursements pause until the next reset or you increase the amount."

  if (alertFromApi) {
    alert = alertFromApi
  } else if (isExhausted && resumesAt) {
    alert = `New requests are declined until ${resumesAt}.`
  }

  if (isExhausted && customerMessage) {
    alert = `${alert} Customers see: "${customerMessage}"`
  }

  return {
    title: resolvePeriodTitle(settings.duration, usage?.period_label ?? undefined),
    resetNote: resolveResetNote(
      settings.duration,
      usage?.reset_label ?? undefined,
    ),
    disbursed:
      toStringValue(usage?.disbursed_amount_formatted) || formatMoney(disbursed),
    remaining:
      toStringValue(usage?.remaining_amount_formatted) || formatMoney(remaining),
    usedPercent,
    totalAllocated: settings.amountAllocatedFormatted,
    loansDisbursed: toNumber(usage?.loans_disbursed_count),
    isExhausted,
    alert,
  }
}

export function mapApiDisbursementAllocationResponse(
  response: ApiDisbursementAllocationResponse | null | undefined,
): DisbursementAllocationState {
  const payload = response?.data ?? response
  const allocation = payload?.allocation ?? null
  const usage = payload?.usage ?? null
  const settings = mapAllocationSettings(allocation)

  return {
    settings,
    summary: mapAllocationSummary(usage, settings),
    availablePartners: mapAvailablePartners(payload?.available_partners),
  }
}

export function formatAllocationAmountInput(value: number) {
  if (!Number.isFinite(value) || value === 0) return ""
  return new Intl.NumberFormat("en-NG").format(value)
}

export function parseAllocationAmountInput(value: string) {
  const parsed = Number(value.replace(/,/g, "").trim())
  return Number.isFinite(parsed) ? parsed : 0
}
