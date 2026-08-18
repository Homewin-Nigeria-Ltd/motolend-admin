"use client"

import type { FieldPath, UseFormReturn } from "react-hook-form"
import { Controller, useFieldArray } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import {
  AUTO_DEBIT_OPTIONS,
  COLLATERAL_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  DOCUMENT_FORMAT_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  INTEREST_TYPE_OPTIONS,
  MANDATORY_DOCUMENT_OPTIONS,
  NOTIFICATION_INTEGRATION_OPTIONS,
  OVERPAYMENT_HANDLING_OPTIONS,
  PARTIAL_PAYMENT_OPTIONS,
  PAYMENT_ALLOCATION_OPTIONS,
  REPAYMENT_FREQUENCY_OPTIONS,
  REPAYMENT_METHOD_OPTIONS,
  START_DATE_RULE_OPTIONS,
  TENURE_TYPE_OPTIONS,
  VALUATION_RULE_OPTIONS,
  VERIFICATION_METHOD_OPTIONS,
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

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

function TextField({
  form,
  name,
  label,
  disabled,
  className,
  placeholder,
}: {
  form: FormInstance
  name: FieldPath<CreateLoanProductFormInput>
  label: string
  disabled?: boolean
  className?: string
  placeholder?: string
}) {
  const error = form.formState.errors

  return (
    <Field className={className}>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
      <Input
        id={String(name)}
        placeholder={placeholder}
        {...form.register(name)}
        disabled={disabled}
      />
      <FieldError errors={[error[name as keyof typeof error]]} />
    </Field>
  )
}

function NumberField({
  form,
  name,
  label,
  disabled,
  className,
  step,
  min,
}: {
  form: FormInstance
  name: FieldPath<CreateLoanProductFormInput>
  label: string
  disabled?: boolean
  className?: string
  step?: string
  min?: number
}) {
  const error = form.formState.errors

  return (
    <Field className={className}>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
      <Input
        id={String(name)}
        type="number"
        step={step}
        min={min}
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
  className,
}: {
  form: FormInstance
  name: FieldPath<CreateLoanProductFormInput>
  label: string
  options: readonly string[]
  disabled?: boolean
  className?: string
}) {
  const error = form.formState.errors

  return (
    <Field className={className}>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Select
            value={typeof field.value === "string" ? field.value || undefined : undefined}
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

function CheckboxGroupField({
  form,
  name,
  label,
  options,
  disabled,
  className,
}: {
  form: FormInstance
  name: FieldPath<CreateLoanProductFormInput>
  label: string
  options: readonly string[]
  disabled?: boolean
  className?: string
}) {
  const error = form.formState.errors

  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => {
          const selected = Array.isArray(field.value) ? field.value : []

          return (
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((option) => {
                const checked = selected.includes(option)

                return (
                  <label
                    key={option}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={(nextChecked) => {
                        if (nextChecked) {
                          field.onChange([...selected, option])
                          return
                        }

                        field.onChange(selected.filter((value) => value !== option))
                      }}
                    />
                    <span className="capitalize">{option.replaceAll("_", " ")}</span>
                  </label>
                )
              })}
            </div>
          )
        }}
      />
      <FieldError errors={[error[name as keyof typeof error]]} />
    </Field>
  )
}

function TiersSection({ form, disabled }: { form: FormInstance; disabled?: boolean }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tiers",
  })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
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
              min_amount: undefined as unknown as number,
              max_amount: undefined as unknown as number,
              interest_rate: undefined as unknown as number,
            })
          }
        >
          Add Tier
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-foreground">Tier {index + 1}</p>
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
              <NumberField
                form={form}
                name={`tiers.${index}.min_amount`}
                label="Minimum Amount"
                disabled={disabled}
              />
              <NumberField
                form={form}
                name={`tiers.${index}.max_amount`}
                label="Maximum Amount"
                disabled={disabled}
              />
              <NumberField
                form={form}
                name={`tiers.${index}.interest_rate`}
                label="Interest Rate (%)"
                step="0.01"
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </div>

      <FieldError errors={[form.formState.errors.tiers]} />
    </section>
  )
}

export function CreateLoanProductForm({
  form,
  disabled = false,
}: CreateLoanProductFormProps) {
  return (
    <div className="flex flex-col gap-10">
      <FormSection title="Basic Information">
        <TextField form={form} name="name" label="Name" disabled={disabled} />
        <TextField form={form} name="code" label="Code" disabled={disabled} />
        <TextField
          form={form}
          name="category"
          label="Category"
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
      </FormSection>

      <FormSection title="Loan Amount & Duration">
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
        <NumberField
          form={form}
          name="amount_increment"
          label="Amount Increment"
          disabled={disabled}
        />
        <SelectField
          form={form}
          name="currency"
          label="Currency"
          options={CURRENCY_OPTIONS}
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
        <SelectField
          form={form}
          name="repayment_frequency"
          label="Repayment Frequency"
          options={REPAYMENT_FREQUENCY_OPTIONS}
          disabled={disabled}
        />
        <TextField
          form={form}
          name="grace_period"
          label="Grace Period"
          placeholder="3 days"
          disabled={disabled}
        />
        <SelectField
          form={form}
          name="start_date_rules"
          label="Start Date Rules"
          options={START_DATE_RULE_OPTIONS}
          disabled={disabled}
        />
      </FormSection>

      <FormSection title="Interest & Fees">
        <SelectField
          form={form}
          name="interest_type"
          label="Interest Type"
          options={INTEREST_TYPE_OPTIONS}
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
          name="late_payment_fee"
          label="Late Payment Fee"
          disabled={disabled}
        />
        <NumberField
          form={form}
          name="early_settlement_fee"
          label="Early Settlement Fee"
          disabled={disabled}
        />
        <NumberField
          form={form}
          name="insurance_fee"
          label="Insurance Fee"
          disabled={disabled}
        />
      </FormSection>

      <FormSection
        title="Eligibility Criteria"
        description="Define who qualifies for this loan product."
      >
        <NumberField
          form={form}
          name="eligibility_criteria.age"
          label="Minimum Age"
          min={21}
          disabled={disabled}
        />
        <TextField
          form={form}
          name="eligibility_criteria.location"
          label="Location"
          placeholder="Lagos"
          disabled={disabled}
        />
        <SelectField
          form={form}
          name="eligibility_criteria.employment_status"
          label="Employment Status"
          options={EMPLOYMENT_STATUS_OPTIONS}
          disabled={disabled}
        />
        <NumberField
          form={form}
          name="eligibility_criteria.credit_score"
          label="Minimum Credit Score"
          min={600}
          disabled={disabled}
        />
      </FormSection>

      <FormSection title="Repayment Rules">
        <CheckboxGroupField
          form={form}
          name="repayment_methods"
          label="Repayment Methods"
          options={REPAYMENT_METHOD_OPTIONS}
          disabled={disabled}
          className="sm:col-span-2"
        />
        <SelectField
          form={form}
          name="payment_allocation"
          label="Payment Allocation"
          options={PAYMENT_ALLOCATION_OPTIONS}
          disabled={disabled}
        />
        <SelectField
          form={form}
          name="partial_payment_allowed"
          label="Partial Payments Allowed"
          options={PARTIAL_PAYMENT_OPTIONS}
          disabled={disabled}
        />
        <SelectField
          form={form}
          name="overpayment_handling"
          label="Overpayment Handling"
          options={OVERPAYMENT_HANDLING_OPTIONS}
          disabled={disabled}
        />
        <SelectField
          form={form}
          name="auto_debit_settings"
          label="Auto-Debit Settings"
          options={AUTO_DEBIT_OPTIONS}
          disabled={disabled}
        />
      </FormSection>

      <FormSection title="Collateral & Security">
        <Controller
          control={form.control}
          name="collateral_required"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 sm:col-span-2">
              <span className="text-sm font-medium text-foreground">
                Collateral Required
              </span>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </div>
          )}
        />
        <CheckboxGroupField
          form={form}
          name="collateral_types"
          label="Collateral Types"
          options={COLLATERAL_TYPE_OPTIONS}
          disabled={disabled}
          className="sm:col-span-2"
        />
        <SelectField
          form={form}
          name="valuation_rules"
          label="Valuation Rules"
          options={VALUATION_RULE_OPTIONS}
          disabled={disabled}
        />
      </FormSection>

      <FormSection title="Document Requirements">
        <CheckboxGroupField
          form={form}
          name="mandatory_documents"
          label="Mandatory Documents"
          options={MANDATORY_DOCUMENT_OPTIONS}
          disabled={disabled}
          className="sm:col-span-2"
        />
        <CheckboxGroupField
          form={form}
          name="allowed_document_formats"
          label="Allowed Document Formats"
          options={DOCUMENT_FORMAT_OPTIONS}
          disabled={disabled}
          className="sm:col-span-2"
        />
        <NumberField
          form={form}
          name="document_size_limit"
          label="Document Size Limit (MB)"
          disabled={disabled}
        />
        <SelectField
          form={form}
          name="verification_method"
          label="Verification Method"
          options={VERIFICATION_METHOD_OPTIONS}
          disabled={disabled}
        />
      </FormSection>

      <FormSection title="Approval Workflow">
        <TextField
          form={form}
          name="approval_workflow.name"
          label="Workflow Name"
          disabled={disabled}
        />
        <NumberField
          form={form}
          name="approval_workflow.steps"
          label="Steps"
          disabled={disabled}
        />
      </FormSection>

      <FormSection title="Notifications & Integrations">
        <CheckboxGroupField
          form={form}
          name="notifications_integrations"
          label="Channels"
          options={NOTIFICATION_INTEGRATION_OPTIONS}
          disabled={disabled}
          className="sm:col-span-2"
        />
      </FormSection>

      <TiersSection form={form} disabled={disabled} />
    </div>
  )
}
