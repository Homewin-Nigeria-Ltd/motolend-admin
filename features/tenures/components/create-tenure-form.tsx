"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
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
import { LINKED_PRODUCT_OPTIONS } from "@/features/tenures/data/mock-tenures"
import {
  INTEREST_FREQUENCY_OPTIONS,
  INTEREST_TYPE_OPTIONS,
  REPAYMENT_FREQUENCY_OPTIONS,
  TENURE_TYPE_OPTIONS,
  type CreateTenureFormInput,
  type CreateTenureFormValues,
} from "@/features/tenures/schemas/create-tenure.schema"

type CreateTenureFormProps = {
  form: UseFormReturn<
    CreateTenureFormInput,
    unknown,
    CreateTenureFormValues
  >
  disabled?: boolean
}

const interestTypeLabels: Record<(typeof INTEREST_TYPE_OPTIONS)[number], string> =
  {
    flat: "Flat rate",
    reducing: "Reducing balance",
  }

const tenureTypeLabels: Record<(typeof TENURE_TYPE_OPTIONS)[number], string> = {
  days: "Days",
  weeks: "Weeks",
  months: "Months",
}

const repaymentFrequencyLabels: Record<
  (typeof REPAYMENT_FREQUENCY_OPTIONS)[number],
  string
> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
}

const interestFrequencyLabels: Record<
  (typeof INTEREST_FREQUENCY_OPTIONS)[number],
  string
> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
}

export function CreateTenureForm({ form, disabled }: CreateTenureFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border p-5 md:p-6">
        <h3 className="text-base font-semibold text-foreground">
          Tenure information
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Same as the loan product form, without minimum amount, maximum amount
          and credit protection fee.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="tenure-name">Tenure Name</FieldLabel>
            <Input
              id="tenure-name"
              placeholder="e.g. 30 days"
              disabled={disabled}
              {...form.register("name")}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="tenure-code">Tenure Code/ID</FieldLabel>
            <Input
              id="tenure-code"
              placeholder="e.g. TEN-030"
              disabled={disabled}
              {...form.register("code")}
            />
            <FieldError errors={[form.formState.errors.code]} />
          </Field>
        </div>

        <div className="mt-4">
          <Controller
            name="linked_products"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Linked loan products</FieldLabel>
                <div className="rounded-xl border border-border p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {LINKED_PRODUCT_OPTIONS.map((product) => {
                      const checked = field.value?.includes(product) ?? false

                      return (
                        <label
                          key={product}
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"
                        >
                          <Checkbox
                            checked={checked}
                            disabled={disabled}
                            onCheckedChange={(next) => {
                              const current = field.value ?? []
                              field.onChange(
                                next === true
                                  ? [...current, product]
                                  : current.filter((item) => item !== product),
                              )
                            }}
                          />
                          {product}
                        </label>
                      )
                    })}
                  </div>
                </div>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </div>

        <div className="mt-4">
          <Field>
            <FieldLabel htmlFor="tenure-description">Description</FieldLabel>
            <Textarea
              id="tenure-description"
              placeholder="Describe who this tenure is for"
              disabled={disabled}
              className="min-h-24"
              {...form.register("description")}
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border p-5 md:p-6">
        <h3 className="text-base font-semibold text-foreground">Duration</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="tenure-value">Tenure</FieldLabel>
            <Input
              id="tenure-value"
              type="number"
              placeholder="0"
              disabled={disabled}
              {...form.register("tenure", { valueAsNumber: true })}
            />
            <FieldError errors={[form.formState.errors.tenure]} />
          </Field>

          <Controller
            name="tenure_type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tenure Type</FieldLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {TENURE_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {tenureTypeLabels[option]}
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

          <Controller
            name="repayment_frequency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Repayment Frequency</FieldLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPAYMENT_FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {repaymentFrequencyLabels[option]}
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
      </section>

      <section className="rounded-2xl border border-border p-5 md:p-6">
        <h3 className="text-base font-semibold text-foreground">
          Interest & Fees
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Controller
            name="interest_type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Interest Type</FieldLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTEREST_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {interestTypeLabels[option]}
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

          <Controller
            name="interest_frequency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Interest frequency</FieldLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTEREST_FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {interestFrequencyLabels[option]}
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

          <Field>
            <FieldLabel htmlFor="interest-rate">Interest Rate</FieldLabel>
            <div className="relative">
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                placeholder="0"
                disabled={disabled}
                className="pr-10"
                {...form.register("interest_rate", { valueAsNumber: true })}
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            <FieldError errors={[form.formState.errors.interest_rate]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="processing-fee">Processing Fee</FieldLabel>
            <div className="relative">
              <Input
                id="processing-fee"
                type="number"
                step="0.01"
                placeholder="0"
                disabled={disabled}
                className="pr-10"
                {...form.register("processing_fee", { valueAsNumber: true })}
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            <FieldError errors={[form.formState.errors.processing_fee]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="insurance-fee">Insurance Fee</FieldLabel>
            <div className="relative">
              <Input
                id="insurance-fee"
                type="number"
                step="0.01"
                placeholder="0"
                disabled={disabled}
                className="pr-10"
                {...form.register("insurance_fee", { valueAsNumber: true })}
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            <FieldError errors={[form.formState.errors.insurance_fee]} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border p-5 md:p-6">
        <Controller
          name="show_in_app"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Show in the app
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Customers can pick this tenure as soon as it is active.
                </p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </div>
          )}
        />
      </section>
    </div>
  )
}
