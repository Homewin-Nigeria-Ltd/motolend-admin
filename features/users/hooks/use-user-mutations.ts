"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { userKeys } from "@/features/users/api/keys"
import { userMutations } from "@/features/users/api/mutations"
import type {
  CreateAdminUserInput,
  UserAccountStatus,
} from "@/features/users/types"
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

export function useUpdateUserStatus(userId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...userMutations.updateStatus,
    onSuccess: () => {
      toast.success("User status updated")
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status",
      )
    },
  })

  return {
    updateStatus: (status: UserAccountStatus) =>
      mutation.mutate({ id: userId, status }),
    isPending: mutation.isPending,
  }
}
