import type { SmsProviderSettings } from "@/features/sms/types"

export const SMS_PARTNERS: {
  value: SmsProviderSettings["partner"]
  label: string
}[] = [
  { value: "termii", label: "Termii" },
  { value: "africastalking", label: "Africa's Talking" },
  { value: "twilio", label: "Twilio" },
]

export const defaultSmsProvider: SmsProviderSettings = {
  partner: "termii",
  apiKey: "",
  connected: false,
  unitsLeft: 0,
}
