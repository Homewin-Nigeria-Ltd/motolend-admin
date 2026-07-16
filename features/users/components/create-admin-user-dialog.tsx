"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

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
  adminRoleOptions,
  createAdminUserFormDefaults,
  createAdminUserSchema,
  type CreateAdminUserFormValues,
} from "@/features/users/schemas/create-admin-user.schema"

type CreateAdminUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAdminUserDialog({
  open,
  onOpenChange,
}: CreateAdminUserDialogProps) {
  const { createAdminUser, isPending } = useCreateAdminUser()

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
          <Button type="submit" disabled={isPending}>
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
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="h-11 w-full border-border bg-background"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {adminRoleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
