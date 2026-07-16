import { AppLoader } from "@/components/ui/app-loader"
import { cn } from "@/lib/utils"

type DashboardSectionSpinnerProps = {
  className?: string
}

function DashboardSectionSpinner({ className }: DashboardSectionSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl border border-border bg-background",
        className,
      )}
    >
      <AppLoader spinnerClassName="size-8" />
    </div>
  )
}

export function DashboardMetricCardsSpinner() {
  return <DashboardSectionSpinner className="min-h-[7.5rem]" />
}

export function DashboardChartCardSpinner() {
  return <DashboardSectionSpinner className="min-h-[24rem]" />
}

export function DashboardAreaChartSpinner() {
  return <DashboardSectionSpinner className="min-h-[24rem]" />
}
