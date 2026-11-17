"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { CreateTenureForm } from "@/features/tenures/components/create-tenure-form"
import { useUpdateLoanTenure } from "@/features/tenures/hooks/use-loan-tenure-mutations"
import { useLoanTenureDetail } from "@/features/tenures/hooks/use-loan-tenure-queries"
import {
  createTenureSchema,
  type CreateTenureFormInput,
  type CreateTenureFormValues,
} from "@/features/tenures/schemas/create-tenure.schema"
import { buildCreateLoanTenurePayload } from "@/features/tenures/utils/build-tenure-payload"

type EditTenureSectionProps = {
  tenureId: string
}

export function EditTenureSection({ tenureId }: EditTenureSectionProps) {
  const router = useRouter()
  const { data: tenure, isPending, isError, error } =
    useLoanTenureDetail(tenureId)

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-background p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !tenure) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-background p-4 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/loan-products/tenures" label="Tenure" />
          <h2 className="text-base font-semibold text-foreground">
            Edit tenure
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Tenure not found."}
        </div>
      </div>
    )
  }

  return (
    <EditTenureForm
      key={tenure.id}
      tenureId={tenure.id}
      defaultValues={tenure.formValues}
      onCancel={() => router.push("/loan-products/tenures")}
      onSuccess={() => router.push("/loan-products/tenures")}
    />
  )
}

type EditTenureFormProps = {
  tenureId: string
  defaultValues: CreateTenureFormInput
  onCancel: () => void
  onSuccess: () => void
}

function EditTenureForm({
  tenureId,
  defaultValues,
  onCancel,
  onSuccess,
}: EditTenureFormProps) {
  const { updateLoanTenure, isPending } = useUpdateLoanTenure()

  const form = useForm<
    CreateTenureFormInput,
    unknown,
    CreateTenureFormValues
  >({
    resolver: zodResolver(createTenureSchema),
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await updateLoanTenure({
      id: tenureId,
      ...buildCreateLoanTenurePayload(values),
    })

    if (result.success) {
      onSuccess()
    }
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background p-4 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <BackLink href="/loan-products/tenures" label="Tenure" />
        <h2 className="text-base font-semibold text-foreground">
          Edit tenure
        </h2>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <CreateTenureForm form={form} disabled={isPending} />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
