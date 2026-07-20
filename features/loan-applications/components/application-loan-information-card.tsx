import type { ApplicationLoanInformation } from "@/features/loan-applications/types"

type ApplicationLoanInformationCardProps = {
  loanInformation: ApplicationLoanInformation
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-start sm:gap-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{displayValue(value)}</p>
    </div>
  )
}

export function ApplicationLoanInformationCard({
  loanInformation,
}: ApplicationLoanInformationCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">
        Loan Information
      </h3>

      <div className="mt-6 flex flex-col gap-4">
        <InfoRow label="Loan Type" value={loanInformation.loanType} />
        <InfoRow label="Loan Category" value={loanInformation.loanCategory} />
        <InfoRow label="Description" value={loanInformation.description} />
        <InfoRow label="Amount Requested" value={loanInformation.amountRequested} />
        <InfoRow label="Tenure" value={loanInformation.tenure} />
        <InfoRow label="Interest Rate" value={loanInformation.interestRate} />
        <InfoRow
          label="Repayment Frequency"
          value={loanInformation.repaymentFrequency}
        />
      </div>
    </div>
  )
}
