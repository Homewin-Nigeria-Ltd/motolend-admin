"use client"

import type { FieldPath, UseFormReturn } from "react-hook-form"
import { Controller } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  INTEREST_TYPE_OPTIONS,
  TENURE_TYPE_OPTIONS,
  type CreateLoanProductFormInput,
  type CreateLoanProductFormValues,
} from "@/features/loan-products/schemas/create-loan-product.schema"

type CreateLoanProductFormProps = {
  form: UseFormReturn<
    CreateLoanProductFormInput,
    unknown,
    CreateLoanProductFormValues
  >
  disabled?: boolean
}

type FormInstance = CreateLoanProductFormProps["form"]

function TextField({
  form,
  name,
  label,
  disabled,
}: {
  form: FormInstance
  name: FieldPath<CreateLoanProductFormInput>
  label: string
  disabled?: boolean
}) {
  const error = form.formState.errors

  return (
    <Field>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
      <Input id={String(name)} {...form.register(name)} disabled={disabled} />
      <FieldError errors={[error[name as keyof typeof error]]} />
    </Field>
  )
}

function NumberField({
  form,
  name,
  label,
  disabled,
  step,
}: {
  form: FormInstance
  name: FieldPath<CreateLoanProductFormInput>
  label: string
  disabled?: boolean
  step?: string
}) {
  const error = form.formState.errors

  return (
    <Field>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
      <Input
        id={String(name)}
        type="number"
        step={step}
        {...form.register(name, { valueAsNumber: true })}
        disabled={disabled}
      />
      <FieldError errors={[error[name as keyof typeof error]]} />
    </Field>
  )
}

function SelectField({
  form,
  name,
  label,
  options,
  disabled,
}: {
  form: FormInstance
  name: FieldPath<CreateLoanProductFormInput>
  label: string
  options: readonly string[]
  disabled?: boolean
}) {
  const error = form.formState.errors

  return (
    <Field>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Select
            value={
              typeof field.value === "string" ? field.value || undefined : undefined
            }
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger id={String(name)} className="h-10 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FieldError errors={[error[name as keyof typeof error]]} />
    </Field>
  )
}

export function CreateLoanProductForm({
  form,
  disabled = false,
}: CreateLoanProductFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField form={form} name="name" label="Name" disabled={disabled} />
      <SelectField
        form={form}
        name="interest_type"
        label="Interest Type"
        options={INTEREST_TYPE_OPTIONS}
        disabled={disabled}
      />

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

      <NumberField
        form={form}
        name="min_amount"
        label="Minimum Amount"
        disabled={disabled}
      />
      <NumberField
        form={form}
        name="max_amount"
        label="Maximum Amount"
        disabled={disabled}
      />
      <NumberField form={form} name="tenure" label="Tenure" disabled={disabled} />
      <SelectField
        form={form}
        name="tenure_type"
        label="Tenure Type"
        options={TENURE_TYPE_OPTIONS}
        disabled={disabled}
      />
      <NumberField
        form={form}
        name="interest_rate"
        label="Interest Rate (%)"
        step="0.01"
        disabled={disabled}
      />
      <NumberField
        form={form}
        name="credit_protection_fee"
        label="Credit Protection Fee"
        disabled={disabled}
      />
      <NumberField
        form={form}
        name="processing_fee"
        label="Processing Fee"
        disabled={disabled}
      />
      <NumberField
        form={form}
        name="insurance_fee"
        label="Insurance Fee"
        disabled={disabled}
      />

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
