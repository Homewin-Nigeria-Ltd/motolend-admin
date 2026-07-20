import {
  approveApplicationAction,
  directDebitMandateAction,
  disburseApplicationAction,
  markDisbursedAction,
  rejectApplicationAction,
} from "@/features/loan-applications/actions/application.actions"
import type {
  DisburseApplicationInput,
  RejectApplicationInput,
} from "@/features/loan-applications/types"

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
} as const
