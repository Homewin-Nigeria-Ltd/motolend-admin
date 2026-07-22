import type {
  ApiRepayment,
  ApiRepaymentDetail,
  ApiRepaymentDetailResponse,
  ApiRepaymentScheduleItem,
  Repayment,
  RepaymentDetail,
  RepaymentScheduleItem,
  RepaymentStatus,
} from "@/features/repayments/types"

function displayValue(value: string | null | undefined) {
  const text = value?.trim()
  return text || "—"
}

export function formatRepaymentAmount(
  amount: number | string | null | undefined,
) {
  if (amount === null || amount === undefined || amount === "") {
    return "0"
  }

  const value = typeof amount === "number" ? amount : Number(amount)

  if (Number.isNaN(value)) {
    return "0"
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatRepaymentDueDate(value: string | null | undefined) {
  if (!value?.trim()) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(" ", "")

  return `${datePart} | ${timePart}`
}

export function normalizeRepaymentStatus(
  status: string | null | undefined,
): RepaymentStatus {
  const normalized = status?.trim().toLowerCase()

  if (
    normalized === "active" ||
    normalized === "paid" ||
    normalized === "defaulted" ||
    normalized === "overdue"
  ) {
    return normalized
  }

  return "active"
}

function resolveCustomerName(repayment: ApiRepayment) {
  const user = repayment.user
  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()

  return displayValue(fullName || user?.email)
}

function resolveLoanType(repayment: ApiRepayment) {
  return displayValue(
    repayment.loan_type ?? repayment.loan_product?.name ?? undefined,
  )
}

function resolveLoanId(repayment: ApiRepayment) {
  const loanId = repayment.loan_id ?? repayment.id

  if (loanId === null || loanId === undefined) {
    return "—"
  }

  return `#${loanId}`
}

function resolveAmountPaid(repayment: ApiRepayment) {
  return repayment.amt_paid ?? repayment.amount_paid ?? repayment.amount
}

export function mapApiRepayment(
  repayment: ApiRepayment,
  fallbackStatus?: RepaymentStatus,
): Repayment {
  const status = repayment.status
    ? normalizeRepaymentStatus(repayment.status)
    : (fallbackStatus ?? "active")

  return {
    id: String(repayment.id),
    dueDate: formatRepaymentDueDate(repayment.due_date),
    loanId: resolveLoanId(repayment),
    customerName: resolveCustomerName(repayment),
    customerEmail: displayValue(repayment.user?.email),
    avatarUrl: repayment.user?.profile_photo_url,
    loanType: resolveLoanType(repayment),
    outstanding: formatRepaymentAmount(repayment.outstanding),
    amountPaid: formatRepaymentAmount(resolveAmountPaid(repayment)),
    penalties: formatRepaymentAmount(repayment.penalties),
    status,
    userId: repayment.user_id ? String(repayment.user_id) : repayment.user?.id
      ? String(repayment.user.id)
      : undefined,
  }
}

function resolveDetailLoanId(loanId: string | number | null | undefined) {
  if (loanId === null || loanId === undefined) {
    return "—"
  }

  const text = String(loanId).trim()

  if (!text) {
    return "—"
  }

  return text.startsWith("#") ? text : `#${text}`
}

export function extractApiRepaymentDetail(
  response: ApiRepaymentDetailResponse,
): ApiRepaymentDetail | undefined {
  if ("data" in response && response.data) {
    return response.data
  }

  if ("customer_information" in response || "repayment_schedule" in response) {
    return response
  }

  if ("id" in response) {
    return response
  }

  return undefined
}

function mapApiRepaymentScheduleItem(
  item: ApiRepaymentScheduleItem,
  index: number,
): RepaymentScheduleItem {
  const installmentNo = item.installment_no ?? index + 1

  return {
    id: String(installmentNo),
    installmentNo,
    dueDate: displayValue(item.due_date),
    principal: formatRepaymentAmount(item.principal),
    interest: formatRepaymentAmount(item.interest),
    totalDue: formatRepaymentAmount(item.total_due),
    amountPaid: formatRepaymentAmount(item.amount_paid),
    balance: formatRepaymentAmount(item.balance),
    penalty: formatRepaymentAmount(item.penalty),
    status: displayValue(item.status),
  }
}

export function mapApiRepaymentDetail(
  repayment: ApiRepaymentDetail,
): RepaymentDetail {
  const customer = repayment.customer_information
  const loan = repayment.loan_information

  return {
    id: String(repayment.id),
    loanId: resolveDetailLoanId(repayment.loan_id),
    status: displayValue(repayment.status),
    loanOfficer: displayValue(repayment.loan_officer),
    customerName: displayValue(customer?.customer_name),
    customerEmail: displayValue(customer?.email),
    customerPhone: displayValue(customer?.phone_number),
    loanProduct: displayValue(customer?.loan_product),
    installment: customer?.installment ?? null,
    totalLoan: formatRepaymentAmount(loan?.total_loan),
    repaid: formatRepaymentAmount(loan?.repaid),
    outstanding: formatRepaymentAmount(loan?.outstanding),
    nextDueDate: displayValue(loan?.next_due_date),
    penalties: formatRepaymentAmount(loan?.penalties),
    schedule: (repayment.repayment_schedule ?? []).map(
      mapApiRepaymentScheduleItem,
    ),
  }
}
