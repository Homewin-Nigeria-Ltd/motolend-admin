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

export const INTEREST_TYPE_OPTIONS = ["flat", "reducing"] as const
export const TENURE_TYPE_OPTIONS = ["days", "weeks", "months"] as const

export const createLoanProductSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().min(1, "Description is required"),
    min_amount: requiredPositiveNumber("Minimum amount must be greater than 0"),
    max_amount: requiredPositiveNumber("Maximum amount must be greater than 0"),
    interest_type: z
      .string()
      .trim()
      .min(1, "Interest type is required")
      .refine(
        (value) =>
          (INTEREST_TYPE_OPTIONS as readonly string[]).includes(value),
        "Interest type is required",
      ),
    tenure: requiredPositiveNumber("Tenure must be greater than 0").refine(
      (value) => Number.isInteger(value),
      "Tenure must be a whole number",
    ),
    tenure_type: z
      .string()
      .trim()
      .min(1, "Tenure type is required")
      .refine(
        (value) => (TENURE_TYPE_OPTIONS as readonly string[]).includes(value),
        "Tenure type is required",
      ),
    credit_protection_fee: requiredNonNegativeNumber(
      "Credit protection fee is required",
    ),
    is_active: z.boolean(),
    interest_rate: requiredNonNegativeNumber("Interest rate is required"),
    processing_fee: requiredNonNegativeNumber("Processing fee is required"),
    insurance_fee: requiredNonNegativeNumber("Insurance fee is required"),
  })
  .superRefine((values, context) => {
    if (values.max_amount < values.min_amount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum amount must be greater than minimum amount",
        path: ["max_amount"],
      })
    }
  })

export type CreateLoanProductFormInput = z.input<typeof createLoanProductSchema>
export type CreateLoanProductFormValues = z.output<typeof createLoanProductSchema>

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
  interest_rate: undefined,
  processing_fee: undefined,
  insurance_fee: undefined,
}
