import type { DashboardKpiCard } from "@/features/dashboard/types"
import { MetricSummaryCard } from "@/components/metric-summary-card"

function MetricCard({ kpi }: { kpi: DashboardKpiCard }) {
  return (
    <MetricSummaryCard
      label={kpi.label}
      value={kpi.value}
      changePercent={kpi.changePercent}
      trend={kpi.trend}
    />
  )
}

type DashboardMetricCardsProps = {
  kpis: DashboardKpiCard[]
}

export function DashboardMetricCards({ kpis }: DashboardMetricCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <MetricCard key={kpi.key} kpi={kpi} />
      ))}
    </div>
  )
}
