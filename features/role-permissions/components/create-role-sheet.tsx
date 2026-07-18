"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { AddRoleUsersDialog } from "@/features/role-permissions/components/add-role-users-dialog"
import { useCreateRole } from "@/features/role-permissions/hooks/use-create-role"
import { usePermissionCatalog } from "@/features/role-permissions/hooks/use-permission-catalog"
import {
  roleFormSchema,
  type RoleFormSchemaValues,
} from "@/features/role-permissions/schemas/role-form.schema"
import { buildDefaultPermissions } from "@/features/role-permissions/utils/build-role-payload"
import {
  formatPermissionLabel,
  getPermissionKey,
} from "@/features/role-permissions/utils/role"
import type { UserRecord } from "@/features/users/types"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SlideInModal } from "@/components/ui/slide-in-modal"
import { Textarea } from "@/components/ui/textarea"

type CreateRoleSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultFormValues: RoleFormSchemaValues = {
  name: "",
  description: "",
  permissions: {},
}

export function CreateRoleSheet({ open, onOpenChange }: CreateRoleSheetProps) {
  const [selectedUsers, setSelectedUsers] = useState<UserRecord[]>([])
  const [addUserOpen, setAddUserOpen] = useState(false)

  const {
    data: catalog,
    isPending: isCatalogPending,
    isError: isCatalogError,
  } = usePermissionCatalog()
  const { createRole, isPending: isCreating } = useCreateRole()

  const form = useForm<RoleFormSchemaValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: defaultFormValues,
  })

  const formResetKey =
    open && catalog
      ? `open:${catalog.map((permission) => permission.id).join(",")}`
      : ""

  const [formResetSeed, setFormResetSeed] = useState("")

  if (formResetKey && formResetKey !== formResetSeed) {
    setFormResetSeed(formResetKey)
    form.reset({
      ...defaultFormValues,
      permissions: buildDefaultPermissions(catalog!),
    })
    setSelectedUsers([])
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setFormResetSeed("")
      form.reset(defaultFormValues)
      setSelectedUsers([])
      setAddUserOpen(false)
    }

    onOpenChange(next)
  }

  const handleAddUsersConfirm = (users: UserRecord[]) => {
    setSelectedUsers(users)
    setAddUserOpen(false)
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((current) =>
      current.filter((user) => user.id !== userId),
    )
  }

  const onSubmit = async (values: RoleFormSchemaValues) => {
    try {
      await createRole({
        ...values,
        userIds: selectedUsers.map((user) => user.id),
      })
      form.reset(defaultFormValues)
      setSelectedUsers([])
      onOpenChange(false)
    } catch {
      // Error toast is handled in the mutation hook.
    }
  }

  const canSubmit = Boolean(catalog) && !isCatalogError

  return (
    <>
    <SlideInModal
      title="Role Information"
      open={open}
      onOpenChange={handleOpenChange}
      asForm={canSubmit}
      onSubmit={form.handleSubmit(onSubmit)}
      footer={
        canSubmit ? (
          <Button type="submit" className="h-11 rounded px-6" disabled={isCreating}>
            {isCreating ? "Submitting…" : "Submit"}
          </Button>
        ) : null
      }
    >
      {isCatalogPending ? (
        <div className="flex items-center justify-center py-12">
          <AppLoader spinnerClassName="size-8" />
        </div>
      ) : isCatalogError || !catalog ? (
        <p className="text-sm text-destructive">Could not load permissions.</p>
      ) : (
        <div className="space-y-6">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-role-name">Role Name</FieldLabel>
                <Input
                  {...field}
                  id="create-role-name"
                  placeholder="Enter role name"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                  disabled={isCreating}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-role-description">
                  Description
                </FieldLabel>
                <Textarea
                  {...field}
                  id="create-role-description"
                  rows={4}
                  placeholder="Enter a description"
                  className="resize-none rounded-sm border-border bg-transparent"
                  aria-invalid={fieldState.invalid}
                  disabled={isCreating}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <div className="space-y-4">
            <FieldLabel>Permission</FieldLabel>
            <div className="space-y-4">
              {catalog.map((permission) => (
                <Controller
                  key={getPermissionKey(permission)}
                  name={`permissions.${getPermissionKey(permission)}`}
                  control={form.control}
                  render={({ field }) => (
                    <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                      <Checkbox
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                        disabled={isCreating}
                        aria-label={formatPermissionLabel(permission.name)}
                      />
                      <span>{formatPermissionLabel(permission.name)}</span>
                    </label>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <FieldLabel className="mb-0">Users</FieldLabel>
              <Button
                type="button"
                className="h-9 rounded px-3"
                icon={{ name: "add", position: "left" }}
                disabled={isCreating}
                onClick={() => setAddUserOpen(true)}
              >
                Add User
              </Button>
            </div>

            {selectedUsers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm"
                  >
                    <span>{user.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user.id)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${user.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </SlideInModal>

    <AddRoleUsersDialog
      open={addUserOpen}
      onOpenChange={setAddUserOpen}
      selectedUsers={selectedUsers}
      onConfirm={handleAddUsersConfirm}
    />
  </>
  )
}
