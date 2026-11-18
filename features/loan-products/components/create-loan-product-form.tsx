"use client"

import type { UseFormReturn } from "react-hook-form"
import { Controller } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type {
  CreateLoanProductFormInput,
  CreateLoanProductFormValues,
} from "@/features/loan-products/schemas/create-loan-product.schema"

type CreateLoanProductFormProps = {
  form: UseFormReturn<
    CreateLoanProductFormInput,
    unknown,
    CreateLoanProductFormValues
  >
  disabled?: boolean
}

export function CreateLoanProductForm({
  form,
  disabled = false,
}: CreateLoanProductFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field className="sm:col-span-2">
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" {...form.register("name")} disabled={disabled} />
        <FieldError errors={[form.formState.errors.name]} />
      </Field>

      <Field className="sm:col-span-2">
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          rows={3}
          {...form.register("description")}
          disabled={disabled}
        />
        <FieldError errors={[form.formState.errors.description]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="application-fee">Application Fee</FieldLabel>
        <Input
          id="application-fee"
          type="number"
          step="0.01"
          min={0}
          placeholder="0"
          disabled={disabled}
          {...form.register("application_fee", { valueAsNumber: true })}
        />
        <FieldError errors={[form.formState.errors.application_fee]} />
      </Field>

      <Controller
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 sm:col-span-2">
            <span className="text-sm font-medium text-foreground">Active</span>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </div>
        )}
      />
    </div>
  )
}
