import type { SmsProviderSettings, SmsTemplate } from "@/features/sms/types"

export const SMS_FIELD_HINTS = [
  "{first_name}",
  "{amount}",
  "{outstanding}",
  "{due_date}",
  "{days_overdue}",
  "{repayment_account}",
] as const

export const SMS_PARTNERS: { value: SmsProviderSettings["partner"]; label: string }[] =
  [
    { value: "termii", label: "Termii" },
    { value: "africastalking", label: "Africa's Talking" },
    { value: "twilio", label: "Twilio" },
  ]

export const defaultSmsProvider: SmsProviderSettings = {
  partner: "termii",
  apiKey: "TL...................7f2a",
  connected: true,
  unitsLeft: 48210,
}

export const smsTemplates: SmsTemplate[] = [
  {
    id: "active",
    order: 1,
    title: "Active",
    timing: "Not yet due",
    contactsLabel: "Active recovery tab",
    contactCount: "1,204",
    message:
      "Hi {first_name}, thanks for borrowing with Motolend. Your loan of {amount} is due on {due_date}. Repay early in the app to grow your limit.",
    buttonLabel: "Send to Active",
  },
  {
    id: "due-soon",
    order: 2,
    title: "Due soon",
    timing: "2 days before due date",
    contactsLabel: "Due soon recovery tab",
    contactCount: "186",
    message:
      "Hi {first_name}, your Motolend loan of {amount} is due in 2 days on {due_date}. Repay in the app or transfer to {repayment_account}.",
    buttonLabel: "Send to Due soon",
  },
  {
    id: "due-today",
    order: 3,
    title: "Due today",
    timing: "Due within 24 hours",
    contactsLabel: "Due today recovery tab",
    contactCount: "94",
    message:
      "Hi {first_name}, your Motolend repayment of {amount} is due today. Pay now in the app to keep your limit and avoid late fees.",
    buttonLabel: "Send to Due today",
  },
  {
    id: "early-delinquency",
    order: 4,
    title: "Early delinquency",
    timing: "1 to 7 days overdue",
    contactsLabel: "Early delinquency recovery tab",
    contactCount: "312",
    message:
      "Hi {first_name}, your Motolend repayment of {amount} was due on {due_date}. Pay today to avoid extra charges.",
    buttonLabel: "Send to Early delinquency",
  },
  {
    id: "soft-collections",
    order: 5,
    title: "Soft collections",
    timing: "8 to 30 days overdue",
    contactsLabel: "Soft collections recovery tab",
    contactCount: "241",
    message:
      "Hi {first_name}, your Motolend loan is {days_overdue} days overdue. Outstanding: {outstanding}. Reply or call 0700 MOTOLEND if you need a payment plan.",
    buttonLabel: "Send to Soft collections",
  },
  {
    id: "medium-delinquency",
    order: 6,
    title: "Medium delinquency",
    timing: "31 to 60 days overdue",
    contactsLabel: "Medium delinquency recovery tab",
    contactCount: "128",
    message:
      "{first_name}, your Motolend loan of {outstanding} is {days_overdue} days overdue. Pay now to stop further charges and protect your credit record.",
    buttonLabel: "Send to Medium delinquency",
  },
  {
    id: "late-stage",
    order: 7,
    title: "Late stage delinquency",
    timing: "61 to 90 days overdue",
    contactsLabel: "Late stage recovery tab",
    contactCount: "76",
    message:
      "{first_name}, your Motolend loan of {outstanding} is still unpaid after {days_overdue} days. Pay today to avoid being reported to the credit bureau.",
    buttonLabel: "Send to Late stage",
  },
  {
    id: "non-performing",
    order: 8,
    title: "Non-performing",
    timing: "91 to 180 days overdue",
    contactsLabel: "Non-performing recovery tab",
    contactCount: "54",
    message:
      "{first_name}, your Motolend loan of {outstanding} is now non performing and may be reported to credit bureaus. Pay to {repayment_account} or call us today.",
    buttonLabel: "Send to Non-performing",
  },
  {
    id: "doubtful",
    order: 9,
    title: "Doubtful",
    timing: "181 to 360 days overdue",
    contactsLabel: "Doubtful recovery tab",
    contactCount: "33",
    message:
      "{first_name}, final reminder: {outstanding} is still owed to Motolend. Contact us within 7 days to agree a repayment plan.",
    buttonLabel: "Send to Doubtful",
  },
  {
    id: "lost",
    order: 10,
    title: "Lost",
    timing: "Over 360 days overdue",
    contactsLabel: "Lost recovery tab",
    contactCount: "18",
    message:
      "{first_name}, your Motolend loan of {outstanding} has been referred for recovery. Pay to {repayment_account} to close it.",
    buttonLabel: "Send to Lost",
  },
]
