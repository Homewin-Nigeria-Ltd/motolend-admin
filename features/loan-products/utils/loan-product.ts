import type {
  ApiLoanProduct,
  ApiLoanProductDetailResponse,
  ApiLoanProductMetricsResponse,
  LoanProduct,
  LoanProductDetail,
  LoanProductIntegrationStatus,
  LoanProductKpi,
  LoanProductStatus,
  LoanProductTier,
} from "@/features/loan-products/types"

function displayValue(value: string | null | undefined) {
  const text = value?.trim()
  return text || "—"
}

export function formatLoanProductCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

function formatAmount(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—"
  }

  const numericValue = typeof value === "number" ? value : Number(value)

  if (Number.isNaN(numericValue)) {
    return String(value)
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericValue)
}

function formatDetailValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—"
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  if (typeof value === "number") {
    return formatAmount(value)
  }

  return displayValue(value)
}

function infoRow(
  label: string,
  value: string | number | boolean | null | undefined,
) {
  return {
    label,
    value: formatDetailValue(value),
  }
}

export function normalizeLoanProductStatus(
  product: Pick<ApiLoanProduct, "is_active" | "details">,
): LoanProductStatus {
  const headerStatus = product.details?.header?.status?.trim().toLowerCase()

  if (headerStatus === "active" || headerStatus === "inactive") {
    return headerStatus
  }

  return product.is_active === true ? "active" : "inactive"
}

function normalizeIntegrationStatus(
  status: string | null | undefined,
): LoanProductIntegrationStatus {
  return status?.trim().toLowerCase() === "connected"
    ? "connected"
    : "disconnected"
}

function isApiLoanProduct(value: unknown): value is ApiLoanProduct {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  )
}

function resolveAmountRange(product: ApiLoanProduct) {
  const details = product.details?.loan_amount_and_duration

  const minAmount = details?.min_amount ?? product.min_amount
  const maxAmount = details?.max_amount ?? product.max_amount

  if (
    minAmount !== undefined &&
    minAmount !== null &&
    maxAmount !== undefined &&
    maxAmount !== null
  ) {
    return `${formatAmount(minAmount)} - ${formatAmount(maxAmount)}`
  }

  return "—"
}

function resolveInterest(product: ApiLoanProduct) {
  const detailsRate = product.details?.interest_and_fees?.interest_rate

  if (detailsRate?.trim()) {
    return detailsRate.trim()
  }

  const tierRate = product.tiers?.[0]?.interest_rate

  if (tierRate !== undefined && tierRate !== null) {
    return `${formatAmount(tierRate)}%`
  }

  return displayValue(product.interest_type)
}

function resolveTenure(product: ApiLoanProduct) {
  const detailsTenure = product.details?.loan_amount_and_duration?.loan_tenure

  if (detailsTenure?.trim()) {
    return detailsTenure.trim()
  }

  if (product.tenure != null && product.tenure_type?.trim()) {
    return `${product.tenure} ${product.tenure_type.trim()}`
  }

  if (product.tenure != null) {
    return String(product.tenure)
  }

  return "—"
}

function mapApiTier(
  tier: NonNullable<ApiLoanProduct["tiers"]>[number],
): LoanProductTier {
  return {
    id: String(tier.id),
    minAmount: formatAmount(tier.min_amount),
    maxAmount: formatAmount(tier.max_amount),
    interestRate: `${formatAmount(tier.interest_rate)}%`,
  }
}

function resolveProductId(product: ApiLoanProduct) {
  const headerId = product.details?.header?.id?.trim()

  if (headerId) {
    return headerId.startsWith("#") ? headerId : `#${headerId}`
  }

  return `#${product.id}`
}

export function mapApiLoanProduct(product: ApiLoanProduct): LoanProduct {
  return {
    id: String(product.id),
    name: displayValue(product.details?.header?.name ?? product.name),
    description: displayValue(
      product.details?.overview?.description ?? product.description,
    ),
    amountRange: resolveAmountRange(product),
    interest: resolveInterest(product),
    tenure: resolveTenure(product),
    status: normalizeLoanProductStatus(product),
  }
}

export function extractApiLoanProductDetail(
  response: ApiLoanProductDetailResponse,
) {
  if (!response || typeof response !== "object") {
    return null
  }

  if (isApiLoanProduct(response)) {
    return response
  }

  const wrapped = response as { data?: unknown }

  if (isApiLoanProduct(wrapped.data)) {
    return wrapped.data
  }

  return null
}

export function mapApiLoanProductDetail(
  product: ApiLoanProduct,
): LoanProductDetail {
  const details = product.details
  const overview = details?.overview
  const loanAmountDuration = details?.loan_amount_and_duration
  const interestFees = details?.interest_and_fees
  const repaymentRules = details?.repayment_rules
  const collateralSecurity = details?.collateral_and_security
  const documentRequirements = details?.document_requirements
  const approvalWorkflow = details?.approval_workflow
  const notificationsAlerts = details?.notifications_and_alerts
  const integrations = details?.integrations

  return {
    id: String(product.id),
    productId: resolveProductId(product),
    name: displayValue(details?.header?.name ?? product.name),
    status: normalizeLoanProductStatus(product),
    overview: [
      infoRow("Category", overview?.category ?? product.category),
      infoRow("Description", overview?.description ?? product.description),
      infoRow("Age", overview?.age),
      infoRow("Location", overview?.location),
      infoRow("Employment Status", overview?.employment_status),
      infoRow("Credit Score", overview?.credit_score),
    ],
    loanAmountDuration: [
      infoRow(
        "Min Loan Amount",
        loanAmountDuration?.min_amount ?? product.min_amount,
      ),
      infoRow(
        "Max Loan Amount",
        loanAmountDuration?.max_amount ?? product.max_amount,
      ),
      infoRow(
        "Step Increments",
        loanAmountDuration?.step_increments ?? product.amount_increment,
      ),
      infoRow("Currency", loanAmountDuration?.currency ?? product.currency),
      infoRow(
        "Loan Tenure",
        loanAmountDuration?.loan_tenure ??
          (product.tenure != null && product.tenure_type
            ? `${product.tenure} ${product.tenure_type}`
            : product.tenure),
      ),
      infoRow(
        "Repayment Frequency",
        loanAmountDuration?.repayment_frequency ?? product.repayment_frequency,
      ),
      infoRow(
        "Grace Period",
        loanAmountDuration?.grace_period ?? product.grace_period,
      ),
      infoRow(
        "Loan Start Date Rule",
        loanAmountDuration?.loan_start_date_rule ?? product.start_date_rules,
      ),
    ],
    interestFees: [
      infoRow(
        "Interest Method",
        interestFees?.interest_method ?? product.interest_type,
      ),
      infoRow(
        "Interest Rate",
        interestFees?.interest_rate ?? product.interest_rate ?? resolveInterest(product),
      ),
      infoRow(
        "Processing Fee",
        interestFees?.processing_fee ??
          product.processing_fee ??
          product.credit_protection_fee,
      ),
      infoRow(
        "Late Payment Penalty",
        interestFees?.late_payment_penalty ?? product.late_payment_fee,
      ),
      infoRow(
        "Early Repayment",
        interestFees?.early_repayment ?? product.early_settlement_fee,
      ),
      infoRow(
        "Insurance Fee",
        interestFees?.insurance_fee ?? product.insurance_fee,
      ),
    ],
    repaymentRules: [
      infoRow(
        "Repayment Methods",
        repaymentRules?.repayment_methods ?? product.repayment_methods,
      ),
      infoRow(
        "Payment Allocation",
        repaymentRules?.payment_allocation ?? product.payment_allocation,
      ),
      infoRow(
        "Partial Payments Allowed",
        repaymentRules?.partial_payments_allowed ?? product.partial_payment_allowed,
      ),
      infoRow(
        "Overpayment Handling",
        repaymentRules?.overpayment_handling ?? product.overpayment_handling,
      ),
      infoRow(
        "Auto-Debit",
        repaymentRules?.auto_debit ?? product.auto_debit_settings,
      ),
    ],
    collateralSecurity: [
      infoRow(
        "Collateral Required",
        collateralSecurity?.collateral_required ?? product.collateral_required,
      ),
      infoRow(
        "Collateral Type",
        collateralSecurity?.collateral_type ?? product.collateral_types,
      ),
      infoRow(
        "Collateral Valuation Rules",
        collateralSecurity?.collateral_valuation_rules ?? product.valuation_rules,
      ),
      infoRow("Guarantor Info", collateralSecurity?.guarantor_info),
    ],
    documentRequirements: [
      infoRow(
        "Mandatory Documents",
        documentRequirements?.mandatory_documents ?? product.mandatory_documents,
      ),
      infoRow(
        "Document Type",
        documentRequirements?.document_type ?? product.allowed_document_formats,
      ),
      infoRow(
        "Verification Method",
        documentRequirements?.verification_method ?? product.verification_method,
      ),
    ],
    approvalWorkflow: approvalWorkflow?.name
      ? [
          {
            id: approvalWorkflow.name,
            name: displayValue(approvalWorkflow.name),
            steps: formatDetailValue(approvalWorkflow.steps),
          },
        ]
      : [],
    notificationsAlerts: [
      infoRow("Status Updates", notificationsAlerts?.collateral_required),
      infoRow("Repayment Reminder", notificationsAlerts?.repayment_reminder),
      infoRow("Overdue Alert", notificationsAlerts?.overdue_alert),
    ],
    integrations: [
      {
        id: "credit-bureau",
        name: "Credit Bureau",
        status: normalizeIntegrationStatus(integrations?.credit_bureau),
      },
      {
        id: "payment-gateway",
        name: "Payment Gateway",
        status: normalizeIntegrationStatus(integrations?.payment_gateway),
      },
      {
        id: "id-verification",
        name: "ID Verification",
        status: normalizeIntegrationStatus(integrations?.id_verification),
      },
    ],
    tiers: (product.tiers ?? []).map(mapApiTier),
  }
}

export function mapApiMetricsToLoanProductKpis(
  metrics: ApiLoanProductMetricsResponse,
): LoanProductKpi[] {
  const entries = [
    {
      key: "total",
      label: "Total Products",
      metric: metrics.total_products,
    },
    {
      key: "active",
      label: "Active Products",
      metric: metrics.active_products,
    },
    {
      key: "inactive",
      label: "Inactive Products",
      metric: metrics.inactive_products,
    },
  ] as const

  return entries.map(({ key, label, metric }) => ({
    key,
    label,
    value: formatLoanProductCount(metric.value),
    changePercent: metric.percentage ?? 0,
    trend: metric.direction === "down" ? "down" : "up",
  }))
}
