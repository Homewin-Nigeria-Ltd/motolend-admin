import { z } from "zod/v3"

export const TENURE_TYPE_OPTIONS = ["days", "weeks", "months"] as const
export const REPAYMENT_FREQUENCY_OPTIONS = [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
] as const
export const INTEREST_TYPE_OPTIONS = ["flat", "reducing"] as const

function requiredPositiveNumber(message: string) {
  return z
    .union([z.number(), z.nan(), z.undefined()])
    .refine((value): value is number => Number.isFinite(value), message)
    .refine((value) => value > 0, message)
}

function requiredNonNegativeNumber(message: string) {
  return z
    .union([z.number(), z.nan(), z.undefined()])
    .refine((value): value is number => Number.isFinite(value), message)
    .refine((value) => value >= 0, message)
}

export const createTenureSchema = z.object({
  name: z.string().trim().min(1, "Tenure name is required"),
  code: z.string().trim().min(1, "Tenure code is required"),
  linked_products: z.array(z.string()).min(1, "Select at least one product"),
  description: z.string().trim().min(1, "Description is required"),
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
  repayment_frequency: z
    .string()
    .trim()
    .min(1, "Repayment frequency is required")
    .refine(
      (value) =>
        (REPAYMENT_FREQUENCY_OPTIONS as readonly string[]).includes(value),
      "Repayment frequency is required",
    ),
  interest_type: z
    .string()
    .trim()
    .min(1, "Interest type is required")
    .refine(
      (value) => (INTEREST_TYPE_OPTIONS as readonly string[]).includes(value),
      "Interest type is required",
    ),
  interest_rate: requiredPositiveNumber("Interest rate must be greater than 0"),
  processing_fee: requiredNonNegativeNumber(
    "Processing fee must be 0 or greater",
  ),
  insurance_fee: requiredNonNegativeNumber(
    "Insurance fee must be 0 or greater",
  ),
  show_in_app: z.boolean(),
})

export type CreateTenureFormInput = z.input<typeof createTenureSchema>
export type CreateTenureFormValues = z.output<typeof createTenureSchema>

export const createTenureFormDefaults: CreateTenureFormInput = {
  name: "",
  code: "",
  linked_products: [],
  description: "",
  tenure: undefined,
  tenure_type: "",
  repayment_frequency: "",
  interest_type: "",
  interest_rate: undefined,
  processing_fee: undefined,
  insurance_fee: undefined,
  show_in_app: false,
}
