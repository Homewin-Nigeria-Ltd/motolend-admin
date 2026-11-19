"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { recoveryKeys } from "@/features/recovery/api/keys"
import { recoveryMutations } from "@/features/recovery/api/mutations"
import type {
  SendRecoveryOtpInput,
  VerifyRecoveryOtpInput,
} from "@/features/recovery/types"
import { toast } from "@/lib/toast"

export function useSendRecoveryOtp() {
  const mutation = useMutation({
    ...recoveryMutations.sendOtp,
    onSuccess: (result) => {
      toast.success(
        result.message?.trim() ||
          `OTP sent${result.approval_email ? ` to ${result.approval_email}` : ""}`,
      )
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send recovery OTP",
      )
    },
  })

  return {
    sendOtp: (input: SendRecoveryOtpInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useVerifyRecoveryOtp() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...recoveryMutations.verify,
    onSuccess: () => {
      toast.success("Loan marked as Paid")
      void queryClient.invalidateQueries({ queryKey: recoveryKeys.all })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to verify recovery OTP",
      )
    },
  })

  return {
    verifyOtp: (input: VerifyRecoveryOtpInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
