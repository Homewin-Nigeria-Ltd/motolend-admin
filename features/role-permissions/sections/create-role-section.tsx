"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { RoleForm } from "@/features/role-permissions/components/role-form"
import { useCreateRole } from "@/features/role-permissions/hooks/use-create-role"
import { usePermissionCatalog } from "@/features/role-permissions/hooks/use-permission-catalog"
import {
  roleFormSchema,
  type RoleFormSchemaValues,
} from "@/features/role-permissions/schemas/role-form.schema"
import type { PermissionCategory } from "@/features/role-permissions/types"
import {
  buildDefaultPermissions,
} from "@/features/role-permissions/utils/build-role-payload"
import { filterPermissionCatalog } from "@/features/role-permissions/utils/filter-permissions"
import {
  formatPermissionLabel,
  getPermissionKey,
} from "@/features/role-permissions/utils/role"
import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"

export function CreateRoleSection() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const {
    data: catalog,
    isPending,
    isError,
  } = usePermissionCatalog()
  const { createRole, isPending: isCreating } = useCreateRole()

  const form = useForm<RoleFormSchemaValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: {},
    },
  })

  useEffect(() => {
    if (!catalog) return

    form.reset({
      name: "",
      description: "",
      permissions: buildDefaultPermissions(catalog),
    })
  }, [catalog, form])

  const filteredCategories = useMemo(() => {
    if (!catalog) return []

    const categories: PermissionCategory[] = [
      {
        id: "permissions",
        label: "Permissions",
        permissions: catalog.map((permission) => ({
          id: getPermissionKey(permission),
          title: formatPermissionLabel(permission.name),
          description: formatPermissionLabel(permission.name),
        })),
      },
    ]

    return filterPermissionCatalog(categories, search)
  }, [catalog, search])

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !catalog) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          Could not load permissions.
        </div>
      </div>
    )
  }

  async function onSubmit(values: RoleFormSchemaValues) {
    await createRole({
      ...values,
      userIds: [],
    })
    router.push("/settings/role-permissions")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4">
        <BackLink href="/settings/role-permissions" label="Roles & Permissions" />
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <RoleForm
          form={form}
          filteredCategories={filteredCategories}
          search={search}
          onSearchChange={setSearch}
          onSubmit={onSubmit}
          isSubmitting={isCreating}
        />
      </div>
    </div>
  )
}
