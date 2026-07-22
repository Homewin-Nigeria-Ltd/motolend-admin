"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { BackLink } from "@/components/back-link"
import { Button } from "@/components/ui/button"
import { CreateLoanProductForm } from "@/features/loan-products/components/create-loan-product-form"
import { useCreateLoanProduct } from "@/features/loan-products/hooks/use-loan-product-mutations"
import {
  createLoanProductFormDefaults,
  createLoanProductSchema,
  type CreateLoanProductFormValues,
} from "@/features/loan-products/schemas/create-loan-product.schema"
import { buildCreateLoanProductPayload } from "@/features/loan-products/utils/build-create-loan-product-payload"

export function CreateLoanProductSection() {
  const router = useRouter()
  const { createLoanProduct, isPending } = useCreateLoanProduct()

  const form = useForm<CreateLoanProductFormValues>({
    resolver: zodResolver(createLoanProductSchema),
    defaultValues: createLoanProductFormDefaults,
  })

  const handleCancel = () => {
    router.push("/loan-products/overview")
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await createLoanProduct(buildCreateLoanProductPayload(values))

    if (result.success) {
      router.push("/loan-products/overview")
    }
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <BackLink href="/loan-products/overview" label="Loan Products" />
        <h2 className="text-base font-semibold text-foreground">
          Create Loan Product
        </h2>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <CreateLoanProductForm form={form} disabled={isPending} />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-4"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-10 px-4" disabled={isPending}>
              {isPending ? "Creating…" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
