import type { CreateTenureFormValues } from "@/features/tenures/schemas/create-tenure.schema"
import type { CreateLoanTenureInput } from "@/features/tenures/types"

export function buildCreateLoanTenurePayload(
  values: CreateTenureFormValues,
): CreateLoanTenureInput {
  return {
    name: values.name.trim(),
    code: values.code.trim(),
    description: values.description.trim(),
    loan_product_ids: values.loan_product_ids
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id)),
    tenure: values.tenure,
    tenure_type: values.tenure_type as CreateLoanTenureInput["tenure_type"],
    repayment_frequency:
      values.repayment_frequency as CreateLoanTenureInput["repayment_frequency"],
    interest_type: values.interest_type as CreateLoanTenureInput["interest_type"],
    interest_frequency:
      values.interest_frequency as CreateLoanTenureInput["interest_frequency"],
    interest_rate: values.interest_rate,
    processing_fee: values.processing_fee,
    insurance_fee: values.insurance_fee,
    is_active: values.show_in_app,
  }
}
