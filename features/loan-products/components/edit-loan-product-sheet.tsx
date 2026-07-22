"use client"

import { useEffect, useState, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SlideInModal } from "@/components/ui/slide-in-modal"
import { Switch } from "@/components/ui/switch"
import { useUpdateLoanProduct } from "@/features/loan-products/hooks/use-loan-product-mutations"
import {
  updateLoanProductSchema,
  type UpdateLoanProductFormValues,
} from "@/features/loan-products/schemas/update-loan-product.schema"
import type { LoanProductDetail } from "@/features/loan-products/types"

type EditLoanProductSheetProps = {
  product: LoanProductDetail
  trigger: ReactNode
}

export function EditLoanProductSheet({
  product,
  trigger,
}: EditLoanProductSheetProps) {
  const [open, setOpen] = useState(false)
  const { updateLoanProduct, isPending } = useUpdateLoanProduct()

  const form = useForm<UpdateLoanProductFormValues>({
    resolver: zodResolver(updateLoanProductSchema),
    defaultValues: {
      name: product.name === "—" ? "" : product.name,
      is_active: product.status === "active",
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }

    form.reset({
      name: product.name === "—" ? "" : product.name,
      is_active: product.status === "active",
    })
  }, [form, open, product.name, product.status])

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await updateLoanProduct({
      id: product.id,
      name: values.name.trim(),
      is_active: values.is_active,
    })

    if (result.success) {
      setOpen(false)
    }
  })

  return (
    <SlideInModal
      title="Edit Loan Product"
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      asForm
      onSubmit={handleSubmit}
      footer={
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" className="h-10 px-4" disabled={isPending}>
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="edit-loan-product-name">Name</FieldLabel>
          <Input
            id="edit-loan-product-name"
            {...form.register("name")}
            disabled={isPending}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Controller
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
              <span className="text-sm font-medium text-foreground">Active</span>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isPending}
              />
            </div>
          )}
        />
      </div>
    </SlideInModal>
  )
}
