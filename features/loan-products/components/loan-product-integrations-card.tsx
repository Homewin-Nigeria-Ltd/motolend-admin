import { LoanProductIntegrationBadge } from "@/features/loan-products/components/loan-product-integration-badge"
import type { LoanProductIntegration } from "@/features/loan-products/types"

type LoanProductIntegrationsCardProps = {
  integrations: LoanProductIntegration[]
}

export function LoanProductIntegrationsCard({
  integrations,
}: LoanProductIntegrationsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">Integrations</h3>

      <div className="mt-6 flex flex-col gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm font-medium text-foreground">
              {integration.name}
            </span>
            <LoanProductIntegrationBadge status={integration.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
