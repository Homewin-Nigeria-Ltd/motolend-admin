"use client"

import { useCreditCheckSetting } from "@/features/settings/hooks/use-credit-check-setting"
import { useUpdateCreditCheckSetting } from "@/features/settings/hooks/use-update-credit-check-setting"
import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"
import { Switch } from "@/components/ui/switch"

function formatUpdatedAt(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)

  return `${datePart} at ${timePart}`
}

export function CreditCheckSettingsSection() {
  const { data, isPending, isError } = useCreditCheckSetting()
  const { updateCreditCheckSetting, isPending: isUpdating } =
    useUpdateCreditCheckSetting()

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="mb-4">
          <BackLink href="/settings" label="Settings" />
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          Could not load credit check setting.
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4">
        <BackLink href="/settings" label="Settings" />
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Credit Check
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground">
                Enable credit checks
              </p>
              <p className="text-sm text-muted-foreground">
                {data.enabled
                  ? "Credit checks are currently enabled for loan applications."
                  : "Credit checks are currently disabled for loan applications."}
              </p>
            </div>
            <Switch
              checked={data.enabled}
              disabled={isUpdating}
              aria-label="Credit check enabled"
              onCheckedChange={(enabled) => {
                void updateCreditCheckSetting({ enabled })
              }}
            />
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="mt-1 font-medium text-foreground">
                {data.enabled ? "Enabled" : "Disabled"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Last updated</dt>
              <dd className="mt-1 font-medium text-foreground">
                {formatUpdatedAt(data.updated_at)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
