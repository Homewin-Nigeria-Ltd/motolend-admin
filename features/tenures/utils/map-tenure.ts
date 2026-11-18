import type { CreateTenureFormInput } from "@/features/tenures/schemas/create-tenure.schema"
import type {
  ApiLoanTenure,
  ApiLoanTenureDetailResponse,
  TenureDetail,
  TenureRecord,
  TenureStatus,
} from "@/features/tenures/types"

function toStringValue(value: unknown) {
  if (value == null) return ""
  return String(value).trim()
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function toBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (["1", "true", "yes", "active"].includes(normalized)) return true
    if (["0", "false", "no", "inactive"].includes(normalized)) return false
  }
  return fallback
}

function formatPercent(value: unknown) {
  const numeric = toNumber(value)
  return `${numeric}%`
}

function mapTenureTypeLabel(
  value: string | null | undefined,
): TenureRecord["tenureType"] {
  const normalized = toStringValue(value).toLowerCase()
  if (normalized === "weeks" || normalized === "week") return "Weeks"
  if (normalized === "months" || normalized === "month") return "Months"
  return "Days"
}

function mapInterestTypeLabel(value: string | null | undefined) {
  const normalized = toStringValue(value).toLowerCase()
  if (normalized.includes("reducing")) return "Reducing balance"
  if (normalized.includes("flat")) return "Flat rate"
  return toStringValue(value) || "—"
}

function resolveLoanProductIds(tenure: ApiLoanTenure): string[] {
  if (Array.isArray(tenure.loan_product_ids) && tenure.loan_product_ids.length) {
    return tenure.loan_product_ids.map((id) => String(id))
  }

  return (tenure.loan_products ?? [])
    .map((product) => (product.id == null ? "" : String(product.id)))
    .filter(Boolean)
}

function resolveLinkedProducts(tenure: ApiLoanTenure): string[] {
  const names = (tenure.loan_products ?? [])
    .map((product) => toStringValue(product.name))
    .filter(Boolean)

  if (names.length) {
    return Array.from(new Set(names))
  }

  const linked = toStringValue(tenure.linked_products)
  if (linked) {
    return Array.from(
      new Set(
        linked
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean),
      ),
    )
  }

  return []
}

function resolveStatus(tenure: ApiLoanTenure): TenureStatus {
  const status = toStringValue(tenure.status).toLowerCase()
  if (status === "active" || status === "inactive") {
    return status
  }

  return toBoolean(tenure.is_active, false) ? "active" : "inactive"
}

function mapTenureTypeFormValue(value: string | null | undefined) {
  const normalized = toStringValue(value).toLowerCase()
  if (normalized === "weeks" || normalized === "week") return "weeks"
  if (normalized === "months" || normalized === "month") return "months"
  if (normalized === "days" || normalized === "day") return "days"
  return ""
}

function mapInterestTypeFormValue(value: string | null | undefined) {
  const normalized = toStringValue(value).toLowerCase()
  if (normalized.includes("reducing")) return "reducing"
  if (normalized.includes("flat")) return "flat"
  return ""
}

export function mapApiLoanTenure(tenure: ApiLoanTenure): TenureRecord {
  return {
    id: String(tenure.id),
    name: toStringValue(tenure.name) || "—",
    code: toStringValue(tenure.code) || "—",
    tenure: toNumber(tenure.tenure),
    tenureType: mapTenureTypeLabel(
      tenure.tenure_type_label ?? tenure.tenure_type,
    ),
    interestType:
      toStringValue(tenure.interest_type_label) ||
      mapInterestTypeLabel(tenure.interest_type),
    interestRate:
      toStringValue(tenure.interest_rate_label) ||
      formatPercent(tenure.interest_rate),
    processingFee:
      toStringValue(tenure.processing_fee_label) ||
      formatPercent(tenure.processing_fee),
    insuranceFee:
      toStringValue(tenure.insurance_fee_label) ||
      formatPercent(tenure.insurance_fee),
    loanProductIds: resolveLoanProductIds(tenure),
    linkedProducts: resolveLinkedProducts(tenure),
    status: resolveStatus(tenure),
    description: toStringValue(tenure.description) || undefined,
    repaymentFrequency: toStringValue(tenure.repayment_frequency) || undefined,
    interestFrequency: toStringValue(tenure.interest_frequency) || undefined,
  }
}

export function mapApiLoanTenureToFormValues(
  tenure: ApiLoanTenure,
): CreateTenureFormInput {
  return {
    name: toStringValue(tenure.name),
    code: toStringValue(tenure.code),
    loan_product_ids: resolveLoanProductIds(tenure),
    description: toStringValue(tenure.description),
    tenure: toNumber(tenure.tenure),
    tenure_type: mapTenureTypeFormValue(tenure.tenure_type),
    repayment_frequency: toStringValue(tenure.repayment_frequency).toLowerCase(),
    interest_type: mapInterestTypeFormValue(tenure.interest_type),
    interest_frequency: toStringValue(tenure.interest_frequency).toLowerCase(),
    interest_rate: toNumber(tenure.interest_rate),
    processing_fee: toNumber(tenure.processing_fee),
    insurance_fee: toNumber(tenure.insurance_fee),
    show_in_app: toBoolean(tenure.is_active, false),
  }
}

export function mapApiLoanTenureDetail(tenure: ApiLoanTenure): TenureDetail {
  return {
    ...mapApiLoanTenure(tenure),
    formValues: mapApiLoanTenureToFormValues(tenure),
  }
}

export function extractApiLoanTenure(response: ApiLoanTenureDetailResponse) {
  if (!response || typeof response !== "object") {
    return null
  }

  if ("id" in response && response.id != null) {
    return response as ApiLoanTenure
  }

  const wrapped = response as { data?: ApiLoanTenure }
  return wrapped.data ?? null
}

export function mapTenureRecordToFormValues(
  tenure: TenureRecord,
): CreateTenureFormInput {
  return {
    name: tenure.name,
    code: tenure.code,
    loan_product_ids: tenure.loanProductIds,
    description:
      tenure.description?.trim() ||
      `${tenure.name} tenure for linked loan products.`,
    tenure: tenure.tenure,
    tenure_type: mapTenureTypeFormValue(tenure.tenureType),
    repayment_frequency: tenure.repaymentFrequency ?? "monthly",
    interest_type: mapInterestTypeFormValue(tenure.interestType),
    interest_frequency: tenure.interestFrequency ?? "monthly",
    interest_rate: toNumber(tenure.interestRate.replace(/[^\d.]/g, "")),
    processing_fee: toNumber(tenure.processingFee.replace(/[^\d.]/g, "")),
    insurance_fee: toNumber(tenure.insuranceFee.replace(/[^\d.]/g, "")),
    show_in_app: tenure.status === "active",
  }
}
