"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSubmitEligibilityReviewDecision } from "@/features/loan-applications/hooks/use-eligibility-review-mutations"
import {
  ELIGIBILITY_REVIEW_DECISION_OPTIONS,
  eligibilityReviewDecisionDefaults,
  eligibilityReviewDecisionLabels,
  eligibilityReviewDecisionSchema,
  type EligibilityReviewDecisionFormInput,
  type EligibilityReviewDecisionFormValues,
} from "@/features/loan-applications/schemas/eligibility-review-decision.schema"
import type { ApiEligibilityReviewItem } from "@/features/loan-applications/types"
import { formatMoney } from "@/features/users/utils/format-money"

type EligibilityReviewDecisionDialogProps = {
  review: ApiEligibilityReviewItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EligibilityReviewDecisionDialog({
  review,
  open,
  onOpenChange,
}: EligibilityReviewDecisionDialogProps) {
  const { submitDecision, isPending } = useSubmitEligibilityReviewDecision()

  const form = useForm<
    EligibilityReviewDecisionFormInput,
    unknown,
    EligibilityReviewDecisionFormValues
  >({
    resolver: zodResolver(eligibilityReviewDecisionSchema),
    defaultValues: eligibilityReviewDecisionDefaults,
  })

  useEffect(() => {
    if (!open) {
      form.reset(eligibilityReviewDecisionDefaults)
    }
  }, [open, form])

  const onSubmit = async (values: EligibilityReviewDecisionFormValues) => {
    if (!review) {
      return
    }

    await submitDecision({
      userId: review.user.id,
      decision: values.decision,
      notes: values.notes,
    })

    form.reset(eligibilityReviewDecisionDefaults)
    onOpenChange(false)
  }

  return (
    <BaseModal
      title="Submit Eligibility Decision"
      className="max-w-lg"
      open={open}
      onOpenChange={onOpenChange}
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
          <Button type="submit" disabled={isPending || !review}>
            {isPending ? "Submitting…" : "Submit Decision"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {review ? (
          <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <div>
              <p className="font-medium text-foreground">{review.user.name}</p>
              <p className="text-muted-foreground">
                {review.user.email} · {review.user.phone}
              </p>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Eligibility amount</dt>
                <dd className="font-medium text-foreground">
                  {formatMoney(review.risk_analysis.eligibility_amount)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Avg monthly income</dt>
                <dd className="font-medium text-foreground">
                  {formatMoney(
                    review.risk_analysis.average_monthly_regular_income,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Qualifying ₦10k months</dt>
                <dd className="font-medium text-foreground">
                  {review.risk_analysis.qualifying_10000_months}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Qualifying ₦20k months</dt>
                <dd className="font-medium text-foreground">
                  {review.risk_analysis.qualifying_20000_months}
                </dd>
              </div>
            </dl>
            {review.risk_analysis.reasons.length > 0 ? (
              <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                {review.risk_analysis.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <Controller
          control={form.control}
          name="decision"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="eligibility-review-decision">
                Decision
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger
                  id="eligibility-review-decision"
                  className="w-full"
                >
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  {ELIGIBILITY_REVIEW_DECISION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {eligibilityReviewDecisionLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="notes"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="eligibility-review-notes">
                Reviewer notes
              </FieldLabel>
              <Textarea
                id="eligibility-review-notes"
                rows={4}
                placeholder="Enter reviewer notes"
                className="resize-none rounded-sm border-border bg-transparent"
                disabled={isPending}
                {...field}
              />
              {fieldState.error ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
      </div>
    </BaseModal>
  )
}
