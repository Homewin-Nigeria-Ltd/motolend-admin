"use client"

import { useState } from "react"

import { CreateRoleSheet } from "@/features/role-permissions/components/create-role-sheet"
import { PermissionsListToolbar } from "@/features/role-permissions/components/permissions-list-toolbar"
import { RoleCard } from "@/features/role-permissions/components/role-card"
import { ViewRolePermissionsSheet } from "@/features/role-permissions/components/view-role-permissions-sheet"
import { useRoles } from "@/features/role-permissions/hooks/use-roles"
import type { ApiRole } from "@/features/role-permissions/types"
import { getRoleId } from "@/features/role-permissions/utils/role"
import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"

export function PermissionsListSection() {
  const [createRoleOpen, setCreateRoleOpen] = useState(false)
  const [viewPermissionsOpen, setViewPermissionsOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const { data: roles, isPending, isError } = useRoles()

  const handleViewPermissions = (role: ApiRole) => {
    setSelectedRoleId(getRoleId(role))
    setViewPermissionsOpen(true)
  }

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          Could not load roles.
        </div>
      </div>
    )
  }

  const roleList = roles ?? []

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4">
        <BackLink href="/settings" label="Settings" />
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <div className="space-y-6">
          <PermissionsListToolbar onCreateClick={() => setCreateRoleOpen(true)} />

          {roleList.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No roles have been created yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {roleList.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onViewPermissions={handleViewPermissions}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateRoleSheet open={createRoleOpen} onOpenChange={setCreateRoleOpen} />
      <ViewRolePermissionsSheet
        roleId={selectedRoleId}
        open={viewPermissionsOpen}
        onOpenChange={setViewPermissionsOpen}
      />
    </div>
  )
}
