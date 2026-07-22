import type { LoanProductTier } from "@/features/loan-products/types"

type LoanProductTiersCardProps = {
  tiers: LoanProductTier[]
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

export function LoanProductTiersCard({ tiers }: LoanProductTiersCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">Tiers</h3>

      {tiers.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No tiers configured.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-3 gap-4 border-b border-border bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>Minimum Amount</span>
            <span>Maximum Amount</span>
            <span className="text-right">Interest Rate</span>
          </div>

          <div className="divide-y divide-border">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="grid grid-cols-3 gap-4 px-4 py-4 text-sm text-foreground"
              >
                <span>{displayValue(tier.minAmount)}</span>
                <span>{displayValue(tier.maxAmount)}</span>
                <span className="text-right">{displayValue(tier.interestRate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
