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

function requiredPositiveNumber(message: string) {
  return z
    .preprocess(
      emptyToUndefined,
      z.number({
        invalid_type_error: message,
        required_error: message,
      }),
    )
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

export type RecordRepaymentFormValues = z.infer<typeof recordRepaymentSchema>

export const recordRepaymentFormDefaults: Partial<RecordRepaymentFormValues> = {
  payment_method: "cash",
}
