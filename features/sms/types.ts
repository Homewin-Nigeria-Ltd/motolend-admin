export type SmsPartner = "termii" | "africastalking" | "twilio"

export type SmsTemplate = {
  id: string
  order: number
  title: string
  timing: string
  contactsLabel: string
  contactCount: string
  contactCountRaw: number
  message: string
  buttonLabel: string
  characterCount: number
  smsSegments: number
}

export type SmsOverview = {
  placeholders: string[]
  stages: SmsTemplate[]
}

export type SmsProviderSettings = {
  partner: SmsPartner
  apiKey: string
  connected: boolean
  unitsLeft: number
}

export type ApiRecoverySmsStage = {
  key?: string | null
  label?: string | null
  description?: string | null
  contact_count?: number | string | null
  template?: string | null
  character_count?: number | string | null
  sms_segments?: number | string | null
}

export type ApiRecoverySmsOverview = {
  placeholders?: string[] | null
  stages?: ApiRecoverySmsStage[] | null
}

export type ApiRecoverySmsOverviewResponse =
  | ApiRecoverySmsOverview
  | {
      data?: ApiRecoverySmsOverview
      success?: boolean
    }

export type SendRecoverySmsInput = {
  stage: string
  message: string
  csvFile?: File
}

export type ApiRecoverySmsSendResponse = {
  id: number
  stage: string
  source: "stage" | "csv" | string
  message_template: string
  total_recipients: number
  sent_count: number
  failed_count: number
  status: "queued" | "processing" | "completed" | string
  created_at: string
}
