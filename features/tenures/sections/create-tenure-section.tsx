"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { BackLink } from "@/components/back-link"
import { Button } from "@/components/ui/button"
import { CreateTenureForm } from "@/features/tenures/components/create-tenure-form"
import { useCreateLoanTenure } from "@/features/tenures/hooks/use-loan-tenure-mutations"
import {
  createTenureFormDefaults,
  createTenureSchema,
  type CreateTenureFormInput,
  type CreateTenureFormValues,
} from "@/features/tenures/schemas/create-tenure.schema"
import { buildCreateLoanTenurePayload } from "@/features/tenures/utils/build-tenure-payload"

export function CreateTenureSection() {
  const router = useRouter()
  const { createLoanTenure, isPending } = useCreateLoanTenure()

  const form = useForm<
    CreateTenureFormInput,
    unknown,
    CreateTenureFormValues
  >({
    resolver: zodResolver(createTenureSchema),
    defaultValues: createTenureFormDefaults,
  })

  const handleCancel = () => {
    router.push("/loan-products/tenures")
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await createLoanTenure(buildCreateLoanTenurePayload(values))

    if (result.success) {
      router.push("/loan-products/tenures")
    }
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white p-4 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <BackLink href="/loan-products/tenures" label="Tenure" />
        <h2 className="text-base font-semibold text-foreground">
          Create a loan tenure
        </h2>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <CreateTenureForm form={form} disabled={isPending} />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save tenure"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
