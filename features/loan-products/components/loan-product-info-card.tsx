import type { LoanProductInfoRow } from "@/features/loan-products/types"

type LoanProductInfoCardProps = {
  title: string
  rows: LoanProductInfoRow[]
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

function InfoRow({ label, value }: LoanProductInfoRow) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-start sm:gap-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{displayValue(value)}</p>
    </div>
  )
}

export function LoanProductInfoCard({ title, rows }: LoanProductInfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      <div className="mt-6 flex flex-col gap-4">
        {rows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </div>
  )
}
