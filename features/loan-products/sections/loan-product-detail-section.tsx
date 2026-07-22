"use client"

import { BackLink } from "@/components/back-link"
import { AppLoader } from "@/components/ui/app-loader"
import { LoanProductApprovalWorkflowCard } from "@/features/loan-products/components/loan-product-approval-workflow-card"
import { LoanProductDetailHeader } from "@/features/loan-products/components/loan-product-detail-header"
import { LoanProductInfoCard } from "@/features/loan-products/components/loan-product-info-card"
import { LoanProductIntegrationsCard } from "@/features/loan-products/components/loan-product-integrations-card"
import { LoanProductTiersCard } from "@/features/loan-products/components/loan-product-tiers-card"
import { useLoanProductDetail } from "@/features/loan-products/hooks/use-loan-product-queries"

type LoanProductDetailSectionProps = {
  productId: string
}

export function LoanProductDetailSection({
  productId,
}: LoanProductDetailSectionProps) {
  const { data: product, isPending, isError, error } =
    useLoanProductDetail(productId)

  if (isPending) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-2">
          <BackLink href="/loan-products/overview" label="Loan Products" />
          <h2 className="text-base font-semibold text-foreground">
            Loan Product Details
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load loan product."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/loan-products/overview" label="Loan Products" />
        <h2 className="text-base font-semibold text-foreground">
          Loan Product Details
        </h2>
      </div>

      <LoanProductDetailHeader product={product} />

      <div className="grid gap-4 xl:grid-cols-2">
        <LoanProductInfoCard title="Overview" rows={product.overview} />
        <LoanProductInfoCard
          title="Loan Amount & Duration"
          rows={product.loanAmountDuration}
        />
        <LoanProductInfoCard title="Interest & Fees" rows={product.interestFees} />
        <LoanProductInfoCard
          title="Repayment Rules"
          rows={product.repaymentRules}
        />
        <LoanProductInfoCard
          title="Collateral & Security"
          rows={product.collateralSecurity}
        />
        <LoanProductInfoCard
          title="Document Requirements"
          rows={product.documentRequirements}
        />
      </div>

      <LoanProductApprovalWorkflowCard workflows={product.approvalWorkflow} />

      <div className="grid gap-4 xl:grid-cols-2">
        <LoanProductInfoCard
          title="Notifications & Alerts"
          rows={product.notificationsAlerts}
        />
        <LoanProductIntegrationsCard integrations={product.integrations} />
      </div>

      <LoanProductTiersCard tiers={product.tiers} />
    </div>
  )
}
