import { z } from "zod/v3"

export const createLoanProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  is_active: z.boolean(),
})

export type CreateLoanProductFormInput = z.input<typeof createLoanProductSchema>
export type CreateLoanProductFormValues = z.output<typeof createLoanProductSchema>

export const createLoanProductFormDefaults: CreateLoanProductFormInput = {
  name: "",
  description: "",
  is_active: true,
}
