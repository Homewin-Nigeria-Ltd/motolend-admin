import { z } from "zod/v3"

export const updateLoanProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  is_active: z.boolean(),
})

export type UpdateLoanProductFormValues = z.infer<typeof updateLoanProductSchema>
