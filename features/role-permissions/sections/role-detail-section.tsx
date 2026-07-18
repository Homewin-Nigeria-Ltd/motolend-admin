"use client"

import { useMemo, useState } from "react"

import { PermissionsSearchInput } from "@/features/role-permissions/components/permissions-search-input"
import { RoleDetailHeader } from "@/features/role-permissions/components/role-detail-header"
import { RolePermissionsList } from "@/features/role-permissions/components/role-permissions-list"
import { useRoleDetail } from "@/features/role-permissions/hooks/use-role-detail"
import type { PermissionCategory } from "@/features/role-permissions/types"
import { filterPermissionCatalog } from "@/features/role-permissions/utils/filter-permissions"
import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"

type RoleDetailSectionProps = {
  roleId: string
}

export function RoleDetailSection({ roleId }: RoleDetailSectionProps) {
  const { data: roleDetail, isPending, isError } = useRoleDetail(roleId)
  const [search, setSearch] = useState("")

  const permissions = useMemo(() => {
    if (!roleDetail) return {}

    return roleDetail.permissions.reduce<Record<string, boolean>>(
      (accumulator, permission) => {
        accumulator[permission.key] = permission.has_access
        return accumulator
      },
      {},
    )
  }, [roleDetail])

  const filteredCategories = useMemo(() => {
    if (!roleDetail) return []

    const categories: PermissionCategory[] = [
      {
        id: "permissions",
        label: "Permissions",
        permissions: roleDetail.permissions.map((permission) => ({
          id: permission.key,
          title: permission.name,
          description: permission.description,
        })),
      },
    ]

    return filterPermissionCatalog(categories, search)
  }, [roleDetail, search])

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !roleDetail) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          Role not found.
        </div>
      </div>
    )
  }

  const role = roleDetail.role

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4">
        <BackLink href="/settings/role-permissions" label="Roles & Permissions" />
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <div className="space-y-8">
          <PermissionsSearchInput value={search} onChange={setSearch} />

          <RoleDetailHeader name={role.name} description={role.description} />

          <RolePermissionsList
            categories={filteredCategories}
            permissions={permissions}
            readOnly
            showCategoryLabels={false}
          />
        </div>
      </div>
    </div>
  )
}
