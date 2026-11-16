import { LINKED_PRODUCT_OPTIONS } from "@/features/tenures/data/mock-tenures"
import type { CreateTenureFormInput } from "@/features/tenures/schemas/create-tenure.schema"
import type { TenureRecord } from "@/features/tenures/types"

function parseMoneyOrPercent(value: string) {
  const numeric = Number(value.replace(/[^\d.]/g, ""))
  return Number.isFinite(numeric) ? numeric : undefined
}

function mapTenureType(value: TenureRecord["tenureType"]) {
  if (value === "Days") return "days"
  if (value === "Weeks") return "weeks"
  return "months"
}

function mapInterestType(value: string) {
  const normalized = value.trim().toLowerCase()
  if (normalized.includes("reducing")) return "reducing"
  if (normalized.includes("flat")) return "flat"
  return ""
}

function mapLinkedProducts(value: string) {
  return LINKED_PRODUCT_OPTIONS.filter((option) =>
    value.toLowerCase().includes(option.toLowerCase()),
  )
}

export function mapTenureRecordToFormValues(
  tenure: TenureRecord,
): CreateTenureFormInput {
  return {
    name: tenure.name,
    code: tenure.code,
    linked_products: mapLinkedProducts(tenure.linkedProducts),
    description:
      tenure.description?.trim() ||
      `${tenure.name} tenure for linked loan products.`,
    tenure: tenure.tenure,
    tenure_type: mapTenureType(tenure.tenureType),
    repayment_frequency: tenure.repaymentFrequency ?? "monthly",
    interest_type: mapInterestType(tenure.interestType),
    interest_frequency: tenure.interestFrequency ?? "monthly",
    interest_rate: parseMoneyOrPercent(tenure.interestRate),
    processing_fee: parseMoneyOrPercent(tenure.processingFee),
    insurance_fee: parseMoneyOrPercent(tenure.insuranceFee),
    show_in_app: tenure.status === "active",
  }
}

export function findTenureById(id: string, records: TenureRecord[]) {
  return records.find((item) => item.id === id) ?? null
}
