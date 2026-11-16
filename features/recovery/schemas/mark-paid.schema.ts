import { z } from "zod/v3"

export const RECOVERY_METHOD_OPTIONS = [
  "bank_transfer",
  "cash",
  "pos",
  "other",
] as const

export const markPaidSchema = z.object({
  recovery_method: z.enum(RECOVERY_METHOD_OPTIONS, {
    required_error: "Recovery method is required",
    invalid_type_error: "Recovery method is required",
  }),
  amount_recovered: z.string().min(1, "Amount recovered is required"),
  payment_reference: z.string().min(1, "Payment reference is required"),
})

export type MarkPaidFormValues = z.infer<typeof markPaidSchema>

export const markPaidFormDefaults: MarkPaidFormValues = {
  recovery_method: "bank_transfer",
  amount_recovered: "",
  payment_reference: "",
}
