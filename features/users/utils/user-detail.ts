import type {
  ApiAdminUser,
  UserBankAccount,
  UserDetail,
  UserDetailField,
  UserLoanProgression,
} from "@/features/users/types"
import { formatMoney } from "@/features/users/utils/format-money"
import {
  formatSignedUpOn,
  formatUserRoleLabel,
  getApiUserDisplayName,
  isStaffAdmin,
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

function maskSensitiveId(value: string | null | undefined) {
  const digits = value?.replace(/\D/g, "") ?? ""

  if (!digits) {
    return "—"
  }

  const lastFour = digits.slice(-4)
  return `•••• ••• ${lastFour}`
}

function sensitiveField(
  label: string,
  value: string | null | undefined,
): UserDetailField {
  const raw = value?.trim() || ""

  return {
    label,
    value: raw || "—",
    sensitive: Boolean(raw),
  }
}

function resolvePhotoNote(user: ApiAdminUser) {
  const liveness = user.profile?.liveness_status?.trim().toLowerCase()

  if (liveness === "passed" || liveness === "verified" || liveness === "success") {
    return "Headshot from passport photo"
  }

  if (user.profile?.kyc_status?.trim()) {
    return "Headshot from passport photo"
  }

  return null
}

function buildBankAccounts(
  user: ApiAdminUser,
  displayName: string,
): UserBankAccount[] {
  const profile = user.profile

  const repaymentNumber =
    profile?.repayment_account_number ?? profile?.virtual_account_number
  const repaymentBank =
    profile?.repayment_bank_name ?? profile?.virtual_bank_name
  const repaymentName =
    profile?.repayment_account_name ??
    profile?.virtual_account_name ??
    profile?.account_name ??
    displayName

  return [
    {
      id: "repayment",
      label: "Repayment account",
      accountNumber: valueOrDash(repaymentNumber),
      bankName: valueOrDash(repaymentBank),
      accountName: valueOrDash(repaymentName),
      variant: "success",
    },
    {
      id: "disbursement",
      label: "Disbursement account",
      accountNumber: valueOrDash(profile?.account_number),
      bankName: valueOrDash(profile?.bank_name),
      accountName: valueOrDash(profile?.account_name ?? displayName),
      variant: "success",
    },
  ]
}

function buildLoanProgression(
  metrics: ApiAdminUser["financial_metrics"],
): UserLoanProgression | null {
  const eligible = metrics?.eligible_amount

  if (eligible === null || eligible === undefined || eligible === "") {
    return {
      title: "Loan progression",
      subtitle: "Limits increase after consecutive on-time repayments.",
      href: "/loan-products/progression",
    }
  }

  const eligibleLabel = formatMoney(eligible)

  return {
    title: `${eligibleLabel} loan · Tier 1`,
    subtitle: `Limit ${eligibleLabel} · View how consecutive repayments unlock higher limits.`,
    href: "/loan-products/progression",
  }
}

export function mapApiUserToUserDetail(user: ApiAdminUser): UserDetail {
  const name = getApiUserDisplayName(user)
  const profile = user.profile
  const nextOfKin = user.next_of_kin
  const metrics = user.financial_metrics
  const bankAccounts = buildBankAccounts(user, name)

  const managedStatus = user.status?.trim().toLowerCase()
  const statusSource =
    managedStatus === "active" ||
    managedStatus === "pnd" ||
    managedStatus === "blocked"
      ? managedStatus
      : user.account_status

  return {
    id: user.id,
    name,
    firstName: user.first_name?.trim() || "—",
    lastName: user.last_name?.trim() || "—",
    email: user.email,
    role: formatUserRoleLabel(user),
    isAdmin: isStaffAdmin(user),
    signedUpOn: formatSignedUpOn(user.created_at),
    photoNote: resolvePhotoNote(user),
    status: mapAccountStatusToUserStatus(
      statusSource,
      typeof user.role === "string" ? user.role : "",
    ),
    pendingRepayments: metrics?.pending_repayments_count ?? 0,
    avatarUrl: null,
    accountStatus: (user.status || user.account_status || "")
      .trim()
      .toLowerCase(),
    fields: [
      { label: "Email", value: valueOrDash(user.email) },
      {
        label: "Date of Birth",
        value: formatDateOfBirth(profile?.date_of_birth),
      },
      { label: "Telephone", value: valueOrDash(user.phone) },
      sensitiveField("NIN", user.nin ?? profile?.nin),
      sensitiveField("BVN", user.bvn ?? profile?.bvn),
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
      { label: "Nationality", value: valueOrDash(profile?.nationality) },
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
    ],
    eligibleAmount: formatMoney(metrics?.eligible_amount),
    pendingBill: formatMoney(metrics?.pending_bill),
    bankAccounts,
    repaymentAccounts: bankAccounts,
    loanProgression: buildLoanProgression(metrics),
    loansTaken: metrics?.loans_taken ?? 0,
    totalSpend: formatMoney(metrics?.total_spend),
    transactions: [],
  }
}

export { maskSensitiveId }
