"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { rolePermissionsMutations } from "@/features/role-permissions/api/mutations"
import { rolePermissionsKeys } from "@/features/role-permissions/api/keys"
import type { CreateRolePayload } from "@/features/role-permissions/types"
import { buildCreateRoleInput } from "@/features/role-permissions/utils/build-role-payload"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useCreateRole() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreateRolePayload) =>
      rolePermissionsMutations.createRole.mutationFn(
        buildCreateRoleInput(payload),
      ),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: rolePermissionsKeys.all })
      const message =
        response && typeof response === "object" && "message" in response
          ? String(response.message)
          : "Role created successfully"
      toast.success(message)
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to create role. Please try again."
      toast.error(message)
    },
  })

  return {
    createRole: (payload: CreateRolePayload) => mutation.mutateAsync(payload),
    isPending: mutation.isPending,
  }
}
