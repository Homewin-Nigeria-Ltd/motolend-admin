"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useRoles } from "@/features/role-permissions/hooks/use-roles"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateAdminUser } from "@/features/users/hooks/use-user-mutations"
import {
  createAdminUserFormDefaults,
  createAdminUserSchema,
  type CreateAdminUserFormValues,
} from "@/features/users/schemas/create-admin-user.schema"
import { getAssignableAdminRoles } from "@/features/users/utils/admin-roles"

type CreateAdminUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAdminUserDialog({
  open,
  onOpenChange,
}: CreateAdminUserDialogProps) {
  const { createAdminUser, isPending } = useCreateAdminUser()
  const {
    data: roles,
    isPending: isRolesPending,
    isError: isRolesError,
  } = useRoles()

  const roleOptions = getAssignableAdminRoles(roles ?? [])

  const form = useForm<CreateAdminUserFormValues>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: createAdminUserFormDefaults,
  })

  useEffect(() => {
    if (!open) {
      return
    }

    form.reset(createAdminUserFormDefaults)
  }, [open, form])

  const onSubmit = async (values: CreateAdminUserFormValues) => {
    const result = await createAdminUser(values)

    if (result.success) {
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <BaseModal
      title="Create Admin User"
      className="max-w-lg"
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          form.reset()
        }
        onOpenChange(next)
      }}
      asForm
      onSubmit={form.handleSubmit(onSubmit)}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || isRolesPending || roleOptions.length === 0}
          >
            {isPending ? "Creating…" : "Create User"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Controller
          name="full_name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-admin-full-name">Full Name</FieldLabel>
              <Input
                {...field}
                id="create-admin-full-name"
                placeholder="Ebiwari Ogan"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-admin-email">Email</FieldLabel>
              <Input
                {...field}
                id="create-admin-email"
                type="email"
                placeholder="ebiwariogan@gmail.com"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-admin-phone">Phone</FieldLabel>
              <Input
                {...field}
                id="create-admin-phone"
                placeholder="0802345678910"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Role</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isRolesPending || isRolesError || roleOptions.length === 0}
              >
                <SelectTrigger
                  className="h-11 w-full border-border bg-background"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue
                    placeholder={
                      isRolesPending
                        ? "Loading roles…"
                        : isRolesError
                          ? "Could not load roles"
                          : "Select role"
                    }
                  />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {roleOptions.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
      </div>
    </BaseModal>
  )
}
