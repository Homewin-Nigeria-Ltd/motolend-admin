"use client"

import type { UseFormReturn } from "react-hook-form"
import { Controller } from "react-hook-form"

import { PermissionsSearchInput } from "@/features/role-permissions/components/permissions-search-input"
import { RolePermissionsList } from "@/features/role-permissions/components/role-permissions-list"
import type { PermissionCategory } from "@/features/role-permissions/types"
import type { RoleFormSchemaValues } from "@/features/role-permissions/schemas/role-form.schema"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type RoleFormProps = {
  form: UseFormReturn<RoleFormSchemaValues>
  filteredCategories: PermissionCategory[]
  search: string
  onSearchChange: (value: string) => void
  onSubmit: (values: RoleFormSchemaValues) => void | Promise<void>
  isSubmitting: boolean
  submitLabel?: string
  metadataReadOnly?: boolean
}

export function RoleForm({
  form,
  filteredCategories,
  search,
  onSearchChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Save and Publish",
  metadataReadOnly = false,
}: RoleFormProps) {
  return (
    <form
      id="role-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <PermissionsSearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search for anything under control and permission"
      />

      <FieldGroup className="gap-5">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="role-name">Role name</FieldLabel>
              <Input
                {...field}
                id="role-name"
                placeholder="Enter role name"
                aria-invalid={fieldState.invalid}
                icon={{ name: "group", position: "left" }}
                className="h-11"
                disabled={isSubmitting || metadataReadOnly}
                readOnly={metadataReadOnly}
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="role-description">Description</FieldLabel>
              <Textarea
                {...field}
                id="role-description"
                placeholder="Enter a description"
                rows={4}
                aria-invalid={fieldState.invalid}
                className="resize-none rounded-sm border-border bg-transparent"
                disabled={isSubmitting || metadataReadOnly}
                readOnly={metadataReadOnly}
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
      </FieldGroup>

      <RolePermissionsList
        categories={filteredCategories}
        control={form.control}
        showCategoryLabels={false}
      />

      <div className="flex justify-end">
        <Button type="submit" className="h-11 px-6" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
