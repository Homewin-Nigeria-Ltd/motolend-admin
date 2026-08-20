import type { CreateLoanProductFormValues } from "@/features/loan-products/schemas/create-loan-product.schema"
import type { CreateLoanProductInput } from "@/features/loan-products/types"

export function buildCreateLoanProductPayload(
  values: CreateLoanProductFormValues,
): CreateLoanProductInput {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    min_amount: values.min_amount,
    max_amount: values.max_amount,
    interest_type: values.interest_type.trim(),
    tenure: values.tenure,
    tenure_type: values.tenure_type.trim(),
    credit_protection_fee: values.credit_protection_fee,
    is_active: values.is_active,
    interest_rate: values.interest_rate,
    processing_fee: values.processing_fee,
    insurance_fee: values.insurance_fee,
  }
}
