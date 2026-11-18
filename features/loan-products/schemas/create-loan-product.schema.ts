import { z } from "zod/v3"

const applicationFeeSchema = z
  .union([z.number(), z.nan(), z.undefined()])
  .refine(
    (value): value is number => Number.isFinite(value),
    "Application fee is required",
  )
  .refine((value) => value >= 0, "Application fee must be 0 or greater")

export const createLoanProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  application_fee: applicationFeeSchema,
  is_active: z.boolean(),
})

export type CreateLoanProductFormInput = z.input<typeof createLoanProductSchema>
export type CreateLoanProductFormValues = z.output<typeof createLoanProductSchema>

export const createLoanProductFormDefaults: CreateLoanProductFormInput = {
  name: "",
  description: "",
  application_fee: 0,
  is_active: true,
}
