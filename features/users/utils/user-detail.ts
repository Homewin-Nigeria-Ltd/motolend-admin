import type { ApiAdminUser, UserDetail } from "@/features/users/types"
import { formatMoney } from "@/features/users/utils/format-money"
import {
  formatSignedUpOn,
  getApiUserDisplayName,
  mapAccountStatusToUserStatus,
} from "@/features/users/utils/user"

function valueOrDash(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "—"
  }

  const text = String(value).trim()
  return text || "—"
}

function formatDateOfBirth(value: string | null | undefined) {
  if (!value) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function mapApiUserToUserDetail(user: ApiAdminUser): UserDetail {
  const name = getApiUserDisplayName(user)
  const profile = user.profile
  const nextOfKin = user.next_of_kin
  const metrics = user.financial_metrics

  const repaymentAccounts =
    profile?.account_number || profile?.bank_name
      ? [
          {
            id: String(profile.id ?? "1"),
            accountNumber: valueOrDash(profile.account_number),
            bankName: valueOrDash(profile.bank_name),
            variant: "success" as const,
          },
        ]
      : []

  return {
    id: user.id,
    name,
    email: user.email,
    signedUpOn: formatSignedUpOn(user.created_at),
    status: mapAccountStatusToUserStatus(
      user.account_status,
      user.role ?? "",
    ),
    pendingRepayments: metrics?.pending_repayments_count ?? 0,
    avatarUrl: null,
    fields: [
      { label: "Email", value: valueOrDash(user.email) },
      {
        label: "Date of Birth",
        value: formatDateOfBirth(profile?.date_of_birth),
      },
      { label: "Telephone", value: valueOrDash(user.phone) },
      { label: "Nationality", value: valueOrDash(profile?.nationality) },
      {
        label: "Employment status",
        value: valueOrDash(user.employment_status),
      },
      { label: "Company Name", value: valueOrDash(user.company_name) },
      { label: "Job Title", value: valueOrDash(user.job_title) },
      {
        label: "Monthly Income",
        value: formatMoney(user.monthly_income),
      },
      {
        label: "Next of Kin Name",
        value: valueOrDash(nextOfKin?.full_name),
      },
      {
        label: "Next of Kin Relationship",
        value: valueOrDash(nextOfKin?.relationship),
      },
      {
        label: "Next of Kin Telephone",
        value: valueOrDash(nextOfKin?.phone_number),
      },
      { label: "KYC Status", value: valueOrDash(profile?.kyc_status) },
      {
        label: "Liveness Status",
        value: valueOrDash(profile?.liveness_status),
      },
      {
        label: "Bank Account Name",
        value: valueOrDash(profile?.account_name),
      },
    ],
    eligibleAmount: formatMoney(metrics?.eligible_amount),
    pendingBill: formatMoney(metrics?.pending_bill),
    repaymentAccounts,
    loansTaken: metrics?.loans_taken ?? 0,
    totalSpend: formatMoney(metrics?.total_spend),
    transactions: [],
  }
}
