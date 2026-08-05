import { z } from "zod/v3"

function emptyToUndefined(value: unknown) {
  if (value === "" || value === null || value === undefined) {
    return undefined
  }

  if (typeof value === "number" && Number.isNaN(value)) {
    return undefined
  }

  return value
}

function requiredNumber(message: string) {
  return z.preprocess(
    emptyToUndefined,
    z.number({
      invalid_type_error: message,
      required_error: message,
    }),
  )
}

function requiredPositiveNumber(message: string) {
  return requiredNumber(message).refine((value) => value > 0, message)
}

function requiredNonNegativeNumber(message: string) {
  return requiredNumber(message).refine((value) => value >= 0, message)
}

const tierSchema = z.object({
  min_amount: requiredPositiveNumber("Minimum amount must be greater than 0"),
  max_amount: requiredPositiveNumber("Maximum amount must be greater than 0"),
  interest_rate: requiredNonNegativeNumber("Interest rate is required"),
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

export type CreateLoanProductFormValues = z.infer<typeof createLoanProductSchema>
export type CreateLoanProductTierFormValues = z.infer<typeof tierSchema>

export function getTierAmountsBoundsError(
  values: Pick<CreateLoanProductFormValues, "min_amount" | "max_amount" | "tiers">,
): string | null {
  const { min_amount: loanMin, max_amount: loanMax, tiers } = values

  if (!Number.isFinite(loanMin) || !Number.isFinite(loanMax)) {
    return null
  }

  for (const tier of tiers) {
    if (!Number.isFinite(tier.min_amount) || !Number.isFinite(tier.max_amount)) {
      continue
    }

    if (
      tier.min_amount < loanMin ||
      tier.max_amount > loanMax ||
      tier.min_amount > loanMax ||
      tier.max_amount < loanMin
    ) {
      return "Tier amounts must stay within the loan minimum and maximum."
    }
  }

  return null
}

export const createLoanProductFormDefaults = {
  name: "",
  description: "",
  min_amount: undefined,
  max_amount: undefined,
  interest_type: "",
  tenure: undefined,
  tenure_type: "",
  credit_protection_fee: undefined,
  is_active: true,
  tiers: [
    {
      min_amount: undefined,
      max_amount: undefined,
      interest_rate: undefined,
    },
  ],
} as CreateLoanProductFormValues

export const INTEREST_TYPE_OPTIONS = ["flat", "reducing"] as const
export const TENURE_TYPE_OPTIONS = ["days", "weeks", "months"] as const
