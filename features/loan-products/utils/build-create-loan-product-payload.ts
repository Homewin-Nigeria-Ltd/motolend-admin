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
    code: values.code.trim(),
    category: values.category.trim(),
    eligibility_criteria: {
      age: `>= ${values.eligibility_criteria.age}`,
      location: values.eligibility_criteria.location.trim(),
      employment_status: values.eligibility_criteria.employment_status.trim(),
      credit_score: `>= ${values.eligibility_criteria.credit_score}`,
    },
    amount_increment: values.amount_increment,
    currency: values.currency.trim(),
    interest_rate: values.interest_rate,
    repayment_frequency: values.repayment_frequency.trim(),
    grace_period: values.grace_period.trim(),
    start_date_rules: values.start_date_rules.trim(),
    processing_fee: values.processing_fee,
    late_payment_fee: values.late_payment_fee,
    early_settlement_fee: values.early_settlement_fee,
    insurance_fee: values.insurance_fee,
    repayment_methods: values.repayment_methods,
    payment_allocation: values.payment_allocation.trim(),
    partial_payment_allowed: values.partial_payment_allowed.trim(),
    overpayment_handling: values.overpayment_handling.trim(),
    auto_debit_settings: values.auto_debit_settings.trim(),
    collateral_required: values.collateral_required,
    collateral_types: values.collateral_types,
    valuation_rules: values.valuation_rules.trim(),
    mandatory_documents: values.mandatory_documents,
    allowed_document_formats: values.allowed_document_formats,
    document_size_limit: values.document_size_limit,
    verification_method: values.verification_method.trim(),
    approval_workflow: {
      name: values.approval_workflow.name.trim(),
      steps: values.approval_workflow.steps,
    },
    notifications_integrations: values.notifications_integrations,
    tiers: values.tiers.map((tier) => ({
      min_amount: tier.min_amount,
      max_amount: tier.max_amount,
      interest_rate: tier.interest_rate,
    })),
  }
}
