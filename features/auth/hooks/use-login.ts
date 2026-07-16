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

      toast.success("Signed in successfully")
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      router.push("/dashboard")
      router.refresh()
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.")
    },
  })

  const login = useCallback(
    (data: LoginInput) => {
      mutation.mutate(data)
    },
    [mutation],
  )

  return {
    login,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
