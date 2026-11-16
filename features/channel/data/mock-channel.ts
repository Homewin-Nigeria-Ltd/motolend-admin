import type { ChannelService } from "@/features/channel/types"

export const channelServices: ChannelService[] = [
  {
    id: "kyc",
    name: "KYC",
    description: "Identity checks with NIN and BVN",
    partners: [
      {
        id: "dojah",
        name: "Dojah",
        enabled: true,
        lastCallLabel: "On · last call 2 min ago",
      },
      {
        id: "smile-id",
        name: "Smile ID",
        enabled: false,
        lastCallLabel: null,
      },
      {
        id: "prembly",
        name: "Prembly",
        enabled: true,
        lastCallLabel: "On · last call 2 min ago",
      },
    ],
  },
  {
    id: "credit-bureau",
    name: "Credit Bureau",
    description: "Credit history before approval",
    partners: [
      {
        id: "crc",
        name: "CRC Credit Bureau",
        enabled: true,
        lastCallLabel: "On · last call 2 min ago",
      },
      {
        id: "firstcentral",
        name: "FirstCentral",
        enabled: true,
        lastCallLabel: "On · last call 2 min ago",
      },
      {
        id: "creditregistry",
        name: "CreditRegistry",
        enabled: false,
        lastCallLabel: null,
      },
    ],
  },
  {
    id: "open-banking",
    name: "Open Banking",
    description: "Bank statement and income checks",
    partners: [
      {
        id: "mono",
        name: "Mono",
        enabled: true,
        lastCallLabel: "On · last call 2 min ago",
      },
      {
        id: "okra",
        name: "Okra",
        enabled: false,
        lastCallLabel: null,
      },
    ],
  },
  {
    id: "deposit",
    name: "Deposit",
    description: "Payments coming in",
    partners: [
      {
        id: "paystack-deposit",
        name: "Paystack",
        enabled: true,
        lastCallLabel: "On · last call 2 min ago",
      },
      {
        id: "monnify-deposit",
        name: "Monnify",
        enabled: true,
        lastCallLabel: "On · last call 2 min ago",
      },
      {
        id: "palmpay-deposit",
        name: "Palmpay",
        enabled: false,
        lastCallLabel: null,
      },
    ],
  },
  {
    id: "withdrawal",
    name: "Withdrawal",
    description: "Loan payouts to customers",
    partners: [
      {
        id: "palmpay-withdrawal",
        name: "Palmpay",
        enabled: true,
        lastCallLabel: "On · last call 2 min ago",
      },
      {
        id: "monnify-withdrawal",
        name: "Monnify",
        enabled: false,
        lastCallLabel: null,
      },
      {
        id: "paylode",
        name: "Paylode",
        enabled: false,
        lastCallLabel: null,
      },
    ],
  },
]
