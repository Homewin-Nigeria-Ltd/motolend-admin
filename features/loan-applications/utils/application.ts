import type {
  ApiApplicationDetail,
  ApiApplicationDetailResponse,
  ApiApplicationMetricsResponse,
  ApiApplicationUser,
  ApiLoanApplication,
  ApplicationDetail,
  ApplicationKpi,
  ApplicationStatus,
  LoanApplication,
} from "@/features/loan-applications/types"
import { formatUserCreatedAt, mapAccountStatusToUserStatus } from "@/features/users/utils/user"

const documentTypeLabels: Record<string, string> = {
  government_id: "Government-issued ID",
  proof_of_address: "Proof of Address",
  bank_statement: "Bank Statement",
  employment_letter: "Employment Letter",
}

export function formatApplicationCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatApplicationAmount(
  amount: number | string | null | undefined,
) {
  if (amount === null || amount === undefined || amount === "") {
    return "—"
  }

  const value = typeof amount === "number" ? amount : Number(amount)

  if (Number.isNaN(value)) {
    return "—"
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)
}

function displayValue(value: string | null | undefined) {
  const text = value?.trim()
  return text || "—"
}

function personName(user: ApiApplicationUser | null | undefined) {
  if (!user) {
    return "—"
  }

  const full =
    user.full_name ||
    user.name ||
    [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ")

  return full?.trim() || user.email?.trim() || "—"
}

export function normalizeApplicationStatus(
  status: string | null | undefined,
): ApplicationStatus {
  const normalized = status?.trim().toLowerCase()

  if (normalized === "approved") return "approved"
  if (normalized === "rejected") return "rejected"
  if (normalized === "disbursed") return "disbursed"
  return "pending"
}

function resolveApplicationId(loan: ApiLoanApplication) {
  const value = String(loan.id)
  return value.startsWith("#") ? value : `#${value}`
}

function resolveLoanType(loan: ApiLoanApplication) {
  const product = loan.loan_product ?? loan.loanProduct
  return product?.name?.trim() || "—"
}

export function resolveDocumentDownloadUrl(url: string | undefined) {
  if (!url?.trim()) {
    return null
  }

  if (url.startsWith("/api/proxy")) {
    return url
  }

  if (url.startsWith("/api/")) {
    return `/api/proxy${url.replace(/^\/api/, "")}`
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  return `/api/proxy${url.startsWith("/") ? url : `/${url}`}`
}

export function extractApiApplicationDetail(
  response: ApiApplicationDetailResponse,
): ApiApplicationDetail | null {
  if (!response || typeof response !== "object") {
    return null
  }

  if ("application_id" in response && "borrower" in response) {
    return response as ApiApplicationDetail
  }

  return (response as { data?: ApiApplicationDetail }).data ?? null
}

export function mapApiLoanToApplication(
  loan: ApiLoanApplication,
): LoanApplication {
  const user = loan.user

  return {
    id: String(loan.id),
    applicationId: resolveApplicationId(loan),
    createdAt: formatUserCreatedAt(loan.created_at),
    customerName: personName(user),
    customerEmail: user?.email?.trim() || "—",
    avatarUrl: user?.avatar_url ?? null,
    loanType: resolveLoanType(loan),
    principal: formatApplicationAmount(loan.amount),
    totalPayable: formatApplicationAmount(loan.total_repayment),
    status: normalizeApplicationStatus(loan.status),
    userId: loan.user_id,
  }
}

export function mapApiApplicationDetail(
  application: ApiApplicationDetail,
): ApplicationDetail {
  const grantors = (application.borrower.grantors ?? []).map((grantor) => ({
    name: displayValue(grantor.name),
    telephone: displayValue(grantor.telephone),
  }))

  return {
    id: String(application.id),
    applicationId: displayValue(application.application_id),
    status: normalizeApplicationStatus(application.status),
    rejectionReason: displayValue(application.rejection_reason),
    dateCreated: displayValue(application.date_created),
    timeCreated: displayValue(application.time_created),
    borrower: {
      id: application.borrower.id,
      fullName: displayValue(application.borrower.full_name),
      email: displayValue(application.borrower.email),
      phone: displayValue(application.borrower.phone),
      dateOfBirth: displayValue(application.borrower.date_of_birth),
      nationality: displayValue(application.borrower.nationality),
      idNumber: displayValue(application.borrower.id_number),
      employmentStatus: displayValue(application.borrower.employment_status),
      companyName: displayValue(application.borrower.company_name),
      jobTitle: displayValue(application.borrower.job_title),
      monthlyIncome: displayValue(application.borrower.monthly_income),
      grantors,
      status: mapAccountStatusToUserStatus(
        application.borrower.account_status ??
          application.borrower.status ??
          "",
      ),
    },
    creditScore: {
      score: application.credit_score.score,
      maxScore: application.credit_score.max_score,
      rating: displayValue(application.credit_score.rating),
    },
    supportingDocuments: (application.supporting_documents ?? []).map(
      (document, index) => ({
        id: `${document.type}-${index}`,
        label: documentTypeLabels[document.type] ?? document.type,
        name: displayValue(document.name),
        size: displayValue(document.size),
        downloadUrl: resolveDocumentDownloadUrl(document.download_url),
      }),
    ),
    loanInformation: {
      loanType: displayValue(application.loan_information.loan_type),
      loanCategory: displayValue(application.loan_information.loan_category),
      description: displayValue(application.loan_information.description),
      amountRequested: displayValue(
        application.loan_information.amount_requested,
      ),
      tenure: displayValue(application.loan_information.tenure),
      interestRate: displayValue(application.loan_information.interest_rate),
      repaymentFrequency: displayValue(
        application.loan_information.repayment_frequency,
      ),
    },
    activityLog: (application.activity_log ?? []).map((entry, index) => ({
      id: `${entry.date_time}-${index}`,
      dateTime: displayValue(entry.date_time),
      action: displayValue(entry.action),
    })),
  }
}

export function mapApiMetricsToApplicationKpis(
  metrics: ApiApplicationMetricsResponse,
): ApplicationKpi[] {
  const entries = [
    {
      key: "total",
      label: "Total Applications",
      metric: metrics.total_applications,
    },
    {
      key: "new",
      label: "New Applications",
      metric: metrics.new_applications,
    },
    {
      key: "approved",
      label: "Approved Applications",
      metric: metrics.approved_applications,
    },
    {
      key: "disbursed",
      label: "Disbursed Loans",
      metric: metrics.disbursed_loans,
    },
    {
      key: "pending",
      label: "Pending Applications",
      metric: metrics.pending_applications,
    },
  ] as const

  return entries.map(({ key, label, metric }) => {
    const trend = metric.trend.direction === "down" ? "down" : "up"

    return {
      key,
      label,
      value: formatApplicationCount(metric.value),
      changePercent: metric.trend.percentage,
      trend,
    }
  })
}
