import { api } from "@/lib/api/client"
import type {
  AssignUserRoleApiResponse,
  AssignUserRoleInput,
  CreateRoleApiResponse,
  CreateRoleInput,
  SyncRolePermissionsApiResponse,
  SyncRolePermissionsInput,
} from "@/features/role-permissions/types"
import { rolePermissionsEndpoints } from "@/features/role-permissions/api/endpoints"

export const rolePermissionsMutations = {
  createRole: {
    mutationFn: (input: CreateRoleInput) =>
      api.post<CreateRoleApiResponse, CreateRoleInput>(
        rolePermissionsEndpoints.roles,
        input,
      ),
  },
  syncRolePermissions: {
    mutationFn: ({
      roleId,
      input,
    }: {
      roleId: string
      input: SyncRolePermissionsInput
    }) =>
      api.put<SyncRolePermissionsApiResponse, SyncRolePermissionsInput>(
        rolePermissionsEndpoints.rolePermissions(roleId),
        input,
      ),
  },
  assignUserRole: {
    mutationFn: ({
      userId,
      input,
    }: {
      userId: string
      input: AssignUserRoleInput
    }) =>
      api.post<AssignUserRoleApiResponse, AssignUserRoleInput>(
        rolePermissionsEndpoints.assignUserRole(userId),
        input,
      ),
  },
} as const
