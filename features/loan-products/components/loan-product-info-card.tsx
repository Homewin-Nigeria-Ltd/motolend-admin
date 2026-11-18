import type { LoanProductInfoRow } from "@/features/loan-products/types"

type LoanProductInfoCardProps = {
  title: string
  rows: LoanProductInfoRow[]
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

function InfoRow({ label, value, chips }: LoanProductInfoRow) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-start sm:gap-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      {chips ? (
        chips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {chip.label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium text-foreground">-</p>
        )
      ) : (
        <p className="text-sm font-medium text-foreground">
          {displayValue(value)}
        </p>
      )}
    </div>
  )
}

export function LoanProductInfoCard({ title, rows }: LoanProductInfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-[#F9F9F9] p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      <div className="mt-6 flex flex-col gap-4">
        {rows.map((row) => (
          <InfoRow
            key={row.label}
            label={row.label}
            value={row.value}
            chips={row.chips}
          />
        ))}
      </div>
    </div>
  )
}
