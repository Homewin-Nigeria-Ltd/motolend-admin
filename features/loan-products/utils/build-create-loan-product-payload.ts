import type { CreateLoanProductFormValues } from "@/features/loan-products/schemas/create-loan-product.schema"
import type { CreateLoanProductInput } from "@/features/loan-products/types"

export function buildCreateLoanProductPayload(
  values: CreateLoanProductFormValues,
): CreateLoanProductInput {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    application_fee: values.application_fee,
    is_active: values.is_active,
  }
}
