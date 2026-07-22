import { z } from "zod/v3"

export const PAYMENT_METHOD_OPTIONS = [
  "cash",
  "bank_transfer",
  "mobile_money",
  "direct_debit",
] as const

export const recordRepaymentSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  payment_method: z.string().trim().min(1, "Payment method is required"),
})

export type RecordRepaymentFormValues = z.infer<typeof recordRepaymentSchema>

export const recordRepaymentFormDefaults: Partial<RecordRepaymentFormValues> = {
  payment_method: "cash",
}
