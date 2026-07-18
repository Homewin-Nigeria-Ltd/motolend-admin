"use client"

import { useState } from "react"

import type { RoleDetail } from "@/features/role-permissions/types"
import { RoleDetailHeader } from "@/features/role-permissions/components/role-detail-header"
import { useRoleDetail } from "@/features/role-permissions/hooks/use-role-detail"
import { useSyncRolePermissions } from "@/features/role-permissions/hooks/use-sync-role-permissions"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldLabel } from "@/components/ui/field"
import { SlideInModal } from "@/components/ui/slide-in-modal"

type ViewRolePermissionsSheetProps = {
  roleId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function permissionsFromRoleDetail(roleDetail: RoleDetail) {
  return roleDetail.permissions.reduce<Record<string, boolean>>(
    (accumulator, permission) => {
      accumulator[permission.key] = permission.has_access
      return accumulator
    },
    {},
  )
}

export function ViewRolePermissionsSheet({
  roleId,
  open,
  onOpenChange,
}: ViewRolePermissionsSheetProps) {
  const { data: roleDetail, isPending, isError } = useRoleDetail(roleId ?? "")
  const { syncRolePermissions, isPending: isSaving } = useSyncRolePermissions()

  const permissionsKey =
    open && roleId && roleDetail
      ? `${roleId}:${roleDetail.permissions
          .map((permission) => `${permission.key}:${Number(permission.has_access)}`)
          .join("|")}`
      : ""

  const [permissions, setPermissions] = useState<Record<string, boolean>>({})
  const [permissionsSeed, setPermissionsSeed] = useState("")

  if (permissionsKey && permissionsKey !== permissionsSeed) {
    setPermissionsSeed(permissionsKey)
    setPermissions(permissionsFromRoleDetail(roleDetail!))
  }

  const handlePermissionChange = (permissionId: string, enabled: boolean) => {
    setPermissions((current) => ({
      ...current,
      [permissionId]: enabled,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!roleId) return

    try {
      await syncRolePermissions({
        roleId,
        permissions,
      })
      setPermissionsSeed("")
      onOpenChange(false)
    } catch {
      // Error toast is handled in the mutation hook.
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setPermissionsSeed("")
    }

    onOpenChange(next)
  }

  return (
    <SlideInModal
      title="Role Permissions"
      open={open}
      onOpenChange={handleOpenChange}
      asForm={Boolean(roleDetail) && !isPending && !isError}
      onSubmit={handleSubmit}
      footer={
        roleDetail && !isPending && !isError ? (
          <Button type="submit" className="h-11 rounded px-6" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        ) : null
      }
    >
      {!roleId ? null : isPending ? (
        <div className="flex items-center justify-center py-12">
          <AppLoader spinnerClassName="size-8" />
        </div>
      ) : isError || !roleDetail ? (
        <p className="text-sm text-destructive">Role not found.</p>
      ) : (
        <div className="space-y-6">
          <RoleDetailHeader
            name={roleDetail.role.name}
            description={roleDetail.role.description}
          />

          <div className="space-y-4">
            <FieldLabel>Permissions</FieldLabel>
            <div className="space-y-4">
              {roleDetail.permissions.map((permission) => (
                <label
                  key={permission.key}
                  className="flex items-center gap-3 text-sm font-medium text-foreground"
                >
                  <Checkbox
                    checked={Boolean(permissions[permission.key])}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission.key, checked === true)
                    }
                    disabled={isSaving}
                    aria-label={permission.name}
                  />
                  <span>{permission.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </SlideInModal>
  )
}
