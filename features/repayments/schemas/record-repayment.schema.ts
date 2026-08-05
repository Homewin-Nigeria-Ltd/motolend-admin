import { z } from "zod/v3"

function requiredPositiveNumber(message: string) {
  return z
    .union([z.number(), z.nan(), z.undefined()])
    .refine((value): value is number => Number.isFinite(value), message)
    .refine((value) => value > 0, message)
}

export const PAYMENT_METHOD_OPTIONS = [
  "cash",
  "bank_transfer",
  "ussd",
  "card",
] as const

export const recordRepaymentSchema = z.object({
  amount: requiredPositiveNumber("Amount must be greater than 0"),
  payment_method: z.enum(PAYMENT_METHOD_OPTIONS, {
    required_error: "Payment method is required",
    invalid_type_error: "Payment method is required",
  }),
})

export type RecordRepaymentFormInput = z.input<typeof recordRepaymentSchema>
export type RecordRepaymentFormValues = z.output<typeof recordRepaymentSchema>

export const recordRepaymentFormDefaults: Partial<RecordRepaymentFormInput> = {
  payment_method: "cash",
}
