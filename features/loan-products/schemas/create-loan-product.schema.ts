import { z } from "zod/v3"

function requiredNumber(message: string) {
  return z
    .union([z.number(), z.nan(), z.undefined()])
    .refine((value): value is number => Number.isFinite(value), message)
}

function requiredPositiveNumber(message: string) {
  return requiredNumber(message).refine((value) => value > 0, message)
}

function requiredNonNegativeNumber(message: string) {
  return requiredNumber(message).refine((value) => value >= 0, message)
}

function requiredStringArray(message: string) {
  return z.array(z.string()).min(1, message)
}

const tierSchema = z.object({
  min_amount: requiredPositiveNumber("Minimum amount must be greater than 0"),
  max_amount: requiredPositiveNumber("Maximum amount must be greater than 0"),
  interest_rate: requiredNonNegativeNumber("Interest rate is required"),
})

const eligibilityCriteriaSchema = z.object({
  age: requiredPositiveNumber("Age is required")
    .refine((value) => Number.isInteger(value), "Age must be a whole number")
    .refine((value) => value >= 21, "Age must be 21 or above"),
  location: z.string().trim().min(1, "Location is required"),
  employment_status: z.string().trim().min(1, "Employment status is required"),
  credit_score: requiredPositiveNumber("Credit score is required")
    .refine(
      (value) => Number.isInteger(value),
      "Credit score must be a whole number",
    )
    .refine((value) => value >= 600, "Credit score must be 600 or above"),
})

const approvalWorkflowSchema = z.object({
  name: z.string().trim().min(1, "Workflow name is required"),
  steps: requiredPositiveNumber("Steps must be greater than 0").refine(
    (value) => Number.isInteger(value),
    "Steps must be a whole number",
  ),
})

export const createLoanProductSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().min(1, "Description is required"),
    min_amount: requiredPositiveNumber("Minimum amount must be greater than 0"),
    max_amount: requiredPositiveNumber("Maximum amount must be greater than 0"),
    interest_type: z.string().trim().min(1, "Interest type is required"),
    tenure: requiredPositiveNumber("Tenure must be greater than 0").refine(
      (value) => Number.isInteger(value),
      "Tenure must be a whole number",
    ),
    tenure_type: z.string().trim().min(1, "Tenure type is required"),
    credit_protection_fee: requiredNonNegativeNumber(
      "Credit protection fee is required",
    ),
    is_active: z.boolean(),
    code: z.string().trim().min(1, "Code is required"),
    category: z.string().trim().min(1, "Category is required"),
    eligibility_criteria: eligibilityCriteriaSchema,
    amount_increment: requiredPositiveNumber(
      "Amount increment must be greater than 0",
    ),
    currency: z.string().trim().min(1, "Currency is required"),
    interest_rate: requiredNonNegativeNumber("Interest rate is required"),
    repayment_frequency: z
      .string()
      .trim()
      .min(1, "Repayment frequency is required"),
    grace_period: z.string().trim().min(1, "Grace period is required"),
    start_date_rules: z.string().trim().min(1, "Start date rules is required"),
    processing_fee: requiredNonNegativeNumber("Processing fee is required"),
    late_payment_fee: requiredNonNegativeNumber("Late payment fee is required"),
    early_settlement_fee: requiredNonNegativeNumber(
      "Early settlement fee is required",
    ),
    insurance_fee: requiredNonNegativeNumber("Insurance fee is required"),
    repayment_methods: requiredStringArray("Select at least one repayment method"),
    payment_allocation: z
      .string()
      .trim()
      .min(1, "Payment allocation is required"),
    partial_payment_allowed: z
      .string()
      .trim()
      .min(1, "Partial payment setting is required"),
    overpayment_handling: z
      .string()
      .trim()
      .min(1, "Overpayment handling is required"),
    auto_debit_settings: z
      .string()
      .trim()
      .min(1, "Auto-debit settings is required"),
    collateral_required: z.boolean(),
    collateral_types: requiredStringArray("Select at least one collateral type"),
    valuation_rules: z.string().trim().min(1, "Valuation rules is required"),
    mandatory_documents: requiredStringArray(
      "Select at least one mandatory document",
    ),
    allowed_document_formats: requiredStringArray(
      "Select at least one document format",
    ),
    document_size_limit: requiredPositiveNumber(
      "Document size limit must be greater than 0",
    ),
    verification_method: z
      .string()
      .trim()
      .min(1, "Verification method is required"),
    approval_workflow: approvalWorkflowSchema,
    notifications_integrations: requiredStringArray(
      "Select at least one notification integration",
    ),
    tiers: z.array(tierSchema).min(1, "Add at least one tier"),
  })
  .superRefine((values, context) => {
    if (values.max_amount < values.min_amount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum amount must be greater than minimum amount",
        path: ["max_amount"],
      })
    }

    values.tiers.forEach((tier, index) => {
      if (tier.max_amount < tier.min_amount) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tier maximum must be greater than minimum",
          path: ["tiers", index, "max_amount"],
        })
      }
    })
  })

export type CreateLoanProductFormInput = z.input<typeof createLoanProductSchema>
export type CreateLoanProductFormValues = z.output<typeof createLoanProductSchema>
export type CreateLoanProductTierFormValues = z.output<typeof tierSchema>

export function getTierAmountsBoundsError(
  values: Pick<CreateLoanProductFormInput, "min_amount" | "max_amount" | "tiers">,
): string | null {
  const loanMin = values.min_amount
  const loanMax = values.max_amount

  if (
    typeof loanMin !== "number" ||
    typeof loanMax !== "number" ||
    !Number.isFinite(loanMin) ||
    !Number.isFinite(loanMax)
  ) {
    return null
  }

  for (const tier of values.tiers) {
    const tierMin = tier.min_amount
    const tierMax = tier.max_amount

    if (
      typeof tierMin !== "number" ||
      typeof tierMax !== "number" ||
      !Number.isFinite(tierMin) ||
      !Number.isFinite(tierMax)
    ) {
      continue
    }

    if (
      tierMin < loanMin ||
      tierMax > loanMax ||
      tierMin > loanMax ||
      tierMax < loanMin
    ) {
      return "Tier amounts must stay within the loan minimum and maximum."
    }
  }

  return null
}

export const createLoanProductFormDefaults: CreateLoanProductFormInput = {
  name: "",
  description: "",
  min_amount: undefined,
  max_amount: undefined,
  interest_type: "",
  tenure: undefined,
  tenure_type: "",
  credit_protection_fee: undefined,
  is_active: true,
  code: "",
  category: "",
  eligibility_criteria: {
    age: undefined,
    location: "",
    employment_status: "",
    credit_score: undefined,
  },
  amount_increment: undefined,
  currency: "",
  interest_rate: undefined,
  repayment_frequency: "",
  grace_period: "",
  start_date_rules: "",
  processing_fee: undefined,
  late_payment_fee: undefined,
  early_settlement_fee: undefined,
  insurance_fee: undefined,
  repayment_methods: [],
  payment_allocation: "",
  partial_payment_allowed: "",
  overpayment_handling: "",
  auto_debit_settings: "",
  collateral_required: false,
  collateral_types: [],
  valuation_rules: "",
  mandatory_documents: [],
  allowed_document_formats: [],
  document_size_limit: undefined,
  verification_method: "",
  approval_workflow: {
    name: "",
    steps: undefined,
  },
  notifications_integrations: [],
  tiers: [
    {
      min_amount: undefined,
      max_amount: undefined,
      interest_rate: undefined,
    },
  ],
}

export const INTEREST_TYPE_OPTIONS = ["flat", "reducing"] as const
export const TENURE_TYPE_OPTIONS = ["days", "weeks", "months"] as const
export const CURRENCY_OPTIONS = ["NGN"] as const
export const REPAYMENT_FREQUENCY_OPTIONS = [
  "one_time",
  "daily",
  "weekly",
  "bi_weekly",
  "monthly",
] as const
export const START_DATE_RULE_OPTIONS = [
  "immediate",
  "next_day",
  "next_month",
  "first_of_month",
  "custom_date",
] as const
export const PAYMENT_ALLOCATION_OPTIONS = [
  "principal_first",
  "interest_first",
] as const
export const PARTIAL_PAYMENT_OPTIONS = ["yes", "no"] as const
export const OVERPAYMENT_HANDLING_OPTIONS = ["refund", "apply_to_principal"] as const
export const AUTO_DEBIT_OPTIONS = ["enabled", "disabled"] as const
export const REPAYMENT_METHOD_OPTIONS = [
  "bank_transfer",
  "card",
  "direct_debit",
  "ussd",
  "salary_deduction",
  "wallet",
] as const
export const COLLATERAL_TYPE_OPTIONS = ["car", "property"] as const
export const VALUATION_RULE_OPTIONS = ["market_value", "book_value"] as const
export const MANDATORY_DOCUMENT_OPTIONS = ["id_card", "utility_bill"] as const
export const DOCUMENT_FORMAT_OPTIONS = ["pdf", "png", "jpeg"] as const
export const VERIFICATION_METHOD_OPTIONS = ["automated", "manual"] as const
export const NOTIFICATION_INTEGRATION_OPTIONS = ["sms", "email"] as const
export const EMPLOYMENT_STATUS_OPTIONS = [
  "employed",
  "self_employed",
  "business_owner",
  "contract",
  "retired",
  "student",
  "any",
] as const
