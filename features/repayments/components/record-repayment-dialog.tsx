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
import { useRecordRepayment } from "@/features/repayments/hooks/use-repayment-mutations"
import {
  PAYMENT_METHOD_OPTIONS,
  recordRepaymentFormDefaults,
  recordRepaymentSchema,
  type RecordRepaymentFormValues,
} from "@/features/repayments/schemas/record-repayment.schema"

const paymentMethodLabels: Record<(typeof PAYMENT_METHOD_OPTIONS)[number], string> =
  {
    cash: "Cash",
    bank_transfer: "Bank Transfer",
    mobile_money: "Mobile Money",
    direct_debit: "Direct Debit",
  }

type RecordRepaymentDialogProps = {
  repaymentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecordRepaymentDialog({
  repaymentId,
  open,
  onOpenChange,
}: RecordRepaymentDialogProps) {
  const { recordRepayment, isPending } = useRecordRepayment(repaymentId)

  const form = useForm<RecordRepaymentFormValues>({
    resolver: zodResolver(recordRepaymentSchema),
    defaultValues: recordRepaymentFormDefaults,
  })

  useEffect(() => {
    if (!open) {
      return
    }

    form.reset(recordRepaymentFormDefaults)
  }, [open, form])

  const onSubmit = async (values: RecordRepaymentFormValues) => {
    const result = await recordRepayment(values)

    if (result.success) {
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <BaseModal
      title="Record Payment"
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
            {isPending ? "Recording…" : "Record Payment"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field>
          <FieldLabel htmlFor="record-repayment-amount">Amount</FieldLabel>
          <Input
            id="record-repayment-amount"
            type="number"
            min={0}
            step="any"
            placeholder="Enter amount"
            disabled={isPending}
            {...form.register("amount", { valueAsNumber: true })}
          />
          <FieldError errors={[form.formState.errors.amount]} />
        </Field>

        <Controller
          control={form.control}
          name="payment_method"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="record-repayment-method">
                Payment Method
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger
                  id="record-repayment-method"
                  className="h-11 w-full border-border bg-background"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {PAYMENT_METHOD_OPTIONS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {paymentMethodLabels[method]}
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
