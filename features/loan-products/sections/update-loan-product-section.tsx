"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { CreateLoanProductForm } from "@/features/loan-products/components/create-loan-product-form"
import { useUpdateLoanProduct } from "@/features/loan-products/hooks/use-loan-product-mutations"
import { useLoanProductDetail } from "@/features/loan-products/hooks/use-loan-product-queries"
import {
  getTierAmountsBoundsError,
  updateLoanProductSchema,
  type UpdateLoanProductFormInput,
  type UpdateLoanProductFormValues,
} from "@/features/loan-products/schemas/update-loan-product.schema"
import { buildCreateLoanProductPayload } from "@/features/loan-products/utils/build-create-loan-product-payload"
import { toast } from "@/lib/toast"

type UpdateLoanProductSectionProps = {
  productId: string
}

export function UpdateLoanProductSection({
  productId,
}: UpdateLoanProductSectionProps) {
  const router = useRouter()
  const { data: product, isPending: isLoading, isError, error } =
    useLoanProductDetail(productId)
  const { updateLoanProduct, isPending: isSaving } = useUpdateLoanProduct()

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:p-6">
        <BackLink
          href={`/loan-products/${encodeURIComponent(productId)}`}
          label="Loan Product"
        />
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load loan product."}
        </div>
      </div>
    )
  }

  return (
    <UpdateLoanProductForm
      key={product.id}
      productId={product.id}
      defaultValues={product.formValues}
      isSaving={isSaving}
      updateLoanProduct={updateLoanProduct}
      onCancel={() => router.push(`/loan-products/${product.id}`)}
      onSuccess={() => router.push(`/loan-products/${product.id}`)}
    />
  )
}

type UpdateLoanProductFormProps = {
  productId: string
  defaultValues: UpdateLoanProductFormInput
  isSaving: boolean
  updateLoanProduct: ReturnType<
    typeof useUpdateLoanProduct
  >["updateLoanProduct"]
  onCancel: () => void
  onSuccess: () => void
}

function UpdateLoanProductForm({
  productId,
  defaultValues,
  isSaving,
  updateLoanProduct,
  onCancel,
  onSuccess,
}: UpdateLoanProductFormProps) {
  const form = useForm<
    UpdateLoanProductFormInput,
    unknown,
    UpdateLoanProductFormValues
  >({
    resolver: zodResolver(updateLoanProductSchema),
    defaultValues,
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const tierBoundsError = getTierAmountsBoundsError(form.getValues())
    if (tierBoundsError) {
      toast.warning(tierBoundsError)
      return
    }

    void form.handleSubmit(async (values) => {
      const result = await updateLoanProduct({
        id: productId,
        ...buildCreateLoanProductPayload(values),
      })

      if (result.success) {
        onSuccess()
      }
    })(event)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <BackLink href={`/loan-products/${productId}`} label="Loan Product" />
        <h2 className="text-base font-semibold text-foreground">
          Edit Loan Product
        </h2>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <CreateLoanProductForm form={form} disabled={isSaving} />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-4"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-10 px-4" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
