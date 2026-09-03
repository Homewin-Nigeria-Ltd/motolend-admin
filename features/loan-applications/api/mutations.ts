import {
  approveApplicationAction,
  directDebitMandateAction,
  disburseApplicationAction,
  markDisbursedAction,
  rejectApplicationAction,
} from "@/features/loan-applications/actions/application.actions"
import { loanApplicationEndpoints } from "@/features/loan-applications/api/endpoints"
import type {
  DisburseApplicationInput,
  EligibilityReviewDecisionInput,
  RejectApplicationInput,
} from "@/features/loan-applications/types"
import { api } from "@/lib/api/client"

async function submitEligibilityReviewDecision(
  input: EligibilityReviewDecisionInput,
) {
  return api.post<
    { status?: string; message?: string; success?: boolean },
    Pick<EligibilityReviewDecisionInput, "decision" | "notes">
  >(loanApplicationEndpoints.eligibilityReviewDecision(input.userId), {
    decision: input.decision,
    notes: input.notes,
  })
}

export const loanApplicationMutations = {
  approve: {
    mutationFn: (applicationId: string) =>
      approveApplicationAction(applicationId),
  },
  reject: {
    mutationFn: (input: RejectApplicationInput) =>
      rejectApplicationAction(input),
  },
  disburse: {
    mutationFn: (input: DisburseApplicationInput) =>
      disburseApplicationAction(input),
  },
  directDebitMandate: {
    mutationFn: (applicationId: string) =>
      directDebitMandateAction(applicationId),
  },
  markDisbursed: {
    mutationFn: (input: DisburseApplicationInput) =>
      markDisbursedAction(input),
  },
  eligibilityReviewDecision: {
    mutationFn: submitEligibilityReviewDecision,
  },
} as const
