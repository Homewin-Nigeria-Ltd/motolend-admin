export type SmsPartner = "termii" | "africastalking" | "twilio"

export type SmsTemplate = {
  id: string
  order: number
  title: string
  timing: string
  contactsLabel: string
  contactCount: string
  message: string
  buttonLabel: string
}

export type SmsProviderSettings = {
  partner: SmsPartner
  apiKey: string
  connected: boolean
  unitsLeft: number
}
