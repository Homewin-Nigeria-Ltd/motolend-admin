import type {
  AllocationSettings,
  AllocationSummary,
  DisbursementRecord,
} from "@/features/disbursement/types"

export const defaultAllocationSettings: AllocationSettings = {
  amountAllocated: "5,000,000",
  duration: "daily",
  partner: "palmpay",
  disburseAutomatically: true,
}

export const allocationSummary: AllocationSummary = {
  title: "Today",
  resetNote: "Resets daily at 12:00 AM.",
  disbursed: "₦3,420,000",
  remaining: "₦1,580,000",
  usedPercent: 68,
  totalAllocated: "₦5,000,000",
  loansDisbursed: 57,
  alert:
    "When allocation runs out, new disbursements pause until the next reset or you increase the amount.",
}

export const disbursementRecords: DisbursementRecord[] = [
  {
    id: "1201",
    applicationId: "#1201",
    createdAt: "Nov 16, 2026 | 09:10AM",
    customerName: "Ebiwari Ogan",
    loanProduct: "₦5,000 Loan",
    principal: "5,000",
    bankAccount: "0123456789 - GTBank",
    status: "disbursed",
  },
  {
    id: "1202",
    applicationId: "#1202",
    createdAt: "Nov 16, 2026 | 09:24AM",
    customerName: "Inengite Ekisagha",
    loanProduct: "₦10,000 Loan",
    principal: "10,000",
    bankAccount: "2044556677 - Access Bank",
    status: "disbursed",
  },
  {
    id: "1203",
    applicationId: "#1203",
    createdAt: "Nov 16, 2026 | 10:02AM",
    customerName: "Tariere Amakiri",
    loanProduct: "₦5,000 Loan",
    principal: "5,000",
    bankAccount: "0987654321 - UBA",
    status: "undisbursed",
  },
  {
    id: "1204",
    applicationId: "#1204",
    createdAt: "Nov 16, 2026 | 10:41AM",
    customerName: "Boma Dokubo",
    loanProduct: "₦20,000 Loan",
    principal: "20,000",
    bankAccount: "1122334455 - Zenith Bank",
    status: "disbursed",
  },
  {
    id: "1205",
    applicationId: "#1205",
    createdAt: "Nov 16, 2026 | 11:15AM",
    customerName: "Keme Diepreye",
    loanProduct: "₦10,000 Loan",
    principal: "10,000",
    bankAccount: "5566778899 - First Bank",
    status: "undisbursed",
  },
]
