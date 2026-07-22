import { z } from "zod/v3"

const tierSchema = z.object({
  min_amount: z.number().positive("Minimum amount must be greater than 0"),
  max_amount: z.number().positive("Maximum amount must be greater than 0"),
  interest_rate: z.number().nonnegative("Interest rate is required"),
})

export const createLoanProductSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().min(1, "Description is required"),
    min_amount: z.number().positive("Minimum amount must be greater than 0"),
    max_amount: z.number().positive("Maximum amount must be greater than 0"),
    interest_type: z.string().trim().min(1, "Interest type is required"),
    tenure: z.number().int().positive("Tenure must be greater than 0"),
    tenure_type: z.string().trim().min(1, "Tenure type is required"),
    credit_protection_fee: z
      .number()
      .nonnegative("Credit protection fee is required"),
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

export const createLoanProductFormDefaults: CreateLoanProductFormValues = {
  name: "",
  description: "",
  min_amount: 1000,
  max_amount: 5000000,
  interest_type: "flat",
  tenure: 15,
  tenure_type: "days",
  credit_protection_fee: 250,
  is_active: true,
  tiers: [
    {
      min_amount: 1000,
      max_amount: 5000000,
      interest_rate: 2,
    },
  ],
}

export const INTEREST_TYPE_OPTIONS = ["flat", "reducing"] as const
export const TENURE_TYPE_OPTIONS = ["days", "weeks", "months"] as const
