"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { rolePermissionsMutations } from "@/features/role-permissions/api/mutations"
import { rolePermissionsKeys } from "@/features/role-permissions/api/keys"
import type { SyncRolePermissionsPayload } from "@/features/role-permissions/types"
import { buildSyncRolePermissionsInput } from "@/features/role-permissions/utils/build-role-payload"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useSyncRolePermissions() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: SyncRolePermissionsPayload) =>
      rolePermissionsMutations.syncRolePermissions.mutationFn({
        roleId: payload.roleId,
        input: buildSyncRolePermissionsInput(payload.permissions),
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: rolePermissionsKeys.all })
      const message =
        response && typeof response === "object" && "message" in response
          ? String(response.message)
          : "Role permissions updated successfully"
      toast.success(message)
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update role permissions. Please try again."
      toast.error(message)
    },
  })

  return {
    syncRolePermissions: (payload: SyncRolePermissionsPayload) =>
      mutation.mutateAsync(payload),
    isPending: mutation.isPending,
  }
}
