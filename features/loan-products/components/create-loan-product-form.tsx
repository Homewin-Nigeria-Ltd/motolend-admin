"use client"

import type { UseFormReturn } from "react-hook-form"
import { Controller, useFieldArray } from "react-hook-form"

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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  INTEREST_TYPE_OPTIONS,
  TENURE_TYPE_OPTIONS,
  type CreateLoanProductFormValues,
} from "@/features/loan-products/schemas/create-loan-product.schema"

type CreateLoanProductFormProps = {
  form: UseFormReturn<CreateLoanProductFormValues>
  disabled?: boolean
}

function NumberField({
  form,
  name,
  label,
  disabled,
}: {
  form: UseFormReturn<CreateLoanProductFormValues>
  name:
    | "min_amount"
    | "max_amount"
    | "tenure"
    | "credit_protection_fee"
  label: string
  disabled?: boolean
}) {
  const error = form.formState.errors[name]

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        type="number"
        {...form.register(name, { valueAsNumber: true })}
        disabled={disabled}
      />
      <FieldError errors={[error]} />
    </Field>
  )
}

export function CreateLoanProductForm({
  form,
  disabled = false,
}: CreateLoanProductFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tiers",
  })

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-4 sm:grid-cols-2">
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

        <Field>
          <FieldLabel htmlFor="interest_type">Interest Type</FieldLabel>
          <Controller
            control={form.control}
            name="interest_type"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger id="interest_type" className="h-10">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {INTEREST_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[form.formState.errors.interest_type]} />
        </Field>

        <NumberField
          form={form}
          name="credit_protection_fee"
          label="Credit Protection Fee"
          disabled={disabled}
        />

        <NumberField form={form} name="tenure" label="Tenure" disabled={disabled} />

        <Field>
          <FieldLabel htmlFor="tenure_type">Tenure Type</FieldLabel>
          <Controller
            control={form.control}
            name="tenure_type"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger id="tenure_type" className="h-10">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TENURE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[form.formState.errors.tenure_type]} />
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
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Tiers</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Define amount ranges and interest rates for this product.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4"
            icon={{ name: "add", position: "left" }}
            disabled={disabled}
            onClick={() =>
              append({
                min_amount: form.getValues("min_amount"),
                max_amount: form.getValues("max_amount"),
                interest_rate: 0,
              })
            }
          >
            Add Tier
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-xl border border-border p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-foreground">
                  Tier {index + 1}
                </p>
                {fields.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-2 text-destructive hover:text-destructive"
                    disabled={disabled}
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor={`tiers.${index}.min_amount`}>
                    Minimum Amount
                  </FieldLabel>
                  <Input
                    id={`tiers.${index}.min_amount`}
                    type="number"
                    {...form.register(`tiers.${index}.min_amount`, {
                      valueAsNumber: true,
                    })}
                    disabled={disabled}
                  />
                  <FieldError
                    errors={[form.formState.errors.tiers?.[index]?.min_amount]}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor={`tiers.${index}.max_amount`}>
                    Maximum Amount
                  </FieldLabel>
                  <Input
                    id={`tiers.${index}.max_amount`}
                    type="number"
                    {...form.register(`tiers.${index}.max_amount`, {
                      valueAsNumber: true,
                    })}
                    disabled={disabled}
                  />
                  <FieldError
                    errors={[form.formState.errors.tiers?.[index]?.max_amount]}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor={`tiers.${index}.interest_rate`}>
                    Interest Rate (%)
                  </FieldLabel>
                  <Input
                    id={`tiers.${index}.interest_rate`}
                    type="number"
                    step="0.01"
                    {...form.register(`tiers.${index}.interest_rate`, {
                      valueAsNumber: true,
                    })}
                    disabled={disabled}
                  />
                  <FieldError
                    errors={[form.formState.errors.tiers?.[index]?.interest_rate]}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>

        <FieldError errors={[form.formState.errors.tiers]} />
      </section>
    </div>
  )
}
