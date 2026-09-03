import { z } from "zod/v3"

export const ELIGIBILITY_REVIEW_DECISION_OPTIONS = [
  "approve_10000",
  "approve_20000",
  "decline",
] as const

export const eligibilityReviewDecisionSchema = z.object({
  decision: z.enum(ELIGIBILITY_REVIEW_DECISION_OPTIONS, {
    required_error: "Select a decision",
    invalid_type_error: "Select a decision",
  }),
  notes: z.string().trim().min(1, "Reviewer notes are required"),
})

export type EligibilityReviewDecisionFormInput = z.input<
  typeof eligibilityReviewDecisionSchema
>

export type EligibilityReviewDecisionFormValues = z.output<
  typeof eligibilityReviewDecisionSchema
>

export const eligibilityReviewDecisionDefaults: Partial<EligibilityReviewDecisionFormInput> =
  {
    notes: "",
  }

export const eligibilityReviewDecisionLabels: Record<
  (typeof ELIGIBILITY_REVIEW_DECISION_OPTIONS)[number],
  string
> = {
  approve_10000: "Approve ₦10,000",
  approve_20000: "Approve ₦20,000",
  decline: "Decline",
}
