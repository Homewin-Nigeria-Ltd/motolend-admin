import type { DeclineRecord } from "@/features/decline/types"
import type { ApiLoanApplication } from "@/features/loan-applications/types"
import {
  formatApplicationAmount,
} from "@/features/loan-applications/utils/application"
import { formatUserCreatedAt } from "@/features/users/utils/user"

function displayValue(value: string | null | undefined) {
  const text = value?.trim()
  return text || "—"
}

function personName(user: ApiLoanApplication["user"]) {
  if (!user) return "—"

  const full =
    user.full_name ||
    user.name ||
    [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(" ")

  return full?.trim() || user.email?.trim() || "—"
}

function resolveLoanProduct(loan: ApiLoanApplication) {
  return (
    loan.loan_product?.name?.trim() ||
    loan.loanProduct?.name?.trim() ||
    "—"
  )
}

export function mapApiLoanToDeclineRecord(
  loan: ApiLoanApplication,
): DeclineRecord {
  return {
    id: String(loan.id),
    createdAt: formatUserCreatedAt(loan.created_at),
    customerName: personName(loan.user),
    amountRequested: formatApplicationAmount(
      loan.original_requested_amount ?? loan.amount,
    ),
    loanProductApproved: resolveLoanProduct(loan),
    reasonForDecline: displayValue(loan.rejection_reason),
  }
}
