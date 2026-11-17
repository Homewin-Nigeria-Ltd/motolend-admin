import type { ChannelService } from "@/features/channel/types"

export const channelServices: ChannelService[] = [
  {
    id: "kyc",
    name: "KYC",
    description: "Identity checks with NIN and BVN",
    partners: [
      { id: "dojah", name: "Dojah", enabled: true },
      { id: "smile-id", name: "Smile ID", enabled: false },
      { id: "prembly", name: "Prembly", enabled: false },
    ],
  },
  {
    id: "credit-bureau",
    name: "Credit Bureau",
    description: "Credit history before approval",
    partners: [
      { id: "crc", name: "CRC Credit Bureau", enabled: true },
      { id: "firstcentral", name: "FirstCentral", enabled: false },
      { id: "creditregistry", name: "CreditRegistry", enabled: false },
    ],
  },
  {
    id: "open-banking",
    name: "Open Banking",
    description: "Bank statement and income checks",
    partners: [
      { id: "mono", name: "Mono", enabled: true },
      { id: "okra", name: "Okra", enabled: false },
    ],
  },
  {
    id: "deposit",
    name: "Deposit",
    description: "Payments coming in",
    partners: [
      { id: "paystack-deposit", name: "Paystack", enabled: true },
      { id: "monnify-deposit", name: "Monnify", enabled: false },
      { id: "palmpay-deposit", name: "Palmpay", enabled: false },
    ],
  },
  {
    id: "withdrawal",
    name: "Withdrawal",
    description: "Loan payouts to customers",
    partners: [
      { id: "palmpay-withdrawal", name: "Palmpay", enabled: true },
      { id: "monnify-withdrawal", name: "Monnify", enabled: false },
      { id: "paylode", name: "Paylode", enabled: false },
    ],
  },
]
