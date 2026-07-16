"use client"

import { DashboardBottomMetrics } from "@/features/dashboard/components/dashboard-bottom-metrics"
import { DashboardInterestOverTimeSection } from "@/features/dashboard/components/dashboard-interest-over-time-section"
import { DashboardLoanPurposeSection } from "@/features/dashboard/components/dashboard-loan-purpose-section"
import { DashboardProductPerformanceSection } from "@/features/dashboard/components/dashboard-product-performance-section"
import { DashboardSectionErrorBoundary } from "@/features/dashboard/components/dashboard-section-error-boundary"
import { DashboardTopMetrics } from "@/features/dashboard/components/dashboard-top-metrics"

export function DashboardSection() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <DashboardSectionErrorBoundary title="Overview metrics">
        <DashboardTopMetrics />
      </DashboardSectionErrorBoundary>

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardSectionErrorBoundary title="Loan purpose">
          <DashboardLoanPurposeSection />
        </DashboardSectionErrorBoundary>

        <DashboardSectionErrorBoundary title="Product performance">
          <DashboardProductPerformanceSection />
        </DashboardSectionErrorBoundary>
      </div>

      <DashboardSectionErrorBoundary title="Secondary metrics">
        <DashboardBottomMetrics />
      </DashboardSectionErrorBoundary>

      <DashboardSectionErrorBoundary title="Interest over time">
        <DashboardInterestOverTimeSection />
      </DashboardSectionErrorBoundary>
    </div>
  )
}
