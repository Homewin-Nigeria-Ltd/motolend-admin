"use client"

import { useState, type FormEvent } from "react"

import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  formatAllocationAmountInput,
  parseAllocationAmountInput,
} from "@/features/disbursement/utils/map-disbursement"

type RaiseAllocationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (additionalAmount: number) => Promise<boolean>
  isPending?: boolean
  periodLabel?: string
}

export function RaiseAllocationDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  periodLabel = "this period",
}: RaiseAllocationDialogProps) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setAmount("")
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const additionalAmount = parseAllocationAmountInput(amount)

    if (additionalAmount <= 0) {
      setError("Enter a valid additional amount")
      return
    }

    setError(null)
    const success = await onConfirm(additionalAmount)
    if (success) {
      resetForm()
      onOpenChange(false)
    }
  }

  return (
    <BaseModal
      title={`Raise ${periodLabel} allocation`}
      open={open}
      onOpenChange={(next) => {
        if (!next && isPending) return
        if (!next) resetForm()
        onOpenChange(next)
      }}
      asForm
      onSubmit={(event) => {
        void handleSubmit(event)
      }}
      className="max-w-md"
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              resetForm()
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Raising..." : "Raise allocation"}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">
        Temporarily increase the current period limit without changing the
        permanent base allocation.
      </p>

      <Field>
        <FieldLabel htmlFor="additional-amount">Additional amount</FieldLabel>
        <div className="relative mt-1">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            ₦
          </span>
          <Input
            id="additional-amount"
            value={amount}
            disabled={isPending}
            className="h-11 pl-7"
            placeholder="1,000,000"
            onChange={(event) => {
              const raw = event.target.value.replace(/[^\d,]/g, "")
              const parsed = parseAllocationAmountInput(raw)
              setAmount(
                raw.trim() === "" ? "" : formatAllocationAmountInput(parsed),
              )
              if (error) setError(null)
            }}
          />
        </div>
        {error ? <p className="mt-1 text-sm text-destructive">{error}</p> : null}
      </Field>
    </BaseModal>
  )
}
