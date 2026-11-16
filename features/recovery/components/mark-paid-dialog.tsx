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
import {
  markPaidFormDefaults,
  markPaidSchema,
  type MarkPaidFormValues,
} from "@/features/recovery/schemas/mark-paid.schema"
import type { RecoveryLoan } from "@/features/recovery/types"

const recoveryMethodLabels: Record<MarkPaidFormValues["recovery_method"], string> =
  {
    bank_transfer: "Bank transfer to recovery account",
    cash: "Cash collected",
    pos: "POS / card payment",
    other: "Other",
  }

type MarkPaidDialogProps = {
  loan: RecoveryLoan | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSendOtp: (values: MarkPaidFormValues) => void
  isPending?: boolean
}

export function MarkPaidDialog({
  loan,
  open,
  onOpenChange,
  onSendOtp,
  isPending = false,
}: MarkPaidDialogProps) {
  const form = useForm<MarkPaidFormValues>({
    resolver: zodResolver(markPaidSchema),
    defaultValues: markPaidFormDefaults,
  })

  useEffect(() => {
    if (!open || !loan) {
      return
    }

    form.reset({
      recovery_method: "bank_transfer",
      amount_recovered: `₦${loan.outstanding}`,
      payment_reference: "",
    })
  }, [open, loan, form])

  if (!loan) {
    return null
  }

  return (
    <BaseModal
      title={`Mark loan ${loan.applicationId} as Paid`}
      className="max-w-lg"
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          form.reset(markPaidFormDefaults)
        }
        onOpenChange(next)
      }}
      asForm
      onSubmit={form.handleSubmit((values) => onSendOtp(values))}
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
            {isPending ? "Sending…" : "Send OTP"}
          </Button>
        </div>
      }
    >
      <p className="-mt-2 text-sm text-muted-foreground">
        Only for loans recovered outside the app. Repayments made in the app are
        marked Paid by the webhook.
      </p>

      <div className="rounded-xl bg-muted px-4 py-3 text-sm">
        <div className="flex flex-col gap-2">
          <p>
            <span className="text-muted-foreground">Customer:</span>{" "}
            <span className="font-medium text-foreground">
              {loan.customerName} · {loan.phone}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Loan product:</span>{" "}
            <span className="font-medium text-foreground">
              {loan.loanProduct} · due {loan.dueDate}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Outstanding:</span>{" "}
            <span className="font-medium text-foreground">
              ₦{loan.outstanding}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Controller
          name="recovery_method"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Recovery method</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(recoveryMethodLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
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
          name="amount_recovered"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="amount-recovered">Amount recovered</FieldLabel>
              <Input
                {...field}
                id="amount-recovered"
                className="h-11"
                placeholder="₦0"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="payment_reference"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="payment-reference">
                Payment reference
              </FieldLabel>
              <Input
                {...field}
                id="payment-reference"
                className="h-11"
                placeholder="TRF/2611/88231"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        We will send a one time code to recovery@motolend.ng to approve this
        change.
      </div>
    </BaseModal>
  )
}
