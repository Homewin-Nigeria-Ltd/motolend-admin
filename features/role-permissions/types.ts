export type PermissionItem = {
  id: string
  title: string
  description: string
}

export type PermissionCategory = {
  id: string
  label: string
  permissions: PermissionItem[]
}

export type ApiPermission = {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

export type ApiRolePermission = {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
  pivot?: {
    role_id: number
    permission_id: number
  }
}

export type ApiRole = {
  id: number
  name: string
  guard_name?: string
  created_at?: string
  updated_at?: string
  description: string
  users_count?: number
  permissions?: ApiRolePermission[]
}

export type RolesApiResponse =
  | ApiRole[]
  | {
      success?: boolean
      data: ApiRole[]
      message?: string
    }

export type PermissionsApiResponse =
  | ApiPermission[]
  | {
      success?: boolean
      data: ApiPermission[]
      message?: string
    }

export type CreateRoleInput = {
  name: string
  description: string
  permissions: string[]
  users: string[]
}

export type CreateRoleApiResponse =
  | ApiRole
  | {
      success?: boolean
      data?: ApiRole
      message?: string
    }

export type SyncRolePermissionsInput = {
  permissions: string[]
}

export type SyncRolePermissionsApiResponse = {
  success?: boolean
  message?: string
}

export type AssignUserRoleInput = {
  role_id: string | number
}

export type AssignUserRoleApiResponse = {
  success?: boolean
  message?: string
}

export type RoleDetailRole = {
  id: number
  name: string
  description: string
}

export type RoleDetailPermission = {
  key: string
  name: string
  description: string
  has_access: boolean
}

export type RoleDetail = {
  role: RoleDetailRole
  permissions: RoleDetailPermission[]
}

export type RoleFormValues = {
  name: string
  description: string
  permissions: Record<string, boolean>
}

export type CreateRolePayload = RoleFormValues & {
  userIds: string[]
}

export type SyncRolePermissionsPayload = {
  roleId: string
  permissions: Record<string, boolean>
}
