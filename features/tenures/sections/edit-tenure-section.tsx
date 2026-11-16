"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { BackLink } from "@/components/back-link"
import { Button } from "@/components/ui/button"
import { CreateTenureForm } from "@/features/tenures/components/create-tenure-form"
import { tenureRecords } from "@/features/tenures/data/mock-tenures"
import {
  createTenureSchema,
  type CreateTenureFormInput,
  type CreateTenureFormValues,
} from "@/features/tenures/schemas/create-tenure.schema"
import {
  findTenureById,
  mapTenureRecordToFormValues,
} from "@/features/tenures/utils/map-tenure-to-form"
import { toast } from "@/lib/toast"

type EditTenureSectionProps = {
  tenureId: string
}

export function EditTenureSection({ tenureId }: EditTenureSectionProps) {
  const router = useRouter()
  const tenure = findTenureById(tenureId, tenureRecords)

  if (!tenure) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/loan-products/tenures" label="Tenure" />
          <h2 className="text-base font-semibold text-foreground">
            Edit tenure
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          Tenure not found.
        </div>
      </div>
    )
  }

  return (
    <EditTenureForm
      key={tenure.id}
      tenureId={tenure.id}
      defaultValues={mapTenureRecordToFormValues(tenure)}
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
  const form = useForm<
    CreateTenureFormInput,
    unknown,
    CreateTenureFormValues
  >({
    resolver: zodResolver(createTenureSchema),
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(async () => {
    void tenureId
    toast.success("Tenure updated")
    onSuccess()
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <BackLink href="/loan-products/tenures" label="Tenure" />
        <h2 className="text-base font-semibold text-foreground">
          Edit tenure
        </h2>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <CreateTenureForm form={form} />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
