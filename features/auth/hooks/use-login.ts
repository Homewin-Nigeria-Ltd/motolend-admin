"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { authKeys } from "@/features/auth/api/keys"
import { authMutations } from "@/features/auth/api/mutations"
import type { LoginInput } from "@/features/auth/schemas/login.schema"
import { toast } from "@/lib/toast"

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...authMutations.login,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.otpRequired) {
        toast.success("Enter the verification code")
        return
      }

      toast.success("Signed in successfully")
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      router.push("/dashboard")
      router.refresh()
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.")
    },
  })

  const resendMutation = useMutation({
    ...authMutations.resendOtp,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("A new verification code has been sent")
    },
    onError: () => {
      toast.error("Could not resend the code. Please try again.")
    },
  })

  const login = useCallback(
    (data: LoginInput) => mutation.mutateAsync(data),
    [mutation],
  )

  const resendOtp = useCallback(
    (input: { login: string; password: string }) =>
      resendMutation.mutateAsync(input),
    [resendMutation],
  )

  return {
    login,
    resendOtp,
    isPending: mutation.isPending,
    isResending: resendMutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
