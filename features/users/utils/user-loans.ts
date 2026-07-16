import type { ApiLoan, UserLoan } from "@/features/users/types"
import { formatMoney } from "@/features/users/utils/format-money"
import { formatUserCreatedAt } from "@/features/users/utils/user"

function formatDueDate(value: string | null | undefined) {
  if (!value) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date)
}

function formatInterestRate(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—"
  }

  const numeric = typeof value === "number" ? value : Number(value)

  if (Number.isNaN(numeric)) {
    return `${value}%`
  }

  return `${numeric}%`
}

export function mapApiLoanToUserLoan(loan: ApiLoan): UserLoan {
  const product = loan.loan_product ?? loan.loanProduct

  return {
    id: String(loan.id),
    createdAt: formatUserCreatedAt(loan.created_at),
    productName: product?.name ?? "—",
    amount: formatMoney(loan.amount),
    interestRate: formatInterestRate(loan.interest_rate),
    totalRepayment: formatMoney(loan.total_repayment),
    tenure: `${loan.tenure} ${loan.tenure_type}`,
    dueDate: formatDueDate(loan.due_date),
    status: loan.status,
  }
}
