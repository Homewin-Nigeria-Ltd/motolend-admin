"use client"

import { useState, type ReactNode } from "react"

import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useDeleteLoanProduct } from "@/features/loan-products/hooks/use-loan-product-mutations"

type DeleteLoanProductDialogProps = {
  productId: string
  productName: string
  trigger?: ReactNode
}

export function DeleteLoanProductDialog({
  productId,
  productName,
  trigger,
}: DeleteLoanProductDialogProps) {
  const [open, setOpen] = useState(false)
  const { deleteLoanProduct, isPending } = useDeleteLoanProduct()

  const handleConfirm = async () => {
    const result = await deleteLoanProduct({ id: productId })

    if (result.success) {
      setOpen(false)
    }
  }

  return (
    <BaseAlertDialog
      title="Delete Loan Product"
      open={open}
      onOpenChange={setOpen}
      trigger={
        trigger ?? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 shrink-0 text-destructive hover:text-destructive"
            aria-label="Delete loan product"
          >
            <Icons.trash size={18} />
          </Button>
        )
      }
      confirmLabel="Delete"
      pendingLabel="Deleting..."
      confirmVariant="destructive"
      isPending={isPending}
      onConfirm={() => {
        void handleConfirm()
      }}
      className="sm:max-w-md"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Are you sure you want to delete{" "}
        <span className="font-medium text-foreground">{productName}</span>? This
        action cannot be undone.
      </p>
    </BaseAlertDialog>
  )
}
