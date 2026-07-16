"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { userKeys } from "@/features/users/api/keys"
import { userMutations } from "@/features/users/api/mutations"
import type { CreateAdminUserInput } from "@/features/users/types"
import { toast } from "@/lib/toast"

export function useCreateAdminUser() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...userMutations.createAdmin,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Admin user created successfully")
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    onError: () => {
      toast.error("Failed to create admin user")
    },
  })

  return {
    createAdminUser: (input: CreateAdminUserInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
