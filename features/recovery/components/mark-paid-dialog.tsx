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
  RECOVERY_METHOD_LABELS,
  markPaidFormDefaults,
  markPaidSchema,
  type MarkPaidFormValues,
} from "@/features/recovery/schemas/mark-paid.schema"
import type { RecoveryLoan } from "@/features/recovery/types"

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
      amount_recovered: String(loan.outstandingRaw || ""),
      payment_reference: "",
    })
  }, [open, loan, form])

  if (!loan) {
    return null
  }

  return (
    <BaseModal
      title={`Mark loan ${loan.applicationId} as Paid`}
      className="flex max-h-[min(92dvh,calc(100vh-2rem))] w-[calc(100vw-2rem)] max-w-lg flex-col sm:w-full"
      bodyClassName="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 sm:pb-6"
      headerClassName="px-4 pt-6 pb-2 sm:px-6 sm:pt-8"
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
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" className="h-11 w-full sm:w-auto" disabled={isPending}>
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
        <div className="flex flex-col gap-2 break-words">
          <p>
            <span className="text-muted-foreground">Customer:</span>{" "}
            <span className="font-medium text-foreground">
              {loan.customerName}
              <span className="hidden sm:inline"> · </span>
              <span className="mt-0.5 block sm:mt-0 sm:inline">
                {loan.phone}
              </span>
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Loan product:</span>{" "}
            <span className="font-medium text-foreground">
              {loan.loanProduct}
              <span className="hidden sm:inline"> · </span>
              <span className="mt-0.5 block sm:mt-0 sm:inline">
                due {loan.dueDate}
              </span>
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Outstanding:</span>{" "}
            <span className="font-medium text-foreground">
              {loan.outstanding}
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
              <Select
                modal={false}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {Object.entries(RECOVERY_METHOD_LABELS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
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
                placeholder="0"
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
